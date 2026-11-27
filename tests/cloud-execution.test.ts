import assert from "node:assert/strict";
import { test } from "node:test";
import { cloudSandboxOptions } from "../lib/cloud-execution.ts";

test("cloud jobs use a prebuilt disposable microVM with outbound networking disabled", () => {
  const signal = new AbortController().signal;
  assert.deepEqual(cloudSandboxOptions("snap_test",signal),{
    source:{type:"snapshot",snapshotId:"snap_test"},
    persistent:false,
    networkPolicy:"deny-all",
    resources:{vcpus:1},
    timeout:60_000,
    signal,
  });
});
