"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Field, Input } from "@/components/ui/field";
import { MarketingPageHeader, RequireMarketing } from "@/components/admin/marketing-shell";
import { useDemo } from "@/lib/demo-store";

export default function NewsletterPage() {
  return (
    <RequireMarketing>
      <NewsletterTools />
    </RequireMarketing>
  );
}

function NewsletterTools() {
  const { state, addNewsletterSubscriber, removeNewsletterSubscriber, can } = useDemo();
  const canEdit = can("seo.edit");
  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  function exportCsv() {
    const rows = [["email", "source", "subscribed_at"], ...state.newsletterSubscribers.map((row) => [row.email, row.source, row.subscribedAt])];
    const csv = rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "pawlix-newsletter.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <MarketingPageHeader
          title="Newsletter"
          description="Subscriber list from the storefront signup form. Email sending is not connected yet — export CSV when you are ready for a provider."
        />
        <Button size="sm" variant="secondary" onClick={exportCsv}>
          Export CSV
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-surface p-5">
        <h2 className="font-medium">Send a broadcast (coming soon)</h2>
        <p className="mt-2 text-sm text-ink-muted">
          When email is wired up, use this list for restock alerts, new recipes, and monsoon care notes. For now, export and use your preferred tool.
        </p>
      </div>

      {canEdit ? (
        <form
          className="flex flex-wrap gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            setError("");
            setNotice("");
            try {
              addNewsletterSubscriber(email, "admin");
              setEmail("");
              setNotice("Subscriber added.");
            } catch (caught) {
              setError(caught instanceof Error ? caught.message : "Could not add.");
            }
          }}
        >
          <Field label="Add subscriber manually">
            <Input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="hello@example.com" required />
          </Field>
          <div className="flex items-end">
            <Button type="submit">Add</Button>
          </div>
          {error ? <p className="w-full text-sm text-danger">{error}</p> : null}
          {notice ? <p className="w-full text-sm text-success">{notice}</p> : null}
        </form>
      ) : null}

      <div className="overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-ink-muted">
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Subscribed</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {state.newsletterSubscribers.map((row) => (
              <tr key={row.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">{row.email}</td>
                <td className="px-4 py-3">
                  <Badge tone="neutral">{row.source}</Badge>
                </td>
                <td className="px-4 py-3 text-xs text-ink-muted">{new Date(row.subscribedAt).toLocaleString()}</td>
                <td className="px-4 py-3 text-right">
                  {canEdit ? (
                    <button className="text-danger" onClick={() => removeNewsletterSubscriber(row.id)}>
                      Remove
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
