import { readFile } from "node:fs/promises";
import { Sandbox } from "@vercel/sandbox";

const sandbox = await Sandbox.create({
  image:"vercel/sandbox/ubuntu:latest",
  persistent:false,
  timeout:300_000,
  resources:{vcpus:1},
});
try {
  const assets = ["cloud-launch.sh", "execute.py"];
  await sandbox.writeFiles(await Promise.all(assets.map(async path => ({
    path,content:await readFile(new URL(`../runner/${path}`,import.meta.url)),
  }))));
  const result = await sandbox.runCommand({
    cmd:"/bin/bash",
    sudo:true,
    args:["-euc",[
      "export DEBIAN_FRONTEND=noninteractive",
      "apt-get update -qq",
      "apt-get install -qy --no-install-recommends bubblewrap gcc libc6-dev python3 openjdk-17-jdk-headless",
      "install -D -m 0644 execute.py /opt/algoascend/execute.py",
      "install -m 0755 cloud-launch.sh /opt/algoascend/cloud-launch.sh",
      "rm cloud-launch.sh execute.py",
    ].join("\n")],
  });
  if (result.exitCode !== 0) {
    process.stderr.write((await result.stdout()).slice(-1000));
    process.stderr.write((await result.stderr()).slice(-2000));
    throw new Error("Cloud toolchain preparation failed.");
  }
  const snapshot = await sandbox.snapshot({expiration:0});
  process.stdout.write(`Cloud toolchain ready: ${snapshot.snapshotId}\n`);
} finally {
  await sandbox.stop().catch(() => {});
}
