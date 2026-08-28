"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { siteConfig } from "@/config/site";
import { useDemo } from "@/lib/demo-store";
import { ThemeToggle } from "@/lib/theme";

export default function AdminResetPasswordPage() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-md px-4 py-16 text-sm text-ink-muted">Loading…</main>}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const { completeAdminPasswordReset } = useDemo();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  if (!token) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4">
        <p className="text-sm text-danger">Missing reset token. Request a new link from the forgot password page.</p>
        <Link href="/admin/forgot-password" className="mt-4 text-sm text-accent hover:underline">
          Forgot password
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4">
      <div className="mb-8 flex justify-end">
        <ThemeToggle />
      </div>
      <p className="text-sm tracking-[0.2em] text-accent uppercase">{siteConfig.name}</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Set a new password</h1>
      <p className="mt-2 text-sm text-ink-muted">Choose a new password with at least 8 characters.</p>

      {done ? (
        <div className="mt-8 space-y-4 rounded-lg border border-border bg-surface p-5">
          <p className="text-sm text-success">Password updated. You can sign in with the new password.</p>
          <Button className="w-full" onClick={() => router.push("/admin/login")}>
            Go to sign in
          </Button>
        </div>
      ) : (
        <form
          className="mt-8 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            setError("");
            try {
              completeAdminPasswordReset(token, password, confirm);
              setDone(true);
            } catch (caught) {
              setError(caught instanceof Error ? caught.message : "Could not reset password.");
            }
          }}
        >
          <Field label="New password">
            <Input value={password} onChange={(event) => setPassword(event.target.value)} type="password" autoComplete="new-password" required />
          </Field>
          <Field label="Confirm password">
            <Input value={confirm} onChange={(event) => setConfirm(event.target.value)} type="password" autoComplete="new-password" required />
          </Field>
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <Button type="submit" className="w-full">
            Update password
          </Button>
          <Link href="/admin/login" className="block text-center text-sm text-ink-muted hover:text-ink">
            Back to sign in
          </Link>
        </form>
      )}
    </main>
  );
}
