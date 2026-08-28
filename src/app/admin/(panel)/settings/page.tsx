"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { BusinessHoursEditor } from "@/components/admin/business-hours-editor";
import { RequireCapability } from "@/components/admin/guard";
import { formatBusinessHours, normalizeWeeklyBusinessHours, validateBusinessHours } from "@/lib/business-hours";
import { useDemo } from "@/lib/demo-store";

function SettingsSection({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border bg-surface p-5">
      <h2 className="font-medium">{title}</h2>
      {description ? <p className="mt-1 text-sm text-ink-muted">{description}</p> : null}
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

export default function SettingsPage() {
  return (
    <RequireCapability capability="settings.edit">
      <StoreSettingsForm />
    </RequireCapability>
  );
}

function StoreSettingsForm() {
  const { state, saveSettings, reset } = useDemo();
  const [storeNotice, setStoreNotice] = useState("");
  const [storeError, setStoreError] = useState("");
  const [businessHours, setBusinessHours] = useState(() => normalizeWeeklyBusinessHours(state.settings.businessHours));

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Store settings</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Contact details, shipping, tax, and maintenance. Change your password under{" "}
          <a href="/admin/account" className="text-accent hover:underline">
            Account
          </a>
          .
        </p>
      </div>

      <form
        className="space-y-8"
        onSubmit={(event) => {
          event.preventDefault();
          setStoreNotice("");
          setStoreError("");
          const data = new FormData(event.currentTarget);
          try {
            validateBusinessHours(businessHours);
            saveSettings({
              ...state.settings,
              storeName: String(data.get("storeName")).trim(),
              storeEmail: String(data.get("storeEmail")).trim(),
              storePhone: String(data.get("storePhone")).trim(),
              storeAddress: String(data.get("storeAddress")).trim(),
              businessHours,
              supportHours: formatBusinessHours(businessHours),
              shippingCharge: Number(data.get("shippingCharge")),
              freeShippingThreshold: Number(data.get("freeShippingThreshold")),
              minOrderAmount: Number(data.get("minOrderAmount")),
              deliveryNote: String(data.get("deliveryNote")),
              gstEnabled: data.get("gstEnabled") === "on",
              gstRate: Number(data.get("gstRate")),
              codEnabled: data.get("codEnabled") === "on",
              pickupEnabled: data.get("pickupEnabled") === "on",
              orderPrefix: String(data.get("orderPrefix")).trim().toUpperCase(),
              lowStockAlertThreshold: Number(data.get("lowStockAlertThreshold")),
              maintenanceMode: data.get("maintenanceMode") === "on",
              maintenanceMessage: String(data.get("maintenanceMessage")).trim(),
            });
            setStoreNotice("Store settings saved.");
          } catch (caught) {
            setStoreError(caught instanceof Error ? caught.message : "Could not save settings.");
          }
        }}
      >
        <SettingsSection title="Store contact" description="Shown on contact pages, receipts, and customer emails later.">
          <Field label="Store name">
            <Input name="storeName" defaultValue={state.settings.storeName} required />
          </Field>
          <Field label="Support email">
            <Input name="storeEmail" type="email" defaultValue={state.settings.storeEmail} required />
          </Field>
          <Field label="Phone">
            <Input name="storePhone" defaultValue={state.settings.storePhone} required />
          </Field>
          <Field label="Address">
            <Textarea name="storeAddress" defaultValue={state.settings.storeAddress} />
          </Field>
          <Field label="Support hours">
            <BusinessHoursEditor value={businessHours} onChange={setBusinessHours} />
          </Field>
        </SettingsSection>

        <SettingsSection title="Shipping & checkout">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Shipping charge (₹)">
              <Input name="shippingCharge" type="number" min={0} defaultValue={state.settings.shippingCharge} />
            </Field>
            <Field label="Free shipping from (₹)">
              <Input name="freeShippingThreshold" type="number" min={0} defaultValue={state.settings.freeShippingThreshold} />
            </Field>
            <Field label="Minimum order (₹)">
              <Input name="minOrderAmount" type="number" min={0} defaultValue={state.settings.minOrderAmount} />
            </Field>
            <Field label="Order number prefix">
              <Input name="orderPrefix" defaultValue={state.settings.orderPrefix} maxLength={6} />
            </Field>
          </div>
          <Field label="Delivery note">
            <Textarea name="deliveryNote" defaultValue={state.settings.deliveryNote} />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="codEnabled" defaultChecked={state.settings.codEnabled} /> Cash on delivery enabled
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="pickupEnabled" defaultChecked={state.settings.pickupEnabled} /> Store pickup enabled
          </label>
        </SettingsSection>

        <SettingsSection title="Tax">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="gstEnabled" defaultChecked={state.settings.gstEnabled} /> GST enabled on checkout
          </label>
          <Field label="GST rate (%)">
            <Input name="gstRate" type="number" min={0} max={28} step={0.1} defaultValue={state.settings.gstRate} />
          </Field>
        </SettingsSection>

        <SettingsSection title="Inventory alerts">
          <Field label="Low stock threshold" hint="Dashboard and inventory views flag products at or below this quantity.">
            <Input name="lowStockAlertThreshold" type="number" min={0} defaultValue={state.settings.lowStockAlertThreshold} />
          </Field>
        </SettingsSection>

        <SettingsSection title="Maintenance mode" description="Replaces the storefront with a maintenance page. Admin panel stays available.">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="maintenanceMode" defaultChecked={state.settings.maintenanceMode} /> Enable maintenance mode
          </label>
          <Field label="Message shown to visitors">
            <Textarea name="maintenanceMessage" defaultValue={state.settings.maintenanceMessage} />
          </Field>
        </SettingsSection>

        {storeError ? <p className="text-sm text-danger">{storeError}</p> : null}
        {storeNotice ? <p className="text-sm text-success">{storeNotice}</p> : null}
        <Button type="submit">Save store settings</Button>
      </form>

      <SettingsSection title="Demo data">
        <p className="text-sm text-ink-muted">Reset all demo data in this browser, including passwords back to admin123.</p>
        <Button variant="danger" onClick={() => reset()}>
          Reset demo data
        </Button>
      </SettingsSection>
    </div>
  );
}
