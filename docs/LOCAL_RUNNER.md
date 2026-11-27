# Local code execution

AlgoAscend can run C, Python, and Java using Docker Desktop in Linux-container mode on Windows, or Docker Engine on Linux. Start Docker, then run these commands from the repository:

```sh
npm ci
npm run runner:configure
npm run runner:build
npm run runner:serve
```

The configuration command writes a random runner token and the loopback URL to the ignored `.env.local` file. The build command creates the local sandbox image. The runner listens on `127.0.0.1:2359` by default. Keep that process running while using the workspace.

In another terminal, start the app with `npm run dev`, or use `npm run build` and `npm run start` for its production build. Open [Signal Sum](http://127.0.0.1:3000/practice/signal-sum), choose the runtime, and use **Run code** or **Submit code**. Java submissions use a class named `Main`. [View a live submission](screenshots/live-execution.png). To use a custom Docker CLI, set the optional server-side `ALGO_DOCKER_BIN` variable.

## Execution boundaries

Each sample or hidden case runs in a fresh, disposable Linux container. It gets no external network, host mounts, Docker socket, or elevated capabilities. The container runs under an unprivileged UID with a read-only root and bounded temporary storage. It uses Docker's default seccomp profile, a one-core CPU quota, a 256 MiB memory limit, and a 40-process limit. Compiler and runtime deadlines are six and three seconds respectively. Standard output and error are capped at 64 KiB each. The judge exposes compiler messages and stdout for samples and custom runs, with verdicts only for hidden cases.

The local runner is intended for the loopback development app. Containers share the Docker engine's kernel. A public service needs a dedicated execution host, a reviewed isolation boundary, application authentication, and shared resource quotas. Existing remote Judge0 deployments can still use the Judge0 configuration. Local runner configuration takes priority when both are supplied.

## Smoke test

With the runner running and the app built, run the browser suite using `ALGO_LIVE_EXECUTION=1`. For PowerShell:

```powershell
$env:ALGO_LIVE_EXECUTION = '1'
npm run test:e2e -- --grep 'live code execution'
```

The live suite checks browser Run and Submit in all three runtimes, compiler errors, runtime and resource-limit verdicts, and the sandbox network and filesystem settings. The default browser suite verifies the guest fallback with execution services disabled.
