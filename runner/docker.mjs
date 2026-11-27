import { existsSync } from "node:fs";
import { dirname, delimiter, join } from "node:path";

export function dockerPath() {
  if (process.env.ALGO_DOCKER_BIN) return process.env.ALGO_DOCKER_BIN;
  if (process.platform === "win32") {
    const candidates = [
      process.env.LOCALAPPDATA && join(process.env.LOCALAPPDATA,"Programs","DockerDesktop","resources","bin","docker.exe"),
      process.env.ProgramFiles && join(process.env.ProgramFiles,"Docker","Docker","resources","bin","docker.exe"),
    ];
    const installed = candidates.find(candidate => candidate && existsSync(candidate));
    if (installed) return installed;
  }
  return "docker";
}

export function dockerEnvironment(docker) {
  if (process.platform !== "win32" || dirname(docker) === ".") return process.env;
  return {...process.env, Path:dirname(docker) + delimiter + (process.env.Path ?? "")};
}
