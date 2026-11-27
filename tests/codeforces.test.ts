import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizeHandle, readRatingHistory } from "../lib/codeforces.ts";

test("only syntactically valid handles can form rating requests", () => {
  assert.equal(normalizeHandle("  Tourist  "), "tourist");
  assert.equal(normalizeHandle("a_b-123"), "a_b-123");
  assert.equal(normalizeHandle("a;b"), null);
  assert.equal(normalizeHandle("a&lang=en"), null);
  assert.equal(normalizeHandle(null), null);
});

test("rating history is ordered, limited and contains only public contest fields", () => {
  const row = {contestId:1,contestName:"Round 1",rank:4,ratingUpdateTimeSeconds:10,oldRating:0,newRating:1350,handle:"student"};
  const history = readRatingHistory({status:"OK",result:[{...row,contestId:2,ratingUpdateTimeSeconds:20},row,{contestName:"Incomplete"}]});
  assert.deepEqual(history?.map(item => item.contestId),[2,1]);
  assert.equal(history?.[1].delta,1350);
  assert.ok(!Object.hasOwn(history?.[0] ?? {},"handle"));
  assert.deepEqual(readRatingHistory({status:"OK",result:[]}),[]);
  assert.equal(readRatingHistory({status:"FAILED"}),null);
});
