"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Field, Input } from "@/components/ui/field";
import { MarketingPageHeader, RequireMarketing } from "@/components/admin/marketing-shell";
import { announcementIsLive } from "@/lib/marketing";
import { useDemo } from "@/lib/demo-store";
import type { SiteAnnouncement } from "@/types/catalog";

export default function AnnouncementsPage() {
  return (
    <RequireMarketing>
      <AnnouncementsTools />
    </RequireMarketing>
  );
}

function AnnouncementsTools() {
  const { state, saveAnnouncement, deleteAnnouncement, can } = useDemo();
  const canEdit = can("seo.edit");
  const [editing, setEditing] = useState<SiteAnnouncement | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <MarketingPageHeader
          title="Announcements"
          description="Short site-wide banners for shipping offers, restocks, and counter hours. Live banners appear above the storefront header."
        />
        {canEdit ? (
          <Button size="sm" onClick={() => setCreating(true)}>
            Add banner
          </Button>
        ) : null}
      </div>

      <div className="space-y-4">
        {state.announcements
          .slice()
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((item) => (
            <div key={item.id} className="rounded-lg border border-border bg-surface p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{item.message}</p>
                  <p className="mt-1 text-xs text-ink-muted">
                    {item.startsAt} → {item.endsAt} · links to {item.href}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone={announcementIsLive(item) ? "success" : item.enabled ? "accent" : "neutral"}>
                    {announcementIsLive(item) ? "Live" : item.enabled ? "Scheduled" : "Off"}
                  </Badge>
                  {canEdit ? (
                    <>
                      <Button size="sm" variant="secondary" onClick={() => setEditing(item)}>
                        Edit
                      </Button>
                      <button className="text-sm text-danger" onClick={() => deleteAnnouncement(item.id)}>
                        Delete
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
      </div>

      {creating || editing ? (
        <AnnouncementForm
          item={editing ?? undefined}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
          onSave={(item) => {
            saveAnnouncement(item);
            setCreating(false);
            setEditing(null);
          }}
        />
      ) : null}
    </div>
  );
}

function AnnouncementForm({
  item,
  onClose,
  onSave,
}: {
  item?: SiteAnnouncement;
  onClose: () => void;
  onSave: (item: Omit<SiteAnnouncement, "id"> & { id?: string }) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-inverse/50 p-4">
      <form
        className="w-full max-w-lg space-y-4 rounded-lg bg-surface p-5"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          onSave({
            id: item?.id,
            message: String(data.get("message")),
            href: String(data.get("href")),
            enabled: data.get("enabled") === "on",
            startsAt: String(data.get("startsAt")),
            endsAt: String(data.get("endsAt")),
            sortOrder: Number(data.get("sortOrder")),
          });
        }}
      >
        <h2 className="font-medium">{item ? "Edit banner" : "New banner"}</h2>
        <Field label="Message">
          <Input name="message" defaultValue={item?.message} required />
        </Field>
        <Field label="Link URL">
          <Input name="href" defaultValue={item?.href ?? "/shop"} required />
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Starts">
            <Input name="startsAt" type="date" defaultValue={item?.startsAt} required />
          </Field>
          <Field label="Ends">
            <Input name="endsAt" type="date" defaultValue={item?.endsAt} required />
          </Field>
        </div>
        <Field label="Sort order">
          <Input name="sortOrder" type="number" defaultValue={item?.sortOrder ?? 1} />
        </Field>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="enabled" defaultChecked={item?.enabled ?? true} /> Enabled
        </label>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </div>
  );
}
