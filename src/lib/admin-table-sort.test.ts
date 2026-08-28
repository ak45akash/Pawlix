import assert from "node:assert/strict";
import test from "node:test";
import { cmpDate, cmpNumber, cmpString, sortRows } from "./admin-table-sort.ts";

test("cmpString compares case-insensitively", () => {
  assert.ok(cmpString("apple", "Banana") < 0);
  assert.equal(cmpString("Dog", "dog"), 0);
});

test("cmpNumber and cmpDate order values", () => {
  assert.equal(cmpNumber(2, 10), -8);
  assert.ok(cmpDate("2026-08-01", "2026-08-20") < 0);
});

test("sortRows uses the selected sorter and falls back safely", () => {
  const rows = [
    { name: "Charlie", score: 40 },
    { name: "Ananya", score: 90 },
    { name: "Rahul", score: 70 },
  ];
  const sorters = {
    "name-asc": (a: (typeof rows)[number], b: (typeof rows)[number]) => cmpString(a.name, b.name),
    "score-desc": (a: (typeof rows)[number], b: (typeof rows)[number]) => cmpNumber(b.score, a.score),
  };

  assert.deepEqual(
    sortRows(rows, "name-asc", sorters).map((row) => row.name),
    ["Ananya", "Charlie", "Rahul"],
  );
  assert.deepEqual(
    sortRows(rows, "score-desc", sorters).map((row) => row.name),
    ["Ananya", "Rahul", "Charlie"],
  );
  assert.deepEqual(
    sortRows(rows, "missing", sorters, "name-asc").map((row) => row.name),
    ["Ananya", "Charlie", "Rahul"],
  );
});
