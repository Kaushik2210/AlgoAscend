import { test } from "node:test";
import assert from "node:assert/strict";
import { evaluateSubmission, validateRequest } from "../lib/judge.ts";

test("rejects unrecognized languages, modes, challenges and oversized inputs", () => {
  const base = { problemId: "signal-sum", source: "print(3)", language: "python", mode: "run", stdin: "1 2" };
  assert.equal(validateRequest(base)?.language, "python");
  for (const patch of [{language:"shell"}, {problemId:"unknown"}, {mode:"other"}, {stdin:"x".repeat(8193)}, {source:" "}]) {
    assert.equal(validateRequest({...base, ...patch}), null);
  }
});

test("a hidden mismatch gives a real wrong answer without disclosing case data", async () => {
  const request = validateRequest({problemId:"signal-sum", source:"print(5)", language:"python", mode:"submit", stdin:""})!;
  const result = await evaluateSubmission(request, async () => ({status:3, stdout:"5\n", stderr:"", compileOutput:"", time:"0.01", memory:1024}));
  assert.equal(result.verdict, "Wrong answer");
  assert.equal(result.cases.length, 2);
  assert.deepEqual(result.cases[1], { label:"Hidden case 1", verdict:"Wrong answer" });
});

test("a custom run reports real stdout and keeps the judge explanation", async () => {
  const request = validateRequest({problemId:"signal-sum", source:"print(5)", language:"c", mode:"run", stdin:"9 8"})!;
  const result = await evaluateSubmission(request, async (_source, language, input) => {
    assert.equal(language, "c");
    assert.equal(input, "9 8");
    return {status:6, stdout:"", compileOutput:"missing semicolon", stderr:"", time:null, memory:null};
  });
  assert.equal(result.verdict, "Compilation error");
  assert.equal(result.cases[0].compileOutput, "missing semicolon");
});
