"use client";

import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { useDemo } from "@/lib/demo-store";

export default function SettingsPage() {
  const { state, saveSettings, reset } = useDemo();
  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <form
        className="mt-6 space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          saveSettings({
            shippingCharge: Number(data.get("shippingCharge")),
            freeShippingThreshold: Number(data.get("freeShippingThreshold")),
            deliveryNote: String(data.get("deliveryNote")),
            gstEnabled: data.get("gstEnabled") === "on",
          });
        }}
      >
        <Field label="Shipping charge (₹)">
          <Input name="shippingCharge" type="number" defaultValue={state.settings.shippingCharge} />
        </Field>
        <Field label="Free shipping threshold (₹)">
          <Input name="freeShippingThreshold" type="number" defaultValue={state.settings.freeShippingThreshold} />
        </Field>
        <Field label="Delivery note">
          <Textarea name="deliveryNote" defaultValue={state.settings.deliveryNote} />
        </Field>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="gstEnabled" defaultChecked={state.settings.gstEnabled} /> GST enabled
        </label>
        <Button type="submit">Save settings</Button>
      </form>
      <div className="mt-10 border-t border-border pt-6">
        <p className="text-sm text-ink-muted">Reset all demo data stored in this browser.</p>
        <Button className="mt-3" variant="danger" onClick={() => reset()}>
          Reset demo data
        </Button>
      </div>
    </div>
  );
}
