import Link from "next/link";
import { formatDate } from "@/lib/format";
import { postPath } from "@/lib/content";
import type { ContentPost } from "@/types/catalog";
import { SmartImage } from "@/components/ui/smart-image";

export function PostCard({ post }: { post: ContentPost }) {
  return (
    <Link href={postPath(post)} className="group block">
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-canvas">
        <SmartImage
          src={post.coverImage}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>
      <p className="mt-4 text-xs tracking-[0.18em] text-accent uppercase">
        {post.kind === "recipe" ? "Recipe" : "Journal"}
      </p>
      <h3 className="font-display mt-2 text-xl leading-snug">{post.title}</h3>
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-muted">{post.excerpt}</p>
      <p className="mt-3 text-xs text-ink-muted">
        {formatDate(post.publishedAt)} · {post.readingMinutes} min
      </p>
    </Link>
  );
}
