import { test } from "node:test";
import assert from "node:assert/strict";
import { lessons, recommendNext } from "../lib/curriculum.ts";
import { problems } from "../lib/problems.ts";

test("every original challenge has a matching lesson and a complete editorial", () => {
  assert.equal(new Set(problems.map(problem => problem.id)).size,problems.length);
  for (const problem of problems) {
    assert.equal(lessons.find(lesson => lesson.id === problem.lesson)?.problem,problem.id);
    assert.ok(problem.editorial.approach.length > 20,problem.id);
    assert.ok(problem.editorial.correctness.length > 20,problem.id);
    assert.match(problem.editorial.complexity,/O\(/);
    assert.ok(problem.editorial.edgeCases.length > 0,problem.id);
  }
});

test("a beginner learns input, loops, and then algorithmic patterns", () => {
  assert.equal(recommendNext("new","fundamentals",[])?.id,"input-output");
  assert.equal(recommendNext("new","fundamentals",["input-output"])?.id,"running-total");
  assert.equal(recommendNext("new","fundamentals",["input-output","running-total"])?.id,"binary-search");
  assert.equal(recommendNext("practice","contests",[])?.id,"bubble-sort");
});
