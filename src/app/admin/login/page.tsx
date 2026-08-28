"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { siteConfig } from "@/config/site";
import { authenticateAdminMember } from "@/lib/admin-auth";
import { setAdminCookie } from "@/lib/admin-session";
import { useDemo } from "@/lib/demo-store";
import { ThemeToggle } from "@/lib/theme";

export default function AdminLoginPage() {
  const router = useRouter();
  const { state, setCurrentMember } = useDemo();
  const [error, setError] = useState("");

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4">
      <div className="mb-8 flex justify-end">
        <ThemeToggle />
      </div>
      <p className="text-sm tracking-[0.2em] text-accent uppercase">{siteConfig.name}</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Admin sign in</h1>
      <p className="mt-2 text-sm text-ink-muted">
        Sign in with your team email and password. Demo default for seeded accounts is <span className="font-mono">admin123</span>.
      </p>
      <form
        className="mt-8 space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          setError("");
          const data = new FormData(event.currentTarget);
          const email = String(data.get("email"));
          const password = String(data.get("password"));
          const member = authenticateAdminMember(state, email, password);
          if (!member) {
            setError("Email or password is incorrect.");
            return;
          }
          setAdminCookie(member.id);
          setCurrentMember(member.id);
          router.push("/admin");
        }}
      >
        <Field label="Email">
          <Input name="email" type="email" autoComplete="username" defaultValue="admin@pawlix.com" required />
        </Field>
        <Field label="Password">
          <Input name="password" type="password" autoComplete="current-password" defaultValue="admin123" required />
        </Field>
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <Button type="submit" className="w-full">
          Enter admin
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-ink-muted">
        <Link href="/admin/forgot-password" className="text-accent hover:underline">
          Forgot password?
        </Link>
      </p>
    </main>
  );
}
