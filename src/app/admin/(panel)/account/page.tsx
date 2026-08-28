"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { useDemo } from "@/lib/demo-store";

export default function AdminAccountPage() {
  const { changeAdminPassword, member } = useDemo();
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Account</h1>
        <p className="mt-1 text-sm text-ink-muted">
          {member?.name ?? "Admin"} · {member?.email ?? ""}
        </p>
      </div>

      <section className="rounded-lg border border-border bg-surface p-5">
        <h2 className="font-medium">Change password</h2>
        <p className="mt-1 text-sm text-ink-muted">Use a password with at least 8 characters.</p>
        <form
          className="mt-4 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            setNotice("");
            setError("");
            const data = new FormData(event.currentTarget);
            try {
              changeAdminPassword(
                String(data.get("currentPassword")),
                String(data.get("newPassword")),
                String(data.get("confirmPassword")),
              );
              event.currentTarget.reset();
              setNotice("Password updated.");
            } catch (caught) {
              setError(caught instanceof Error ? caught.message : "Could not update password.");
            }
          }}
        >
          <Field label="Current password">
            <Input name="currentPassword" type="password" autoComplete="current-password" required />
          </Field>
          <Field label="New password">
            <Input name="newPassword" type="password" autoComplete="new-password" required />
          </Field>
          <Field label="Confirm new password">
            <Input name="confirmPassword" type="password" autoComplete="new-password" required />
          </Field>
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          {notice ? <p className="text-sm text-success">{notice}</p> : null}
          <Button type="submit">Update password</Button>
        </form>
        <p className="mt-4 text-xs text-ink-muted">
          Forgot your password? Sign out, then use{" "}
          <a href="/admin/forgot-password" className="text-accent hover:underline">
            forgot password
          </a>{" "}
          on the login screen.
        </p>
      </section>
    </div>
  );
}
