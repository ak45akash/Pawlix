import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Heart, Leaf, Package, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SmartImage } from "@/components/ui/smart-image";
import { storeImages } from "@/config/images";
import { siteConfig } from "@/config/site";
import { getSiteUrl } from "@/config/env";

const images = storeImages.pages.about;

export const metadata: Metadata = {
  title: "About Pawlix — Pet Food, Toys & Accessories in the Tricity",
  description:
    "Pawlix is a Tricity pet store in Chandigarh, Mohali and Panchkula for dog food, cat food, bird seed, toys and accessories. Honest ingredients, shared online and in-store inventory, and care that treats pets as family.",
  keywords: [
    "pet store Chandigarh",
    "pet shop Mohali",
    "pet shop Panchkula",
    "pet store Tricity",
    "dog food Chandigarh",
    "cat food Mohali",
    "bird food",
    "pet toys",
    "pet accessories",
    "premium pet food",
    "Pawlix",
  ],
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Pawlix — Thoughtful Pet Care",
    description:
      "Food, toys and everyday pieces for dogs, cats and birds. A short catalogue, honest photography, and one inventory for the website and the counter.",
    url: `${siteConfig.url}/about`,
    images: [{ url: images.hero, alt: "A dog resting peacefully at home" }],
  },
};

function aboutJsonLd() {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": `${url}/about#webpage`,
        url: `${url}/about`,
        name: "About Pawlix",
        description:
          "Learn how Pawlix selects pet food, toys and accessories for dogs, cats and birds in Chandigarh, Mohali and Panchkula.",
        isPartOf: { "@id": `${url}/#website` },
        about: { "@id": `${url}/#organization` },
      },
      {
        "@type": "PetStore",
        "@id": `${url}/#organization`,
        name: siteConfig.name,
        url,
        description: siteConfig.description,
        image: images.hero,
        areaServed: siteConfig.location.cities,
        knowsAbout: ["Dog food", "Cat food", "Bird food", "Pet toys", "Pet accessories"],
      },
    ],
  };
}

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd()) }} />

      <section className="relative min-h-[70vh] overflow-hidden bg-inverse text-on-inverse">
        <SmartImage src={images.hero} alt="A relaxed dog at home with soft natural light" fill priority className="object-cover opacity-50" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-inverse via-inverse/60 to-inverse/20" />
        <div className="relative store-shell py-24 lg:py-32">
          <p className="text-sm tracking-[0.28em] text-on-inverse/70 uppercase">About {siteConfig.name}</p>
          <h1 className="font-display mt-4 max-w-3xl text-4xl leading-tight md:text-6xl">
            A pet store built on quiet care, not loud claims.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-on-inverse/80">
            {siteConfig.name} is a Tricity pet retail store for{" "}
            <strong className="font-medium text-on-inverse">dog food, cat food, bird seed, toys and accessories</strong>. We keep
            the catalogue short, the photography honest, and the buying experience calm — online at {siteConfig.domain} and at
            our counter in {siteConfig.location.formatted}.
          </p>
        </div>
      </section>

      <section className="border-b border-border bg-surface">
        <div className="store-shell grid gap-10 py-16 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-24">
          <div>
            <p className="text-sm tracking-[0.2em] text-accent uppercase">What we believe</p>
            <h2 className="font-display mt-3 text-3xl md:text-4xl">Good pet care should feel straightforward.</h2>
            <div className="mt-6 space-y-4 leading-relaxed text-ink-muted">
              <p>
                Most pet shops overwhelm you with choice. We do the opposite. Every product on {siteConfig.domain} is something
                we would feed our own animals, hang in our own homes, or recommend without hesitation to a neighbour asking at
                the door.
              </p>
              <p>
                That means readable ingredient lists for{" "}
                <Link href="/shop?pet=dog" className="text-accent hover:text-accent-hover">
                  dog food
                </Link>{" "}
                and{" "}
                <Link href="/shop?pet=cat" className="text-accent hover:text-accent-hover">
                  cat food
                </Link>
                , toys that survive real chewing and climbing, and accessories that last beyond a season. We favour brands that
                publish sourcing clearly and skip the filler-heavy recipes that look cheap but cost more in vet visits later.
              </p>
              <p>
                Whether you shop for a Labrador who eats like it is a profession or a cat who treats every bowl as a suggestion,
                you should leave knowing exactly what you bought and why it is in our store.
              </p>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-canvas">
            <SmartImage
              src={images.dogFood}
              alt="Premium dry dog food in a bowl — the kind of everyday nutrition Pawlix stocks"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      <section className="bg-canvas">
        <div className="store-shell py-16 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
            <div className="relative aspect-[5/4] overflow-hidden rounded-2xl">
              <SmartImage
                src={images.bond}
                alt="A person gently holding their dog — the bond Pawlix exists to support"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
            </div>
            <div>
              <p className="text-sm tracking-[0.2em] text-accent uppercase">For the ones who wait by the door</p>
              <h2 className="font-display mt-3 text-3xl md:text-4xl">They notice everything. We try to notice them back.</h2>
              <div className="mt-6 space-y-4 leading-relaxed text-ink-muted">
                <p>
                  There is a particular sound — keys in the lock, a bag rustling, footsteps on the stair — and suddenly the whole
                  house shifts. Tails, whiskers, wings. The day was not complete until you walked in.
                </p>
                <p>
                  We started {siteConfig.name} because those small rituals matter. The morning bowl placed at the same hour. The
                  frayed rope that means it is playtime. The perch turned toward the window because someone learned that your
                  bird likes the afternoon sun. Pets do not ask for perfection. They ask for consistency, safety, and someone who
                  pays attention.
                </p>
                <p>
                  That is the standard behind every shelf. Not marketing language — the quiet promise that when you come home,
                  what you bought is worth the wag, the purr, or the soft chirp from the cage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="store-shell py-16 lg:py-20">
          <p className="text-sm tracking-[0.2em] text-accent uppercase">How we work</p>
          <h2 className="font-display mt-3 max-w-2xl text-3xl md:text-4xl">One inventory. Two ways to shop.</h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-ink-muted">
            Stock on {siteConfig.domain} matches what we can sell in person. If a bag of kibble or a cat wand shows as available
            online, it is meant to reflect real units on our shelf — not a separate warehouse fantasy that leaves you waiting.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Leaf,
                title: "Short lists",
                body: "We add slowly and remove honestly. A smaller catalogue is easier to trust.",
              },
              {
                icon: Package,
                title: "Shared stock",
                body: "Website orders and counter sales draw from the same numbers.",
              },
              {
                icon: Store,
                title: "Tricity counter",
                body: "Walk in at our Chandigarh shop for advice, weigh-ins, or to pick up what you ordered online.",
              },
              {
                icon: Heart,
                title: "Real answers",
                body: "Ask us about ingredients, sizing, or switching food — we would rather explain than upsell.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-border bg-canvas p-5">
                <item.icon className="size-5 text-accent" />
                <h3 className="mt-3 font-medium">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-canvas">
        <div className="store-shell py-16 lg:py-24">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl md:col-span-1">
              <SmartImage
                src={images.counter}
                alt="Pet store counter with products ready for customers"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl md:col-span-1">
              <SmartImage
                src={images.cat}
                alt="A cat resting on a window perch — cat accessories stocked by Pawlix"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="flex flex-col justify-center md:col-span-1">
              <p className="text-sm tracking-[0.2em] text-accent uppercase">What we stock</p>
              <h2 className="font-display mt-3 text-3xl">Dogs, cats and birds — thoughtfully.</h2>
              <ul className="mt-6 space-y-3 text-sm leading-relaxed text-ink-muted">
                <li>
                  <strong className="font-medium text-ink">Dog food &amp; treats</strong> — dry kibble, fish-first recipes,
                  chew toys and walk gear.
                </li>
                <li>
                  <strong className="font-medium text-ink">Cat food &amp; play</strong> — wet meals, wands, perches and
                  everyday enrichment.
                </li>
                <li>
                  <strong className="font-medium text-ink">Bird care</strong> — millet blends, swings and cage accessories
                  without dyed grit.
                </li>
              </ul>
              <p className="mt-6 leading-relaxed text-ink-muted">
                We deliver across {siteConfig.location.formatted} with clear delivery times and free shipping above ₹1,499. Need help choosing? Our{" "}
                <Link href="/blog" className="text-accent hover:text-accent-hover">
                  journal
                </Link>{" "}
                and{" "}
                <Link href="/recipes" className="text-accent hover:text-accent-hover">
                  recipes
                </Link>{" "}
                sections share feeding notes we actually use in the shop.
              </p>
            </div>
          </div>
          <div className="relative mt-6 aspect-[21/9] overflow-hidden rounded-2xl">
            <SmartImage
              src={images.bird}
              alt="Small bird beside seed mix — bird food available at Pawlix"
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-inverse/70 to-transparent" />
            <div className="absolute inset-y-0 left-0 flex max-w-md flex-col justify-center px-6 lg:px-10">
              <p className="text-sm tracking-[0.2em] text-on-inverse/70 uppercase">Across the Tricity</p>
              <p className="font-display mt-2 text-2xl text-on-inverse md:text-3xl">
                Chandigarh, Mohali and Panchkula — the same care, packed carefully.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface">
        <div className="store-shell flex flex-col items-start justify-between gap-6 py-16 lg:flex-row lg:items-center lg:py-20">
          <div>
            <h2 className="font-display text-3xl md:text-4xl">Come say hello.</h2>
            <p className="mt-3 max-w-xl leading-relaxed text-ink-muted">
              Browse the catalogue online, visit us in the Tricity, or write to hello@pawlix.com with a question about food,
              sizing, or what might suit a nervous new rescue. We are glad you are here.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/shop">
              <Button className="rounded-full px-6">
                Shop pet products
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="secondary" className="rounded-full px-6">
                Contact us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
