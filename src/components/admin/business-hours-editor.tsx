"use client";

import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import {
  applyHoursToDays,
  BUSINESS_DAYS,
  BUSINESS_DAY_LABELS,
  formatBusinessHours,
} from "@/lib/business-hours";
import type { BusinessDayHours, BusinessDayKey, WeeklyBusinessHours } from "@/types/catalog";

const WEEKDAYS: BusinessDayKey[] = ["monday", "tuesday", "wednesday", "thursday", "friday"];

export function BusinessHoursEditor({
  value,
  onChange,
}: {
  value: WeeklyBusinessHours;
  onChange: (next: WeeklyBusinessHours) => void;
}) {
  function updateDay(key: BusinessDayKey, patch: Partial<BusinessDayHours>) {
    onChange({ ...value, [key]: { ...value[key], ...patch } });
  }

  function applyTemplate(template: BusinessDayHours, keys: BusinessDayKey[]) {
    onChange(applyHoursToDays(value, keys, template));
  }

  const preview = formatBusinessHours(value);

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink-muted">
        Store hours repeat every week. Use the grid below for each day — a date calendar is better saved for one-off holidays later.
      </p>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => applyTemplate(value.monday, WEEKDAYS)}
        >
          Copy Monday to weekdays
        </Button>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => applyTemplate(value.monday, BUSINESS_DAYS)}
        >
          Copy Monday to all days
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[36rem] text-left text-sm">
          <thead className="border-b border-border bg-canvas text-xs uppercase tracking-wide text-ink-muted">
            <tr>
              <th className="px-3 py-2 font-medium">Day</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Opens</th>
              <th className="px-3 py-2 font-medium">Closes</th>
            </tr>
          </thead>
          <tbody>
            {BUSINESS_DAYS.map((key) => {
              const day = value[key];
              return (
                <tr key={key} className="border-b border-border last:border-0">
                  <td className="px-3 py-3 font-medium">{BUSINESS_DAY_LABELS[key]}</td>
                  <td className="px-3 py-3">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={day.closed}
                        onChange={(event) => updateDay(key, { closed: event.target.checked })}
                      />
                      Closed
                    </label>
                  </td>
                  <td className="px-3 py-3">
                    <Input
                      type="time"
                      value={day.open}
                      disabled={day.closed}
                      onChange={(event) => updateDay(key, { open: event.target.value })}
                      className="h-9"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <Input
                      type="time"
                      value={day.close}
                      disabled={day.closed}
                      onChange={(event) => updateDay(key, { close: event.target.value })}
                      className="h-9"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Field label="Timezone label" hint="Shown on the contact page and receipts.">
        <Select value={value.timezone} onChange={(event) => onChange({ ...value, timezone: event.target.value })}>
          <option value="IST">IST (India)</option>
          <option value="UTC">UTC</option>
        </Select>
      </Field>

      <div className="rounded-md border border-border bg-canvas px-3 py-2">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">Preview</p>
        <p className="mt-1 text-sm">{preview}</p>
      </div>
    </div>
  );
}
