"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Field, Input, Select } from "@/components/ui/field";
import { MarketingPageHeader, RequireMarketing } from "@/components/admin/marketing-shell";
import { suggestedCouponIdeas } from "@/data/marketing-seed";
import { couponStatus } from "@/lib/marketing";
import { useDemo } from "@/lib/demo-store";

export default function PromotionsPage() {
  return (
    <RequireMarketing>
      <PromotionsTools />
    </RequireMarketing>
  );
}

function PromotionsTools() {
  const { state, saveCoupon, deleteEntity, can } = useDemo();
  const [open, setOpen] = useState(false);
  const canManage = can("coupons.manage");

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <MarketingPageHeader
          title="Promotions"
          description="Manage discount codes, track usage, and plan offers for launches and seasonal pushes."
        />
        {canManage ? (
          <Button size="sm" onClick={() => setOpen(true)}>
            Add coupon
          </Button>
        ) : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Active", count: state.coupons.filter((c) => couponStatus(c) === "active").length },
          { label: "Scheduled / off", count: state.coupons.filter((c) => ["scheduled", "off"].includes(couponStatus(c))).length },
          { label: "Total redemptions", count: state.coupons.reduce((sum, c) => sum + c.used, 0) },
        ].map((item) => (
          <div key={item.label} className="rounded-lg border border-border bg-surface p-4">
            <p className="text-2xl font-semibold tabular-nums">{item.count}</p>
            <p className="mt-1 text-sm text-ink-muted">{item.label}</p>
          </div>
        ))}
      </div>

      <section className="rounded-lg border border-border bg-surface p-5">
        <h2 className="font-medium">Suggested offers</h2>
        <p className="mt-1 text-sm text-ink-muted">Starter ideas — create a matching coupon or pair with an announcement.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {suggestedCouponIdeas.map((idea) => (
            <div key={idea.code} className="rounded-md border border-border bg-canvas p-4">
              <p className="font-mono text-sm font-medium">{idea.code}</p>
              <p className="mt-1 text-sm font-medium">{idea.label}</p>
              <p className="mt-1 text-xs text-ink-muted">{idea.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-ink-muted">
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Value</th>
              <th className="px-4 py-3">Used</th>
              <th className="px-4 py-3">Dates</th>
              <th className="px-4 py-3">Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {state.coupons.map((coupon) => {
              const status = couponStatus(coupon);
              return (
                <tr key={coupon.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-mono">{coupon.code}</td>
                  <td className="px-4 py-3">{coupon.type === "percentage" ? `${coupon.value}%` : `₹${coupon.value}`}</td>
                  <td className="px-4 py-3">
                    {coupon.used}/{coupon.usageLimit}
                  </td>
                  <td className="px-4 py-3 text-xs text-ink-muted">
                    {coupon.startsAt} → {coupon.endsAt}
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={status === "active" ? "success" : status === "scheduled" ? "accent" : "neutral"}>{status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {canManage ? (
                      <button className="text-danger" onClick={() => deleteEntity("coupons", coupon.id)}>
                        Delete
                      </button>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-ink-muted">
        Also available under <Link href="/admin/coupons" className="text-accent">Sales → Coupons</Link>.
      </p>

      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-inverse/50 p-4">
          <form
            className="w-full max-w-md space-y-4 rounded-lg bg-surface p-5"
            onSubmit={(event) => {
              event.preventDefault();
              const data = new FormData(event.currentTarget);
              saveCoupon({
                code: String(data.get("code")).toUpperCase(),
                type: String(data.get("type")) as "percentage" | "fixed",
                value: Number(data.get("value")),
                minOrder: Number(data.get("minOrder")),
                usageLimit: Number(data.get("usageLimit")),
                active: true,
                startsAt: String(data.get("startsAt")),
                endsAt: String(data.get("endsAt")),
              });
              setOpen(false);
            }}
          >
            <h2 className="font-medium">New coupon</h2>
            <Field label="Code">
              <Input name="code" required />
            </Field>
            <Field label="Type">
              <Select name="type">
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed</option>
              </Select>
            </Field>
            <Field label="Value">
              <Input name="value" type="number" required />
            </Field>
            <Field label="Min order">
              <Input name="minOrder" type="number" defaultValue={0} />
            </Field>
            <Field label="Usage limit">
              <Input name="usageLimit" type="number" defaultValue={100} />
            </Field>
            <Field label="Starts">
              <Input name="startsAt" type="date" required />
            </Field>
            <Field label="Ends">
              <Input name="endsAt" type="date" required />
            </Field>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" type="button" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
