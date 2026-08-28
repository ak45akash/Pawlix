import assert from "node:assert/strict";
import test from "node:test";
import {
  businessHoursSummary,
  defaultWeeklyBusinessHours,
  formatBusinessHours,
  validateBusinessHours,
} from "./business-hours.ts";

test("formatBusinessHours groups consecutive weekdays with the same hours", () => {
  const hours = defaultWeeklyBusinessHours();
  assert.match(formatBusinessHours(hours), /Mon–Sat · 10:00–19:00/);
  assert.match(formatBusinessHours(hours), /Sun · Closed/);
});

test("businessHoursSummary returns one line per schedule group", () => {
  const lines = businessHoursSummary(defaultWeeklyBusinessHours());
  assert.equal(lines.length, 2);
  assert.match(lines[0]!, /Mon–Sat/);
  assert.match(lines[1]!, /Sun · Closed/);
});

test("validateBusinessHours rejects close before open", () => {
  const hours = defaultWeeklyBusinessHours();
  hours.monday = { closed: false, open: "18:00", close: "10:00" };
  assert.throws(() => validateBusinessHours(hours), /Monday/);
});
