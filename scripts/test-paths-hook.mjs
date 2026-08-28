import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = path.resolve(import.meta.dirname, "..");
const src = path.join(root, "src");

function resolveAlias(specifier) {
  if (!specifier.startsWith("@/")) return null;
  const relative = specifier.slice(2);
  const base = path.join(src, relative);
  if (relative.endsWith(".ts") || relative.endsWith(".tsx")) {
    return pathToFileURL(base).href;
  }
  const candidates = [`${base}.ts`, `${base}.tsx`, path.join(base, "index.ts"), path.join(base, "index.tsx")];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return pathToFileURL(candidate).href;
  }
  return pathToFileURL(`${base}.ts`).href;
}

export async function resolve(specifier, context, nextResolve) {
  const mapped = resolveAlias(specifier);
  if (mapped) return nextResolve(mapped, context);
  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  return nextLoad(url, context);
}
