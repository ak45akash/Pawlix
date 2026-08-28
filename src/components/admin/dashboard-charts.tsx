"use client";

import { cn } from "@/lib/utils/cn";
import { formatInr, formatInrCompact } from "@/lib/format";
import type { ChannelSlice, DayBucket, ProductRank, StatusSlice } from "@/lib/dashboard-metrics";

const CHART = {
  accent: "#c45c26",
  accentSoft: "#e07a45",
  success: "#3d6b4f",
  muted: "#6b625b",
  border: "#e4dbd1",
  surface: "#fffcf8",
};

export function ChartCard({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-xl border border-border bg-surface p-5 shadow-sm", className)}>
      <div className="mb-4">
        <h2 className="font-medium tracking-tight">{title}</h2>
        {subtitle ? <p className="mt-0.5 text-xs text-ink-muted">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}

export function RevenueTrendChart({ data }: { data: DayBucket[] }) {
  const width = 560;
  const height = 220;
  const pad = { top: 16, right: 12, bottom: 32, left: 48 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const maxRevenue = Math.max(...data.map((row) => row.revenue), 1);
  const step = data.length > 1 ? innerW / (data.length - 1) : innerW;

  const points = data.map((row, index) => {
    const x = pad.left + index * step;
    const y = pad.top + innerH - (row.revenue / maxRevenue) * innerH;
    return { x, y, row };
  });

  const line = points.map((point) => `${point.x},${point.y}`).join(" ");
  const area = [
    `${points[0]?.x ?? pad.left},${pad.top + innerH}`,
    ...points.map((point) => `${point.x},${point.y}`),
    `${points.at(-1)?.x ?? pad.left},${pad.top + innerH}`,
  ].join(" ");

  const yTicks = [0, 0.5, 1].map((ratio) => ({
    y: pad.top + innerH - ratio * innerH,
    label: formatInrCompact(maxRevenue * ratio),
  }));

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="min-w-full" role="img" aria-label="Revenue trend over the last seven days">
        {yTicks.map((tick) => (
          <g key={tick.label}>
            <line x1={pad.left} y1={tick.y} x2={width - pad.right} y2={tick.y} stroke={CHART.border} strokeDasharray="4 4" />
            <text x={pad.left - 8} y={tick.y + 4} textAnchor="end" className="fill-ink-muted text-[10px]">
              {tick.label}
            </text>
          </g>
        ))}
        <polygon points={area} fill={CHART.accent} fillOpacity={0.12} />
        <polyline points={line} fill="none" stroke={CHART.accent} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
        {points.map((point) => (
          <g key={point.row.key}>
            <circle cx={point.x} cy={point.y} r={4} fill={CHART.surface} stroke={CHART.accent} strokeWidth={2} />
            <text x={point.x} y={height - 8} textAnchor="middle" className="fill-ink-muted text-[10px]">
              {point.row.label}
            </text>
          </g>
        ))}
      </svg>
      <div className="mt-2 flex flex-wrap gap-4 text-xs text-ink-muted">
        {data.map((row) => (
          <span key={row.key}>
            <span className="font-medium text-ink">{formatInrCompact(row.revenue)}</span> · {row.orders} orders
          </span>
        ))}
      </div>
    </div>
  );
}

export function ChannelDonutChart({ slices }: { slices: ChannelSlice[] }) {
  const total = slices.reduce((sum, slice) => sum + slice.value, 0);
  const radius = 54;
  const stroke = 16;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  const colors = [CHART.accent, CHART.success];

  if (!total) {
    return <p className="py-10 text-center text-sm text-ink-muted">No sales in this period.</p>;
  }

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:justify-between">
      <svg viewBox="0 0 140 140" className="size-36 shrink-0" role="img" aria-label="Online versus offline sales split">
        <circle cx="70" cy="70" r={radius} fill="none" stroke={CHART.border} strokeWidth={stroke} />
        {slices.map((slice, index) => {
          const length = (slice.value / total) * circumference;
          const dash = `${length} ${circumference - length}`;
          const currentOffset = offset;
          offset += length;
          return (
            <circle
              key={slice.channel}
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke={colors[index] ?? CHART.accentSoft}
              strokeWidth={stroke}
              strokeDasharray={dash}
              strokeDashoffset={-currentOffset}
              transform="rotate(-90 70 70)"
              strokeLinecap="butt"
            />
          );
        })}
        <text x="70" y="66" textAnchor="middle" className="fill-ink text-[11px] font-medium">
          Total
        </text>
        <text x="70" y="82" textAnchor="middle" className="fill-ink text-[12px] font-semibold">
          {formatInrCompact(total)}
        </text>
      </svg>
      <ul className="w-full space-y-3 text-sm">
        {slices.map((slice, index) => {
          const pct = Math.round((slice.value / total) * 100);
          return (
            <li key={slice.channel} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2">
                <span className="size-2.5 rounded-full" style={{ backgroundColor: colors[index] ?? CHART.accentSoft }} />
                {slice.label}
              </span>
              <span className="text-right tabular-nums">
                <span className="font-medium">{formatInr(slice.value)}</span>
                <span className="block text-xs text-ink-muted">
                  {pct}% · {slice.orders} orders
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function TopProductsChart({ items }: { items: ProductRank[] }) {
  const max = Math.max(...items.map((item) => item.revenue), 1);

  if (!items.length) {
    return <p className="py-8 text-center text-sm text-ink-muted">No product sales in this period.</p>;
  }

  return (
    <ul className="space-y-4" role="list">
      {items.map((item, index) => {
        const width = Math.max((item.revenue / max) * 100, 4);
        return (
          <li key={item.productId}>
            <div className="mb-1 flex items-center justify-between gap-3 text-sm">
              <span className="truncate font-medium">
                <span className="mr-2 text-xs text-ink-muted">{index + 1}.</span>
                {item.name}
              </span>
              <span className="shrink-0 tabular-nums text-ink-muted">
                {formatInr(item.revenue)} · {item.units} units
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-canvas">
              <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${width}%` }} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function StatusBarsChart({ slices }: { slices: StatusSlice[] }) {
  const max = Math.max(...slices.map((slice) => slice.count), 1);

  if (!slices.length) {
    return <p className="py-8 text-center text-sm text-ink-muted">No orders in this period.</p>;
  }

  return (
    <ul className="space-y-3">
      {slices.map((slice) => {
        const width = Math.max((slice.count / max) * 100, 6);
        return (
          <li key={slice.status} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 text-sm">
            <div>
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="truncate">{slice.status}</span>
                <span className="tabular-nums text-ink-muted">{slice.count}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-canvas">
                <div className="h-full rounded-full bg-success/80" style={{ width: `${width}%` }} />
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function StatCard({
  label,
  value,
  hint,
  trend,
  icon: Icon,
  tone = "accent",
}: {
  label: string;
  value: string;
  hint?: string;
  trend?: number;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "accent" | "success" | "danger";
}) {
  const iconTone =
    tone === "success" ? "bg-success-soft text-success" : tone === "danger" ? "bg-danger-soft text-danger" : "bg-accent-soft text-accent";

  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-ink-muted">{label}</p>
        <div className={cn("rounded-lg p-2", iconTone)}>
          <Icon className="size-4" />
        </div>
      </div>
      <p className="mt-3 text-2xl font-semibold tabular-nums tracking-tight">{value}</p>
      {hint ? <p className="mt-1 text-xs text-ink-muted">{hint}</p> : null}
      {trend !== undefined ? (
        <p className={cn("mt-2 text-xs font-medium", trend >= 0 ? "text-success" : "text-danger")}>
          {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}% vs prior period
        </p>
      ) : null}
    </div>
  );
}
