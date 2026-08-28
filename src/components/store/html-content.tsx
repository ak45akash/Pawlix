import { sanitizeHtml } from "@/lib/html";
import { cn } from "@/lib/utils/cn";

export function HtmlContent({ html, className }: { html: string; className?: string }) {
  return (
    <div
      className={cn("rich-content", className)}
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }}
    />
  );
}
