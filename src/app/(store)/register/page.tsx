"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { useCustomer } from "@/lib/customer-store";

export default function RegisterPage() {
  const { login } = useCustomer();
  const router = useRouter();

  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Create account</h1>
      <form
        className="mt-6 space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          login({ name: String(data.get("name")), email: String(data.get("email")) });
          router.push("/account");
        }}
      >
        <Field label="Name">
          <Input name="name" required />
        </Field>
        <Field label="Email">
          <Input name="email" type="email" required />
        </Field>
        <Button type="submit" className="w-full">
          Create account
        </Button>
      </form>
    </main>
  );
}
