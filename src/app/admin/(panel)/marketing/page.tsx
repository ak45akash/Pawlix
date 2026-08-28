"use client";

import Link from "next/link";
import {
  Calendar,
  Gift,
  Link2,
  MapPin,
  Megaphone,
  Search,
  Share2,
  Sparkles,
  Tag,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SeoMeter } from "@/components/admin/seo-meter";
import { MarketingPageHeader, RequireMarketing } from "@/components/admin/marketing-shell";
import { marketingHubMetrics } from "@/lib/marketing";
import { useDemo } from "@/lib/demo-store";

const tools = [
  { href: "/admin/seo", label: "SEO", description: "Scores, keywords, and search previews", icon: Search },
  { href: "/admin/marketing/promotions", label: "Promotions", description: "Coupons, usage, and offer ideas", icon: Tag },
  { href: "/admin/marketing/announcements", label: "Announcements", description: "Site-wide banners and alerts", icon: Megaphone },
  { href: "/admin/marketing/newsletter", label: "Newsletter", description: "Subscriber list and export", icon: Users },
  { href: "/admin/marketing/local", label: "Local listings", description: "Google, social, and NAP consistency", icon: MapPin },
  { href: "/admin/marketing/share", label: "Share previews", description: "Open Graph cards for key pages", icon: Share2 },
  { href: "/admin/marketing/campaigns", label: "Campaign links", description: "UTM links for social and WhatsApp", icon: Link2 },
  { href: "/admin/marketing/content", label: "Content calendar", description: "Blog and recipe SEO schedule", icon: Calendar },
  { href: "/admin/marketing/referrals", label: "Referrals", description: "Refer-a-friend rewards (demo)", icon: Gift },
];

export default function MarketingHubPage() {
  return (
    <RequireMarketing>
      <MarketingHub />
    </RequireMarketing>
  );
}

function MarketingHub() {
  const { state } = useDemo();
  const metrics = marketingHubMetrics(state);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <MarketingPageHeader
          title="Marketing"
          description="Grow the shop — SEO, promos, announcements, campaigns, and local presence across the Tricity."
        />
        <div className="flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3">
          <SeoMeter score={metrics.seoScore} size="sm" />
          <div>
            <p className="text-sm font-medium">Site SEO</p>
            <p className="text-xs text-ink-muted">{metrics.weakPages} pages below target</p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Active coupons", value: metrics.activeCoupons },
          { label: "Live banners", value: metrics.liveAnnouncements },
          { label: "Subscribers", value: metrics.subscribers },
          { label: "Campaign links", value: metrics.campaigns },
        ].map((item) => (
          <div key={item.label} className="rounded-lg border border-border bg-surface p-4">
            <p className="text-2xl font-semibold tabular-nums">{item.value}</p>
            <p className="mt-1 text-sm text-ink-muted">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group rounded-lg border border-border bg-surface p-5 transition-colors hover:border-accent/40 hover:bg-canvas"
          >
            <div className="flex items-start justify-between gap-3">
              <tool.icon className="size-5 text-accent" />
              <Sparkles className="size-4 text-ink-muted opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <h2 className="mt-3 font-medium">{tool.label}</h2>
            <p className="mt-1 text-sm text-ink-muted">{tool.description}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-surface p-5">
        <h2 className="font-medium">Quick wins this week</h2>
        <ul className="mt-3 space-y-2 text-sm text-ink-muted">
          <li className="flex items-center gap-2">
            <Badge tone="accent">Tip</Badge>
            Link Instagram bio to a campaign URL with <code className="text-xs">utm_source=instagram</code>.
          </li>
          <li className="flex items-center gap-2">
            <Badge tone="accent">Tip</Badge>
            Keep one announcement live for free shipping above ₹1,499.
          </li>
          <li className="flex items-center gap-2">
            <Badge tone="accent">Tip</Badge>
            Publish one recipe with a focus keyword from the SEO keyword library.
          </li>
        </ul>
      </div>
    </div>
  );
}
