import { Sandbox } from "@vercel/sandbox";
import type { Execution, Runner } from "./judge";

export function cloudSandboxOptions(snapshotId: string, signal: AbortSignal) {
  return {
    source:{type:"snapshot" as const,snapshotId},
    persistent:false,
    networkPolicy:"deny-all" as const,
    resources:{vcpus:1},
    timeout:60_000,
    signal,
  };
}

export async function withCloudRunner<T>(snapshotId: string, signal: AbortSignal, evaluate: (run: Runner) => Promise<T>): Promise<T> {
  const deadline = AbortSignal.any([signal,AbortSignal.timeout(55_000)]);
  const sandbox = await Sandbox.create(cloudSandboxOptions(snapshotId,deadline));
  try {
    return await evaluate(async (source,language,stdin) => {
      await sandbox.writeFiles([{path:"algoascend-job.json",content:Buffer.from(JSON.stringify({source,language,stdin}))}],{signal:deadline});
      const command = await sandbox.runCommand({
        cmd:"/bin/sh",
        args:["-ec","exec /opt/algoascend/cloud-launch.sh < algoascend-job.json"],
        sudo:true,
        signal:deadline,
      });
      if (command.exitCode !== 0) throw new Error("Sandbox job failed.");
      const output = await command.stdout({signal:deadline});
      const result = JSON.parse(output) as Execution;
      if (!Number.isInteger(result.status) || typeof result.stdout !== "string" ||
          typeof result.stderr !== "string" || typeof result.compileOutput !== "string") {
        throw new Error("Invalid sandbox result.");
      }
      return result;
    });
  } finally {
    await sandbox.stop({signal:AbortSignal.timeout(3_000)}).catch(() => {
      // The microVM session also expires at its provider-enforced deadline.
    });
  }
}
