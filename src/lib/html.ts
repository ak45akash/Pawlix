const ALLOWED_TAGS = new Set([
  "P",
  "H2",
  "H3",
  "H4",
  "UL",
  "OL",
  "LI",
  "BLOCKQUOTE",
  "A",
  "IMG",
  "STRONG",
  "EM",
  "B",
  "I",
  "BR",
  "FIGURE",
  "FIGCAPTION",
  "SPAN",
  "DIV",
]);

const ALLOWED_ATTR: Record<string, Set<string>> = {
  A: new Set(["href", "target", "rel"]),
  IMG: new Set(["src", "alt"]),
};

function isSafeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return false;
  const lower = trimmed.toLowerCase();
  return (
    lower.startsWith("https://") ||
    lower.startsWith("http://") ||
    lower.startsWith("mailto:") ||
    lower.startsWith("/") ||
    lower.startsWith("data:image/")
  );
}

export function sanitizeHtml(html: string) {
  if (typeof window === "undefined") return html;
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${html}</div>`, "text/html");
  const root = doc.body.firstElementChild;
  if (!root) return "";

  function clean(node: Node) {
    const children = Array.from(node.childNodes);
    for (const child of children) {
      if (child.nodeType === Node.COMMENT_NODE) {
        child.remove();
        continue;
      }
      if (child.nodeType === Node.TEXT_NODE) continue;
      if (!(child instanceof HTMLElement)) {
        child.remove();
        continue;
      }
      const tag = child.tagName;
      if (!ALLOWED_TAGS.has(tag)) {
        const parent = child.parentNode;
        if (parent) {
          while (child.firstChild) parent.insertBefore(child.firstChild, child);
          child.remove();
        }
        continue;
      }
      for (const attr of Array.from(child.attributes)) {
        const name = attr.name.toLowerCase();
        if (name.startsWith("on") || name === "style") {
          child.removeAttribute(attr.name);
          continue;
        }
        const allowed = ALLOWED_ATTR[tag];
        if (!allowed || !allowed.has(attr.name)) {
          child.removeAttribute(attr.name);
          continue;
        }
        if ((name === "href" || name === "src") && !isSafeUrl(attr.value)) {
          child.removeAttribute(attr.name);
        }
      }
      if (tag === "A") {
        child.setAttribute("rel", "noopener noreferrer");
        if (child.getAttribute("href")?.startsWith("http")) {
          child.setAttribute("target", "_blank");
        }
      }
      clean(child);
    }
  }

  clean(root);
  return root.innerHTML;
}

export function htmlToPlainText(html: string) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function estimateReadingMinutes(html: string) {
  const words = htmlToPlainText(html).split(" ").filter(Boolean).length;
  return Math.max(1, Math.round(words / 180));
}
