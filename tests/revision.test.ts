import { test } from "node:test";
import assert from "node:assert/strict";
import { dueReviews, recordReview } from "../lib/revision.ts";

const start = Date.UTC(2026,10,27);
const day = 86_400_000;

test("a correct answer starts a one-day interval and early repetition leaves it unchanged", () => {
  const first = recordReview(undefined,true,start);
  assert.deepEqual(first,{dueAt:start+day,intervalDays:1,attempts:1,misses:0});
  assert.deepEqual(recordReview(first,true,start+day/2),first);
  assert.deepEqual(recordReview(first,true,start+day),{dueAt:start+4*day,intervalDays:3,attempts:2,misses:0});
});

test("a miss schedules immediate revision and restarts the interval", () => {
  const missed = recordReview(recordReview(undefined,true,start),false,start+day);
  assert.deepEqual(missed,{dueAt:start+day,intervalDays:0,attempts:2,misses:1});
  assert.deepEqual(dueReviews({later:{...missed,dueAt:start+2*day},now:missed,earlier:{...missed,dueAt:start}},start+day).map(([id]) => id),["earlier","now"]);
});
