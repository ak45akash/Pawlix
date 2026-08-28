"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { siteConfig } from "@/config/site";
import { useDemo } from "@/lib/demo-store";
import { ThemeToggle } from "@/lib/theme";

export default function AdminForgotPasswordPage() {
  const { requestAdminPasswordReset } = useDemo();
  const [email, setEmail] = useState("admin@pawlix.com");
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ email: string; token: string } | null>(null);

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4">
      <div className="mb-8 flex justify-end">
        <ThemeToggle />
      </div>
      <p className="text-sm tracking-[0.2em] text-accent uppercase">{siteConfig.name}</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Forgot password</h1>
      <p className="mt-2 text-sm text-ink-muted">
        Enter the email on your admin account. In production we would email a reset link — in this demo the link appears here.
      </p>

      {result ? (
        <div className="mt-8 space-y-4 rounded-lg border border-border bg-surface p-5">
          <p className="text-sm text-success">Reset link created for {result.email}.</p>
          <p className="text-sm text-ink-muted">This link expires in one hour.</p>
          <Link href={`/admin/reset-password?token=${result.token}`} className="block break-all text-sm text-accent hover:underline">
            /admin/reset-password?token={result.token}
          </Link>
          <Link href="/admin/login" className="inline-block text-sm text-ink-muted hover:text-ink">
            Back to sign in
          </Link>
        </div>
      ) : (
        <form
          className="mt-8 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            setError("");
            try {
              setResult(requestAdminPasswordReset(email));
            } catch (caught) {
              setResult(null);
              setError(caught instanceof Error ? caught.message : "Could not start reset.");
            }
          }}
        >
          <Field label="Admin email">
            <Input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
          </Field>
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <Button type="submit" className="w-full">
            Send reset link
          </Button>
          <Link href="/admin/login" className="block text-center text-sm text-ink-muted hover:text-ink">
            Back to sign in
          </Link>
        </form>
      )}
    </main>
  );
}
