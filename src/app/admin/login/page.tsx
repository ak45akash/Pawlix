"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { siteConfig } from "@/config/site";
import { setAdminCookie } from "@/lib/admin-session";
import { useDemo } from "@/lib/demo-store";
import { ThemeToggle } from "@/lib/theme";

export default function AdminLoginPage() {
  const router = useRouter();
  const { state, setCurrentMember } = useDemo();
  const members = state.members.filter((member) => member.status === "active");

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4">
      <div className="mb-8 flex justify-end">
        <ThemeToggle />
      </div>
      <p className="text-sm tracking-[0.2em] text-accent uppercase">{siteConfig.name}</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Admin sign in</h1>
      <p className="mt-2 text-sm text-ink-muted">Demo access only. Pick a team member to inherit their role and rights.</p>
      <form
        className="mt-8 space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          const memberId = String(data.get("memberId"));
          const member = members.find((row) => row.id === memberId);
          if (!member) return;
          setAdminCookie(member.id);
          setCurrentMember(member.id);
          router.push("/admin");
        }}
      >
        <Field label="Email">
          <Input name="email" type="email" defaultValue="admin@pawlix.com" />
        </Field>
        <Field label="Password">
          <Input name="password" type="password" defaultValue="admin123" />
        </Field>
        <Field label="Sign in as" hint="Admin can manage roles. Staff cannot delete. Editor is content-only.">
          <Select name="memberId" defaultValue={members.find((member) => member.email === "admin@pawlix.com")?.id ?? members[0]?.id}>
            {members.map((member) => {
              const role = state.roles.find((row) => row.id === member.roleId);
              return (
                <option key={member.id} value={member.id}>
                  {member.name} — {role?.name ?? "Role"} ({member.email})
                </option>
              );
            })}
          </Select>
        </Field>
        <Button type="submit" className="w-full">
          Enter admin
        </Button>
      </form>
    </main>
  );
}
