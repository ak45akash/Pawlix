"use client";

import Link from "next/link";
import { useState } from "react";
import { Clock, Mail, MapPin, MessageCircle, Package, ShoppingBag } from "lucide-react";
import { PageHero } from "@/components/store/page-hero";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { SmartImage } from "@/components/ui/smart-image";
import { PageSeo } from "@/components/store/page-seo";
import { storeImages } from "@/config/images";
import { siteConfig, tricityLabel } from "@/config/site";

const helpTopics = [
  {
    icon: Package,
    title: "Orders & delivery",
    body: "Tracking, changes before dispatch, or questions about Tricity delivery times.",
  },
  {
    icon: ShoppingBag,
    title: "Product advice",
    body: "Switching food, sizing a lead, or choosing between two bowls for your pet.",
  },
  {
    icon: MessageCircle,
    title: "Store pickup",
    body: "Reserve online and collect at our Chandigarh counter the same day.",
  },
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <PageSeo
        title="Contact Pawlix"
        description={`Write to the Pawlix shop in the Tricity (${tricityLabel()}) about orders, food, or what we stock.`}
        path="/contact"
      />

      <PageHero
        eyebrow="Contact"
        title="Questions welcome — no ticket numbers."
        description={`Reach the ${siteConfig.name} team in ${siteConfig.location.formatted}. We reply within one working day for orders, product advice, and pickup requests.`}
        image={storeImages.pages.contact.hero}
        imageAlt="Friendly pet store counter ready to help customers"
        tall
      />

      <section className="store-shell py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16 xl:grid-cols-[0.95fr_1fr]">
          <div className="space-y-8">
            <div>
              <p className="text-sm tracking-[0.2em] text-accent uppercase">Get in touch</p>
              <h2 className="font-display mt-3 text-3xl md:text-4xl">Tell us what you need.</h2>
              <p className="mt-4 leading-relaxed text-ink-muted">
                Whether you are placing a first order, switching your dog&apos;s food, or wondering if we have something in
                stock at the counter — write plainly. We read every message ourselves.
              </p>
            </div>

            <ul className="space-y-4">
              <li className="flex gap-3 rounded-xl border border-border bg-surface p-4">
                <Mail className="mt-0.5 size-5 shrink-0 text-accent" />
                <span>
                  <span className="block font-medium">hello@pawlix.com</span>
                  <span className="mt-1 block text-sm text-ink-muted">Best for orders, photos, and detailed questions.</span>
                </span>
              </li>
              <li className="flex gap-3 rounded-xl border border-border bg-surface p-4">
                <MapPin className="mt-0.5 size-5 shrink-0 text-accent" />
                <span>
                  <span className="block font-medium">{siteConfig.location.formatted}</span>
                  <span className="mt-1 block text-sm text-ink-muted">
                    Chandigarh counter · home delivery across the Tricity.
                  </span>
                </span>
              </li>
              <li className="flex gap-3 rounded-xl border border-border bg-surface p-4">
                <Clock className="mt-0.5 size-5 shrink-0 text-accent" />
                <span>
                  <span className="block font-medium">Mon – Sat · 10:00 – 19:00</span>
                  <span className="mt-1 block text-sm text-ink-muted">We reply to email within one working day.</span>
                </span>
              </li>
            </ul>

            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-canvas lg:aspect-auto lg:min-h-56">
              <SmartImage
                src={storeImages.pages.contact.aside}
                alt="Person with their dog — the kind of conversation we enjoy at Pawlix"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-inverse/70 via-transparent to-transparent" />
              <p className="absolute inset-x-0 bottom-0 p-5 text-sm leading-relaxed text-on-inverse/90">
                Real people, not a call centre. Ask about ingredients, sizing, or what might suit a nervous rescue.
              </p>
            </div>

            <p className="text-sm text-ink-muted">
              Looking for policies first? See{" "}
              <Link href="/shipping" className="text-accent hover:text-accent-hover">
                shipping
              </Link>
              ,{" "}
              <Link href="/returns" className="text-accent hover:text-accent-hover">
                returns
              </Link>
              , or browse the{" "}
              <Link href="/shop" className="text-accent hover:text-accent-hover">
                shop
              </Link>
              .
            </p>
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm lg:p-8">
              <h2 className="text-xl font-semibold tracking-tight">Send a message</h2>
              <p className="mt-2 text-sm text-ink-muted">
                Demo form — messages save locally until email is connected.
              </p>
              {sent ? (
                <div className="mt-8 rounded-xl bg-success-soft p-5 text-success">
                  <p className="font-medium">Message received.</p>
                  <p className="mt-2 text-sm">We&apos;ll be in touch soon. Email delivery will use Resend later.</p>
                </div>
              ) : (
                <form
                  className="mt-6 space-y-4"
                  onSubmit={(event) => {
                    event.preventDefault();
                    setSent(true);
                  }}
                >
                  <Field label="Name">
                    <Input name="name" required placeholder="Your name" />
                  </Field>
                  <Field label="Email">
                    <Input name="email" type="email" required placeholder="you@example.com" />
                  </Field>
                  <Field label="Message">
                    <Textarea name="message" required rows={6} placeholder="How can we help?" />
                  </Field>
                  <Button type="submit" className="w-full sm:w-auto">
                    Send message
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-canvas">
        <div className="store-shell py-16 lg:py-20">
          <p className="text-sm tracking-[0.2em] text-accent uppercase">Common reasons to write</p>
          <h2 className="font-display mt-3 text-3xl md:text-4xl">We can usually help with</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {helpTopics.map((topic) => (
              <div key={topic.title} className="rounded-2xl border border-border bg-surface p-6">
                <topic.icon className="size-5 text-accent" />
                <h3 className="mt-4 font-medium">{topic.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{topic.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
