"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { siteConfig } from "@/config/site";
import type { AdminRole } from "@/lib/permissions/catalogue.ts";
import { useDemo } from "@/lib/demo-store";
import { ThemeToggle } from "@/lib/theme";

export default function AdminLoginPage() {
  const router = useRouter();
  const { setRole } = useDemo();

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4">
      <div className="mb-8 flex justify-end">
        <ThemeToggle />
      </div>
      <p className="text-sm tracking-[0.2em] text-accent uppercase">{siteConfig.name}</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Admin sign in</h1>
      <p className="mt-2 text-sm text-ink-muted">Demo access only. Supabase Auth comes later.</p>
      <form
        className="mt-8 space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          const role = String(new FormData(event.currentTarget).get("role")) as AdminRole;
          document.cookie = `pawlix_admin=${role}; Path=/; Max-Age=604800; SameSite=Lax`;
          setRole(role);
          router.push("/admin");
        }}
      >
        <Field label="Email">
          <Input name="email" type="email" defaultValue="admin@pawlix.com" />
        </Field>
        <Field label="Password">
          <Input name="password" type="password" defaultValue="admin123" />
        </Field>
        <Field label="Role" hint="STAFF can edit SKUs but cannot delete catalogue records.">
          <Select name="role" defaultValue="ADMIN">
            <option value="ADMIN">ADMIN — edit and delete</option>
            <option value="STAFF">STAFF — edit only</option>
          </Select>
        </Field>
        <Button type="submit" className="w-full">
          Enter admin
        </Button>
      </form>
    </main>
  );
}
