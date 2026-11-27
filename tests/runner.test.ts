import assert from "node:assert/strict";
import { test } from "node:test";
import { containerArgs, parseJob } from "../runner/sandbox.mjs";

test("sandbox launches with bounded resources and no host access", () => {
  const args = containerArgs("algoascend-test", "local-sandbox");
  for (const flag of ["--network=none", "--user=65534:65534", "--cap-drop=ALL", "--security-opt=no-new-privileges", "--read-only", "--memory=256m", "--memory-swap=256m", "--pids-limit=40", "--cpus=1", "--pull=never"]) assert.ok(args.includes(flag), flag);
  assert.ok(args.every(arg => !/^(--privileged|-v|--volume|--mount|--device)(=|$)/.test(arg)));
  assert.ok(args.includes("--tmpfs=/work:rw,exec,nosuid,nodev,mode=1777,size=16m"));
  assert.equal(args.at(-1), "local-sandbox");
});

test("accepts only supported compiler inputs and returns a fixed payload", () => {
  const base = {language:"java",source:"class Main {}",stdin:"",args:["unused"],image:"ignored"};
  assert.deepEqual(parseJob(base),{language:"java",source:"class Main {}",stdin:""});
  for (const patch of [{language:"bash"},{source:" "},{source:"a".repeat(20001)},{stdin:"a".repeat(8193)},{stdin:15}]) {
    assert.equal(parseJob({...base,...patch}),null);
  }
});
