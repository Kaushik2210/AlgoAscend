import { test } from "node:test";
import assert from "node:assert/strict";
import { patternChallenges, evaluatePattern } from "../lib/patterns.ts";

test("each challenge explains why the strongest and alternative approaches behave differently", () => {
  for (const challenge of patternChallenges) {
    const correct = challenge.options.filter(option => evaluatePattern(challenge.id,option.id)?.correct);
    assert.equal(correct.length,1);
    assert.ok(evaluatePattern(challenge.id,correct[0].id)?.explanation);
    for (const other of challenge.options.filter(option => option !== correct[0])) {
      const result = evaluatePattern(challenge.id,other.id);
      assert.equal(result?.correct,false);
      assert.ok(result?.explanation);
    }
  }
});

test("an unmatched choice cannot produce a completion", () => {
  assert.equal(evaluatePattern("unknown","linear"),null);
  assert.equal(evaluatePattern(patternChallenges[0].id,"unknown"),null);
});
