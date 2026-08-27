"use client";

import { formatDate } from "@/lib/format";
import { useDemo } from "@/lib/demo-store";

export default function AuditPage() {
  const { state } = useDemo();
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Audit log</h1>
      <div className="mt-6 space-y-3">
        {state.auditLogs.map((entry) => (
          <div key={entry.id} className="rounded-lg border border-border bg-surface p-4 text-sm">
            <p className="font-medium">
              {entry.actor} · {entry.action}
            </p>
            <p className="text-ink-muted">
              {entry.entity} {entry.entityId} · {entry.detail}
            </p>
            <p className="mt-1 text-xs text-ink-muted">{formatDate(entry.createdAt)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
