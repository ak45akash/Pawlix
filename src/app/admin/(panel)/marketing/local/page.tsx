"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { MarketingPageHeader, RequireMarketing } from "@/components/admin/marketing-shell";
import { listingCopyBlock } from "@/lib/marketing";
import { useDemo } from "@/lib/demo-store";

export default function LocalListingsPage() {
  return (
    <RequireMarketing>
      <LocalTools />
    </RequireMarketing>
  );
}

function LocalTools() {
  const { state, saveLocalListings, can } = useDemo();
  const canEdit = can("seo.edit");
  const [draft, setDraft] = useState(state.localListings);
  const [notice, setNotice] = useState("");
  const [copied, setCopied] = useState(false);

  return (
    <div className="space-y-8">
      <MarketingPageHeader
        title="Local listings"
        description="Keep name, address, and phone consistent across Google Business, Instagram, and WhatsApp for local search in the Tricity."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <form
          className="space-y-3 rounded-lg border border-border bg-surface p-5"
          onSubmit={(event) => {
            event.preventDefault();
            saveLocalListings(draft);
            setNotice("Listings saved.");
          }}
        >
          <Field label="Business name">
            <Input value={draft.businessName} onChange={(e) => setDraft({ ...draft, businessName: e.target.value })} disabled={!canEdit} />
          </Field>
          <Field label="Phone">
            <Input value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} disabled={!canEdit} />
          </Field>
          <Field label="Email">
            <Input value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} disabled={!canEdit} />
          </Field>
          <Field label="Address">
            <Textarea value={draft.address} onChange={(e) => setDraft({ ...draft, address: e.target.value })} disabled={!canEdit} />
          </Field>
          <Field label="Google Business Profile URL">
            <Input value={draft.googleBusinessUrl} onChange={(e) => setDraft({ ...draft, googleBusinessUrl: e.target.value })} disabled={!canEdit} />
          </Field>
          <Field label="Instagram URL">
            <Input value={draft.instagramUrl} onChange={(e) => setDraft({ ...draft, instagramUrl: e.target.value })} disabled={!canEdit} />
          </Field>
          <Field label="WhatsApp number">
            <Input value={draft.whatsappNumber} onChange={(e) => setDraft({ ...draft, whatsappNumber: e.target.value })} disabled={!canEdit} />
          </Field>
          <Field label="Internal notes">
            <Textarea value={draft.listingNotes} onChange={(e) => setDraft({ ...draft, listingNotes: e.target.value })} disabled={!canEdit} />
          </Field>
          {notice ? <p className="text-sm text-success">{notice}</p> : null}
          {canEdit ? <Button type="submit">Save listings</Button> : null}
        </form>

        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-surface p-5">
            <h2 className="font-medium">Copy for directories</h2>
            <pre className="mt-3 whitespace-pre-wrap rounded-md bg-canvas p-3 text-xs leading-relaxed text-ink-muted">{listingCopyBlock(draft)}</pre>
            <Button
              className="mt-3"
              size="sm"
              variant="secondary"
              onClick={async () => {
                await navigator.clipboard.writeText(listingCopyBlock(draft));
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            >
              {copied ? "Copied" : "Copy block"}
            </Button>
          </div>
          <div className="rounded-lg border border-border bg-surface p-5 text-sm text-ink-muted">
            <h2 className="font-medium text-ink">Checklist</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Same business name on Google, Instagram bio, and website footer.</li>
              <li>Mention Chandigarh, Mohali, and Panchkula in the Google description.</li>
              <li>Add photos of the counter and best-selling products monthly.</li>
              <li>Reply to Google reviews within one working day.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
