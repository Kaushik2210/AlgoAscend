"""Trusted entry point in a disposable execution container."""

import json
import os
from pathlib import Path
import signal
import subprocess
import sys
from tempfile import TemporaryFile
from time import monotonic


LIMIT = 64 * 1024
ENV = {
    "PATH": "/usr/bin:/bin",
    "HOME": "/work",
    "TMPDIR": "/tmp",
    "LANG": "C.UTF-8",
}
JAVAC = (
    "/usr/bin/javac", "-J-Xmx96m", "-J-XX:ActiveProcessorCount=1",
    "-proc:none", "-encoding", "UTF-8", "Main.java",
)
JAVA = (
    "/usr/bin/java", "-Xmx96m", "-XX:ActiveProcessorCount=1",
    "-Djava.io.tmpdir=/tmp", "-cp", "/work", "Main",
)
LANGUAGES = {
    "c": ("main.c", ("/usr/bin/gcc", "-std=c17", "-O2", "main.c", "-o", "program"), ("/work/program",)),
    "python": ("main.py", ("/usr/bin/python3", "-I", "-m", "py_compile", "main.py"), ("/usr/bin/python3", "-I", "main.py")),
    "java": ("Main.java", JAVAC, JAVA),
}


def oom_kills():
    try:
        return next(
            int(line.split()[1])
            for line in Path("/sys/fs/cgroup/memory.events").read_text().splitlines()
            if line.startswith("oom_kill ")
        )
    except (OSError, ValueError, StopIteration):
        return 0


def execute(command, input_text, deadline, failure_status, environment=ENV):
    before = oom_kills()
    started = monotonic()
    with TemporaryFile(dir="/work") as stdin, TemporaryFile(dir="/work") as stdout, TemporaryFile(dir="/work") as stderr:
        stdin.write(input_text.encode("utf-8"))
        stdin.seek(0)
        with subprocess.Popen(command, stdin=stdin, stdout=stdout, stderr=stderr, env=environment, start_new_session=True) as child:
            timed_out = False
            try:
                child.wait(timeout=deadline)
            except subprocess.TimeoutExpired:
                timed_out = True
            finally:
                try:
                    os.killpg(child.pid, signal.SIGKILL)
                except ProcessLookupError:
                    pass
                child.wait()
        elapsed = monotonic() - started
        stdout.seek(0)
        stderr.seek(0)
        output = stdout.read(LIMIT + 1)
        errors = stderr.read(LIMIT + 1)

    if oom_kills() > before:
        status = 17
    elif timed_out:
        status = 5
    elif len(output) > LIMIT or len(errors) > LIMIT:
        status = failure_status
        errors = b"Output exceeded the 64 KiB per-stream limit."
    else:
        status = 3 if child.returncode == 0 else failure_status
    return status, output[:LIMIT].decode("utf-8", errors="replace"), errors[:LIMIT].decode("utf-8", errors="replace"), elapsed


def main():
    job = json.load(sys.stdin)
    filename, compile_command, run_command = LANGUAGES[job["language"]]
    environment = ENV
    vm_limits = os.getenv("ALGO_VM_LIMITS") == "1"
    if vm_limits and job["language"] == "java":
        jdk = "/usr/lib/jvm/java-17-openjdk-amd64"
        environment = {**ENV, "JAVA_HOME": jdk, "LD_LIBRARY_PATH": f"{jdk}/lib:{jdk}/lib/server"}
        compile_command = (f"{jdk}/bin/javac", *JAVAC[1:])
        run_command = (f"{jdk}/bin/java", "-XX:+ExitOnOutOfMemoryError", *JAVA[1:])
    elif vm_limits:
        address_limit = ("/usr/bin/prlimit", "--as=268435456:268435456", "--")
        compile_command = address_limit + compile_command
        run_command = address_limit + run_command

    Path(filename).write_text(job["source"], encoding="utf-8")
    status, output, errors, _ = execute(compile_command, "", 6, 6, environment)
    if status != 3:
        return dict(status=status, stdout="", stderr="", compileOutput=errors or output, time=None, memory=None)

    status, output, errors, elapsed = execute(run_command, job["stdin"], 3, 12, environment)
    if vm_limits and status == 12:
        if job["language"] == "python" and errors.rstrip().endswith("MemoryError"):
            status = 17
        elif job["language"] == "java" and output.startswith("Terminating due to java.lang.OutOfMemoryError"):
            status = 17
    return dict(status=status, stdout=output, stderr=errors, compileOutput="", time=f"{elapsed:.3f}", memory=None)


if __name__ == "__main__":
    print(json.dumps(main(), ensure_ascii=False))
