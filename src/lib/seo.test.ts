import assert from "node:assert/strict";
import test from "node:test";
import { analyzeContent, extractKeywords, slugFromKeyword, suggestionsFromChecks } from "./seo.ts";

test("extractKeywords skips stop words and ranks repeats", () => {
  const hits = extractKeywords("dog food for the dog and cat food for the cat food bowl");
  assert.ok(hits.some((hit) => hit.term === "food"));
  assert.equal(hits.some((hit) => hit.term === "the"), false);
});

test("a complete blog scores higher than an empty draft", () => {
  const empty = analyzeContent({
    kind: "blog",
    title: "Hi",
    slug: "x",
    body: "<p>Hi</p>",
    seoTitle: "",
    seoDescription: "",
    focusKeyword: "",
  });
  const complete = analyzeContent({
    kind: "blog",
    title: "How we choose dog food for everyday bowls",
    slug: "how-we-choose-dog-food",
    body: `<p>Dog food on our shelf starts with a named protein and a feeding guide we would use at home. We keep the list short so every bag earns its space.</p>
<h2>What we look for</h2>
<p>Named chicken or fish near the top, no artificial colour, and a mill we can describe. <a href="/shop?category=food">Shop dog food</a> if you want the current list.</p>
<p>Mix new dog food in slowly over a week. Write to us if a recipe does not sit well — we would rather take it back than have it sit in a cupboard unused.</p>
<p>Inventory is shared between the website and the counter. If a recipe is out, it is out everywhere, including dog food that usually turns over in a few days.</p>`,
    excerpt: "Short lists and named proteins for everyday dog food.",
    seoTitle: "How we choose dog food | Pawlix",
    seoDescription: "How Pawlix chooses everyday dog food: named proteins, no dye, and recipes we would feed at home.",
    focusKeyword: "dog food",
    coverImage: "https://example.com/bowl.jpg",
  });
  assert.ok(complete.score > empty.score);
  assert.ok(complete.score >= 70);
  assert.equal(complete.checks.find((check) => check.id === "keyword-title")?.status, "pass");
});

test("slugFromKeyword hyphenates a phrase", () => {
  assert.equal(slugFromKeyword("Dog Food"), "dog-food");
});

test("suggestionsFromChecks returns actionable tips for failing checks", () => {
  const tips = suggestionsFromChecks([
    { id: "focus-keyword", label: "Focus keyword set", status: "fail", detail: "Add a focus keyword.", weight: 10 },
    { id: "title-length", label: "Title length", status: "pass", detail: "45 characters.", weight: 8 },
  ]);
  assert.equal(tips.length, 1);
  assert.equal(tips[0]?.id, "focus-keyword");
  assert.equal(tips[0]?.priority, "high");
  assert.equal(tips[0]?.title, "Set a focus keyword");
});
