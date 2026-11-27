import { spawnSync } from "node:child_process";
import { dockerPath, dockerEnvironment } from "./docker.mjs";
import { imageName } from "./sandbox.mjs";

const docker = dockerPath();
const result = spawnSync(docker,["build","--tag",imageName,"runner"],{
  stdio:"inherit",env:dockerEnvironment(docker),windowsHide:true,
});
if (result.error) process.stderr.write("Could not run Docker. Start the Docker Engine and confirm the Docker CLI is installed.\n");
process.exitCode = result.status ?? 1;
