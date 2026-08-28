"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Field, Input, Textarea } from "@/components/ui/field";
import { MarketingPageHeader, RequireMarketing } from "@/components/admin/marketing-shell";
import { useDemo } from "@/lib/demo-store";

export default function ReferralsPage() {
  return (
    <RequireMarketing>
      <ReferralTools />
    </RequireMarketing>
  );
}

function ReferralTools() {
  const { state, saveReferralProgram, can } = useDemo();
  const canEdit = can("seo.edit");
  const [draft, setDraft] = useState(state.referralProgram);
  const [notice, setNotice] = useState("");

  return (
    <div className="space-y-8">
      <MarketingPageHeader
        title="Referrals"
        description="Refer-a-friend rewards for Tricity word-of-mouth. Demo configuration only — checkout does not apply codes automatically yet."
      />

      <div className="rounded-lg border border-border bg-surface p-5">
        <div className="flex items-center gap-2">
          <h2 className="font-medium">Program status</h2>
          <Badge tone={draft.enabled ? "success" : "neutral"}>{draft.enabled ? "Enabled" : "Disabled"}</Badge>
        </div>
        <p className="mt-2 text-sm text-ink-muted">
          When live, customers share a personal link. Friends get the referee reward on first order; referrers get credit after delivery.
        </p>
      </div>

      <form
        className="max-w-xl space-y-3 rounded-lg border border-border bg-surface p-5"
        onSubmit={(event) => {
          event.preventDefault();
          saveReferralProgram(draft);
          setNotice("Referral program saved.");
        }}
      >
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={draft.enabled}
            onChange={(event) => setDraft({ ...draft, enabled: event.target.checked })}
            disabled={!canEdit}
          />
          Enable referral program (demo)
        </label>
        <Field label="Referrer reward">
          <Input value={draft.referrerReward} onChange={(e) => setDraft({ ...draft, referrerReward: e.target.value })} disabled={!canEdit} />
        </Field>
        <Field label="Friend reward">
          <Input value={draft.refereeReward} onChange={(e) => setDraft({ ...draft, refereeReward: e.target.value })} disabled={!canEdit} />
        </Field>
        <Field label="Minimum order (INR)">
          <Input
            type="number"
            value={draft.minOrder}
            onChange={(e) => setDraft({ ...draft, minOrder: Number(e.target.value) })}
            disabled={!canEdit}
          />
        </Field>
        <Field label="Terms shown at checkout">
          <Textarea value={draft.terms} onChange={(e) => setDraft({ ...draft, terms: e.target.value })} disabled={!canEdit} />
        </Field>
        {notice ? <p className="text-sm text-success">{notice}</p> : null}
        {canEdit ? <Button type="submit">Save program</Button> : null}
      </form>
    </div>
  );
}
