"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { MarketingPageHeader, RequireMarketing } from "@/components/admin/marketing-shell";
import { buildCampaignUrl } from "@/lib/marketing";
import { useDemo } from "@/lib/demo-store";
import type { MarketingCampaign } from "@/types/catalog";

export default function CampaignsPage() {
  return (
    <RequireMarketing>
      <CampaignTools />
    </RequireMarketing>
  );
}

function CampaignTools() {
  const { state, saveMarketingCampaign, deleteMarketingCampaign, can } = useDemo();
  const canEdit = can("seo.edit");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<MarketingCampaign | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function copyUrl(campaign: MarketingCampaign) {
    await navigator.clipboard.writeText(buildCampaignUrl(campaign));
    setCopiedId(campaign.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <MarketingPageHeader
          title="Campaign links"
          description="Build tracked URLs for Instagram, WhatsApp, and flyers. Pair with a coupon code when you want to measure conversions."
        />
        {canEdit ? (
          <Button size="sm" onClick={() => setOpen(true)}>
            New campaign
          </Button>
        ) : null}
      </div>

      <div className="space-y-4">
        {state.marketingCampaigns.map((campaign) => (
          <div key={campaign.id} className="rounded-lg border border-border bg-surface p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-medium">{campaign.name}</p>
                <p className="mt-1 break-all font-mono text-xs text-ink-muted">{buildCampaignUrl(campaign)}</p>
                {campaign.notes ? <p className="mt-2 text-sm text-ink-muted">{campaign.notes}</p> : null}
                {campaign.couponCode ? <p className="mt-1 text-xs text-accent">Coupon: {campaign.couponCode}</p> : null}
              </div>
              <div className="flex shrink-0 gap-2">
                <Button size="sm" variant="secondary" onClick={() => copyUrl(campaign)}>
                  {copiedId === campaign.id ? "Copied" : "Copy link"}
                </Button>
                {canEdit ? (
                  <>
                    <Button size="sm" variant="secondary" onClick={() => setEditing(campaign)}>
                      Edit
                    </Button>
                    <button className="text-sm text-danger" onClick={() => deleteMarketingCampaign(campaign.id)}>
                      Delete
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>

      {open || editing ? (
        <CampaignForm
          item={editing ?? undefined}
          onClose={() => {
            setOpen(false);
            setEditing(null);
          }}
          onSave={(item) => {
            saveMarketingCampaign(item);
            setOpen(false);
            setEditing(null);
          }}
        />
      ) : null}
    </div>
  );
}

function CampaignForm({
  item,
  onClose,
  onSave,
}: {
  item?: MarketingCampaign;
  onClose: () => void;
  onSave: (item: Omit<MarketingCampaign, "id" | "createdAt"> & { id?: string; createdAt?: string }) => void;
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
            createdAt: item?.createdAt,
            name: String(data.get("name")),
            path: String(data.get("path")),
            source: String(data.get("source")),
            medium: String(data.get("medium")),
            campaign: String(data.get("campaign")),
            couponCode: String(data.get("couponCode")),
            notes: String(data.get("notes")),
          });
        }}
      >
        <h2 className="font-medium">{item ? "Edit campaign" : "New campaign"}</h2>
        <Field label="Name">
          <Input name="name" defaultValue={item?.name} required />
        </Field>
        <Field label="Path" hint="/shop, /blog/slug, etc.">
          <Input name="path" defaultValue={item?.path ?? "/shop"} required />
        </Field>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="utm_source">
            <Input name="source" defaultValue={item?.source ?? "instagram"} required />
          </Field>
          <Field label="utm_medium">
            <Input name="medium" defaultValue={item?.medium ?? "social"} required />
          </Field>
          <Field label="utm_campaign">
            <Input name="campaign" defaultValue={item?.campaign ?? "launch"} required />
          </Field>
        </div>
        <Field label="Coupon code (optional)">
          <Input name="couponCode" defaultValue={item?.couponCode} />
        </Field>
        <Field label="Notes">
          <Textarea name="notes" defaultValue={item?.notes} />
        </Field>
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
