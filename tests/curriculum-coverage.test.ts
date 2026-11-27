import assert from "node:assert/strict";
import { test } from "node:test";
import { lessons, stages } from "../lib/curriculum.ts";
import { problems } from "../lib/problems.ts";

test("every stage has a published lesson and every published lesson has runnable practice", () => {
  for (const [stage,title] of stages.entries()) {
    assert.ok(lessons.some(lesson => lesson.stage === stage),title);
  }
  assert.equal(new Set(lessons.map(lesson => lesson.id)).size,lessons.length);
  for (const lesson of lessons) {
    assert.ok(problems.some(problem => problem.id === lesson.problem && problem.lesson === lesson.id),lesson.id);
    assert.ok(lesson.answers[lesson.correct],lesson.id);
    for (const code of Object.values(lesson.code)) assert.ok(code.trim(),lesson.id);
  }
});
