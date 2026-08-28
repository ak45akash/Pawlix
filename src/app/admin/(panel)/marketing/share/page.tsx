"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { SerpPreview } from "@/components/admin/seo-meter";
import { MarketingPageHeader, RequireMarketing } from "@/components/admin/marketing-shell";
import { sharePreviewPages } from "@/lib/marketing";
import { serpPreview } from "@/lib/seo";
import { useDemo } from "@/lib/demo-store";

export default function SharePreviewPage() {
  return (
    <RequireMarketing>
      <ShareTools />
    </RequireMarketing>
  );
}

function ShareTools() {
  const { state } = useDemo();
  const pages = useMemo(() => sharePreviewPages(state), [state]);
  const [selected, setSelected] = useState(0);
  const [copied, setCopied] = useState(false);
  const page = pages[selected] ?? pages[0];
  const preview = page ? serpPreview(page.title, page.description, page.path, "pawlix.com") : null;

  return (
    <div className="space-y-8">
      <MarketingPageHeader
        title="Share previews"
        description="See how key pages look when shared on WhatsApp, Instagram, or Google. Use consistent titles and images before posting."
      />

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-border bg-surface p-5">
          <h2 className="font-medium">Pages</h2>
          <ul className="mt-3 space-y-1 text-sm">
            {pages.map((item, index) => (
              <li key={item.path}>
                <button
                  type="button"
                  onClick={() => setSelected(index)}
                  className={`w-full rounded-md px-3 py-2 text-left ${selected === index ? "bg-canvas font-medium" : "text-ink-muted hover:text-ink"}`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {page && preview ? (
          <div className="space-y-4">
            <SerpPreview title={preview.title} url={preview.url} description={preview.description} />
            {page.image ? (
              <div className="rounded-lg border border-border bg-surface p-5">
                <h3 className="text-sm font-medium">Share image</h3>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={page.image} alt="" className="mt-3 max-h-48 rounded-md object-cover" />
                <p className="mt-2 break-all text-xs text-ink-muted">{page.image}</p>
              </div>
            ) : null}
            <Button
              size="sm"
              variant="secondary"
              onClick={async () => {
                await navigator.clipboard.writeText(page.url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            >
              {copied ? "Link copied" : "Copy page URL"}
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
