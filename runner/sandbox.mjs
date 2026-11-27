import { execFile } from "node:child_process";
import { randomUUID } from "node:crypto";

export const imageName = "algoascend-sandbox:local";

export function parseJob(data) {
  if (!data || typeof data !== "object") return null;
  const { language, source, stdin } = data;
  if (language !== "c" && language !== "python" && language !== "java") return null;
  if (typeof source !== "string" || !source.trim() || source.length > 20000) return null;
  if (typeof stdin !== "string" || stdin.length > 8192) return null;
  return { language, source, stdin };
}

export function containerArgs(name, image) {
  return [
    "run", "--rm", "--interactive", "--init", "--pull=never",
    "--name", name, "--label=app.algoascend.sandbox=true",
    "--network=none", "--user=65534:65534", "--cap-drop=ALL", "--security-opt=no-new-privileges",
    "--read-only", "--tmpfs=/work:rw,exec,nosuid,nodev,mode=1777,size=16m",
    "--tmpfs=/tmp:rw,nosuid,nodev,noexec,mode=1777,size=16m",
    "--memory=256m", "--memory-swap=256m", "--pids-limit=40", "--cpus=1",
    "--ulimit=nofile=128:128", "--ulimit=fsize=2097152:2097152", "--ulimit=core=0:0",
    "--log-driver=none", "--env=HTTP_PROXY=", "--env=HTTPS_PROXY=", "--env=ALL_PROXY=",
    "--env=NO_PROXY=", "--env=http_proxy=", "--env=https_proxy=", "--env=all_proxy=", "--env=no_proxy=",
    image,
  ];
}

export async function runSandbox(job, docker, image = imageName) {
  const name = `algoascend-job-${randomUUID()}`;
  try {
    const output = await new Promise((resolve, reject) => {
      const child = execFile(docker, containerArgs(name, image), {
        encoding:"utf8", timeout:16000, maxBuffer:1_000_000, windowsHide:true,
      }, (error, stdout) => error ? reject(error) : resolve(stdout));
      child.stdin?.on("error", () => {});
      child.stdin?.end(JSON.stringify(job), "utf8");
    });
    return JSON.parse(output);
  } catch {
    await new Promise(resolve => {
      execFile(docker, ["rm", "-f", name], {timeout:5000, windowsHide:true}, () => resolve());
    });
    throw new Error("The sandbox could not complete the job.");
  }
}
