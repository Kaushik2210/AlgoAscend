import { test } from "node:test";
import assert from "node:assert/strict";
import { estimateWork } from "../lib/complexity.ts";

test("compares common growth rates at the same input size and budget", () => {
  const rows = estimateWork(100_000, 100_000_000);
  assert.equal(rows.find(row => row.kind === "O(n²)")?.fits, false);
  assert.equal(rows.find(row => row.kind === "O(n log n)")?.fits, true);
  assert.equal(rows.find(row => row.kind === "O(n)")?.work, 100_000);
});

test("caps estimates whose exact size cannot be represented and rejects invalid bounds", () => {
  assert.equal(estimateWork(54, 100_000)[5].work, null);
  assert.equal(estimateWork(20, 100_000)[5].work, 1_048_576);
  assert.throws(() => estimateWork(0, 100_000));
  assert.throws(() => estimateWork(30, Number.NaN));
});
