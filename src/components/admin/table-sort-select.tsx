"use client";

import { Select } from "@/components/ui/field";
import type { TableSortOption } from "@/lib/admin-table-sort";

export function TableSortSelect({
  options,
  value,
  onChange,
  className,
}: {
  options: TableSortOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  if (options.length <= 1) return null;

  return (
    <div className={className ?? "flex items-center gap-2"}>
      <span className="text-sm text-ink-muted">Sort</span>
      <Select
        className="h-9 w-auto min-w-[11rem] text-sm"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label="Sort table"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </div>
  );
}
