"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Field, Input, Select } from "@/components/ui/field";
import { canDeleteCatalogue } from "@/lib/permissions/catalogue.ts";
import { useDemo } from "@/lib/demo-store";

export default function CouponsPage() {
  const { state, saveCoupon, deleteEntity, role } = useDemo();
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Coupons</h1>
        <Button size="sm" onClick={() => setOpen(true)}>
          Add
        </Button>
      </div>
      <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-ink-muted">
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Value</th>
              <th className="px-4 py-3">Used</th>
              <th className="px-4 py-3">Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {state.coupons.map((coupon) => (
              <tr key={coupon.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-mono">{coupon.code}</td>
                <td className="px-4 py-3">
                  {coupon.type === "percentage" ? `${coupon.value}%` : `₹${coupon.value}`}
                </td>
                <td className="px-4 py-3">
                  {coupon.used}/{coupon.usageLimit}
                </td>
                <td className="px-4 py-3">
                  <Badge tone={coupon.active ? "success" : "neutral"}>{coupon.active ? "Active" : "Off"}</Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  {canDeleteCatalogue(role) ? (
                    <button className="text-danger" onClick={() => deleteEntity("coupons", coupon.id)}>
                      Delete
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4">
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
              <Button variant="secondary" onClick={() => setOpen(false)}>
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
