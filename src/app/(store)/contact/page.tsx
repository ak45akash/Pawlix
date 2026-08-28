"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { PageSeo } from "@/components/store/page-seo";
import { siteConfig, tricityLabel } from "@/config/site";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <main className="store-shell py-16">
      <div className="max-w-xl">
      <PageSeo
        title="Contact Pawlix"
        description={`Write to the Pawlix shop in the Tricity (${tricityLabel()}) about orders, food, or what we stock.`}
        path="/contact"
      />
      <h1 className="text-3xl font-semibold tracking-tight">Contact</h1>
      <p className="mt-2 text-sm text-ink-muted">hello@pawlix.com · {siteConfig.location.formatted}</p>
      {sent ? (
        <p className="mt-8 text-success">Message saved locally. Email delivery will use Resend later.</p>
      ) : (
        <form
          className="mt-8 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            setSent(true);
          }}
        >
          <Field label="Name">
            <Input name="name" required />
          </Field>
          <Field label="Email">
            <Input name="email" type="email" required />
          </Field>
          <Field label="Message">
            <Textarea name="message" required />
          </Field>
          <Button type="submit">Send</Button>
        </form>
      )}
      </div>
    </main>
  );
}
