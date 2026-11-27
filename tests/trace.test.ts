import { test } from "node:test";
import assert from "node:assert/strict";
import { binaryTrace, bubbleTrace, linearFind, parseValues } from "../lib/trace.ts";

test("binary search narrows the interval and returns the first matching index", () => {
  const frames = binaryTrace([2, 4, 4, 4, 9, 17], 4);
  assert.deepEqual(frames.filter(frame => frame.line === 1).map(frame => frame.active[0]), [2, 0, 1]);
  assert.equal(frames.at(-1)?.result, 1);
});

test("binary search reports missing targets and requires sorted inputs", () => {
  assert.equal(binaryTrace([2, 5, 8], 3).at(-1)?.result, -1);
  assert.throws(() => binaryTrace([5, 2], 3), /sorted/);
  assert.equal(binaryTrace([], 3).at(-1)?.result, -1);
});

test("bubble sort captures swaps and supports signed integers and duplicates", () => {
  const frames = bubbleTrace([4, -2, 4, 0]);
  assert.deepEqual(frames[0].values, [4, -2, 4, 0]);
  assert.deepEqual(frames.at(-1)?.values, [-2, 0, 4, 4]);
  assert.equal(frames.at(-1)?.operations, 6);
  assert.ok(frames.some(frame => frame.line === 2));
});

test("input accepts bounded integers and rejects malformed lists", () => {
  assert.deepEqual(parseValues("1, -2, 0"), [1, -2, 0]);
  assert.throws(() => parseValues("1,,2"));
  assert.throws(() => parseValues("1e2"));
  assert.throws(() => parseValues("1000"));
});

test("the linear comparison uses the same array and counts inspected values", () => {
  assert.deepEqual(linearFind([2, 7, 7, 9], 7), {index:1, comparisons:2});
  assert.deepEqual(linearFind([2, 7, 7, 9], 4), {index:-1, comparisons:4});
  assert.deepEqual(linearFind([], 4), {index:-1, comparisons:0});
});
