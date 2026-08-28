"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Leaf, Package, RotateCcw, Truck } from "lucide-react";
import { ProductGrid } from "@/components/store/product-grid";
import { PostCard } from "@/components/store/post-card";
import { Button } from "@/components/ui/button";
import { SmartImage } from "@/components/ui/smart-image";
import { storeImages } from "@/config/images";
import { siteConfig } from "@/config/site";
import { featuredPosts, shopHref } from "@/lib/content";
import { storefrontProducts } from "@/lib/catalog";
import { articleJsonLd, siteJsonLd } from "@/lib/seo";
import { getSiteUrl } from "@/config/env";
import { PageSeo } from "@/components/store/page-seo";
import { useDemo } from "@/lib/demo-store";

const petImages = storeImages.pages.home.pets;

export default function HomePage() {
  const { state, addNewsletterSubscriber } = useDemo();
  const featured = storefrontProducts(state).filter((product) => product.featured);
  const journals = featuredPosts(state, "blog").slice(0, 3);
  const recipes = featuredPosts(state, "recipe").slice(0, 3);
  const reviews = state.reviews.filter((review) => review.published).slice(0, 3);
  const [newsletterNotice, setNewsletterNotice] = useState("");
  const [newsletterError, setNewsletterError] = useState("");
  const categories = state.categories.filter((item) => !item.archived).sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <>
      <PageSeo
        title={state.seo.title}
        description={state.seo.description}
        path="/"
        image={state.seo.ogImage}
        keywords={state.seo.keywords}
        jsonLd={[...siteJsonLd(state.seo, getSiteUrl()), ...journals.map((post) => articleJsonLd(post, getSiteUrl()))]}
      />
      <section className="relative min-h-[78vh] overflow-hidden bg-inverse text-on-inverse">
        <SmartImage
          src={storeImages.pages.home.hero}
          alt="Dogs resting indoors"
          fill
          priority
          className="object-cover opacity-55"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-inverse/80 via-inverse/45 to-transparent" />
        <div className="store-shell relative flex min-h-[78vh] flex-col justify-end py-20">
          <p className="text-sm tracking-[0.28em] text-on-inverse/70 uppercase">Pawlix.com</p>
          <h1 className="font-display mt-4 max-w-2xl text-5xl leading-[1.05] md:text-7xl">
            Care that feels considered.
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-on-inverse/80">
            Food, toys and everyday pieces for dogs, cats and birds — chosen for quality, not noise. Serving{" "}
            {siteConfig.location.formatted}.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/shop">
              <Button className="rounded-full px-6">Shop the catalogue</Button>
            </Link>
            <Link href="/recipes">
              <Button variant="secondary" className="rounded-full border-on-inverse/20 bg-on-inverse/10 px-6 text-on-inverse hover:bg-on-inverse/20">
                Browse recipes
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-surface">
        <div className="store-shell grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Truck, title: "Tricity delivery", body: "Chandigarh, Mohali & Panchkula · free above ₹1,499" },
            { icon: Leaf, title: "Short lists", body: "What we stock is what we stand behind" },
            { icon: Package, title: "One inventory", body: "Website and counter share the same stock" },
            { icon: RotateCcw, title: "Easy returns", body: "7-day returns on unused items" },
          ].map((item) => (
            <div key={item.title} className="flex gap-3">
              <item.icon className="mt-0.5 size-5 text-accent" />
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="mt-1 text-sm text-ink-muted">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="store-shell py-16 lg:py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-sm tracking-[0.2em] text-accent uppercase">This week</p>
            <h2 className="font-display mt-2 text-3xl md:text-4xl">Featured</h2>
          </div>
          <Link href="/shop" className="hidden items-center gap-1 text-sm text-accent sm:flex">
            View all <ArrowRight className="size-4" />
          </Link>
        </div>
        <ProductGrid products={featured} />
      </section>

      <section className="bg-surface">
        <div className="store-shell py-16 lg:py-20">
          <p className="text-sm tracking-[0.2em] text-accent uppercase">Filter the shop</p>
          <h2 className="font-display mt-2 text-3xl md:text-4xl">Shop by pet</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {state.petTypes
              .filter((pet) => !pet.archived)
              .map((pet) => (
                <Link key={pet.id} href={shopHref({ pet: pet.slug })} className="group relative overflow-hidden rounded-3xl">
                  <div className="relative aspect-[4/5]">
                    <SmartImage
                      src={petImages[pet.slug as keyof typeof petImages] ?? petImages.dog}
                      alt={pet.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-inverse/70 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6 text-on-inverse">
                      <p className="font-display text-3xl">{pet.name}</p>
                      <p className="mt-1 text-sm text-on-inverse/80">Open in Shop</p>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((item) => (
              <Link
                key={item.id}
                href={shopHref({ category: item.slug })}
                className="rounded-full bg-canvas px-4 py-2 text-sm text-ink-muted ring-1 ring-border hover:text-ink"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="store-shell py-16 lg:py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-sm tracking-[0.2em] text-accent uppercase">Journal</p>
            <h2 className="font-display mt-2 text-3xl md:text-4xl">From the shop</h2>
          </div>
          <Link href="/blog" className="hidden items-center gap-1 text-sm text-accent sm:flex">
            All posts <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {journals.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      <section className="bg-surface">
        <div className="store-shell py-16 lg:py-20">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="text-sm tracking-[0.2em] text-accent uppercase">Kitchen</p>
              <h2 className="font-display mt-2 text-3xl md:text-4xl">Recipes</h2>
            </div>
            <Link href="/recipes" className="hidden items-center gap-1 text-sm text-accent sm:flex">
              All recipes <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {recipes.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      <section className="store-shell py-16 lg:py-20">
        <p className="text-sm tracking-[0.2em] text-accent uppercase">From customers</p>
        <h2 className="font-display mt-2 text-3xl md:text-4xl">Quiet praise</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {reviews.map((review) => (
            <blockquote key={review.id} className="rounded-3xl bg-surface p-6 ring-1 ring-border">
              <p className="text-sm tracking-widest text-accent">{"★".repeat(review.rating)}</p>
              <p className="mt-3 leading-relaxed text-ink">{review.body}</p>
              <footer className="mt-4 text-sm text-ink-muted">{review.author}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-inverse text-on-inverse">
        <div className="store-shell grid items-center gap-8 py-16 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl md:text-4xl">A short note, occasionally.</h2>
            <p className="mt-3 max-w-md text-on-inverse/70">
              Restocks, recipes and journal pieces. No daily noise. Join the list — we will email when sending is live.
            </p>
            {newsletterNotice ? <p className="mt-2 text-sm text-success">{newsletterNotice}</p> : null}
            {newsletterError ? <p className="mt-2 text-sm text-danger">{newsletterError}</p> : null}
          </div>
          <form
            className="flex gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              setNewsletterNotice("");
              setNewsletterError("");
              const data = new FormData(event.currentTarget);
              const email = String(data.get("email") ?? "");
              try {
                addNewsletterSubscriber(email, "homepage");
                event.currentTarget.reset();
                setNewsletterNotice("You are on the list. Thank you.");
              } catch (caught) {
                setNewsletterError(caught instanceof Error ? caught.message : "Could not subscribe.");
              }
            }}
          >
            <input
              type="email"
              name="email"
              required
              placeholder="Email address"
              className="h-12 flex-1 rounded-full border border-on-inverse/15 bg-on-inverse/5 px-5 text-sm outline-none placeholder:text-on-inverse/40"
            />
            <Button type="submit" className="rounded-full px-6">
              Join
            </Button>
          </form>
        </div>
      </section>
    </>
  );
}
