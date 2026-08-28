"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { SeoMeter, SerpPreview } from "@/components/admin/seo-meter";
import { allSkus, categoriesForPet, productVariants, subcategoriesForCategory } from "@/lib/catalog";
import { resolveSku, SkuError } from "@/features/products/sku.ts";
import { createId, slugify } from "@/lib/slug";
import { analyzeContent } from "@/lib/seo";
import { useDemo } from "@/lib/demo-store";
import type { Product, ProductVariant } from "@/types/catalog";

export function ProductForm({ productId }: { productId?: string }) {
  const { state, saveProduct } = useDemo();
  const router = useRouter();
  const existing = state.products.find((item) => item.id === productId);
  const [error, setError] = useState("");
  const [name, setName] = useState(existing?.name ?? "");
  const [slug, setSlug] = useState(existing?.slug ?? "");
  const [sku, setSku] = useState(existing?.sku ?? "");
  const [skuTouched, setSkuTouched] = useState(existing?.skuSource === "manual");
  const [petTypeId, setPetTypeId] = useState(existing?.petTypeId ?? state.petTypes[0]?.id ?? "");
  const [categoryId, setCategoryId] = useState(existing?.categoryId ?? "");
  const [subcategoryId, setSubcategoryId] = useState(existing?.subcategoryId ?? "");
  const [brandId, setBrandId] = useState(existing?.brandId ?? "");
  const [shortDescription, setShortDescription] = useState(existing?.shortDescription ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [image, setImage] = useState(existing?.image ?? "");
  const [mrp, setMrp] = useState(existing?.mrp ?? 0);
  const [price, setPrice] = useState(existing?.price ?? 0);
  const [cost, setCost] = useState(existing?.cost ?? 0);
  const [stock, setStock] = useState(existing?.stock ?? 0);
  const [lowStockThreshold, setLowStockThreshold] = useState(existing?.lowStockThreshold ?? 10);
  const [published, setPublished] = useState(existing?.published ?? true);
  const [featured, setFeatured] = useState(existing?.featured ?? false);
  const [sortOrder, setSortOrder] = useState(existing?.sortOrder ?? state.products.length + 1);
  const [seoTitle, setSeoTitle] = useState(existing?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(existing?.seoDescription ?? "");
  const [focusKeyword, setFocusKeyword] = useState(existing?.focusKeyword ?? "");
  const [variants, setVariants] = useState<ProductVariant[]>(existing ? productVariants(state, existing.id) : []);

  const categories = categoriesForPet(state, petTypeId);
  const subcategories = subcategoriesForCategory(state, categoryId);
  const pet = state.petTypes.find((item) => item.id === petTypeId);
  const category = state.categories.find((item) => item.id === categoryId);
  const previewSku = useMemo(() => {
    try {
      return resolveSku({
        submittedSku: skuTouched ? sku : "",
        previousSku: existing?.sku,
        previousSource: existing?.skuSource,
        petTypeSlug: pet?.slug,
        categorySlug: category?.slug,
        sequential: state.products.length + 1,
        existingSkus: allSkus(state, { productId }),
      }).sku;
    } catch {
      return sku;
    }
  }, [sku, skuTouched, existing, pet, category, state, productId]);

  function save(event: FormEvent) {
    event.preventDefault();
    setError("");
    try {
      const resolved = resolveSku({
        submittedSku: skuTouched ? sku : "",
        previousSku: existing?.sku,
        previousSource: existing?.skuSource,
        petTypeSlug: pet?.slug,
        categorySlug: category?.slug,
        sequential: state.products.length + 1,
        existingSkus: allSkus(state, { productId: existing?.id }),
      });
      const id = existing?.id ?? createId("prd");
      const product: Product = {
        id,
        name,
        slug: slug || slugify(name),
        sku: resolved.sku,
        skuSource: resolved.source,
        shortDescription,
        description,
        petTypeId,
        categoryId: categoryId || categories[0]?.id,
        subcategoryId: subcategoryId || null,
        brandId: brandId || null,
        image: image || "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80",
        images: [image || "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80"],
        mrp: Number(mrp),
        price: Number(price),
        cost: Number(cost),
        gstPercent: 18,
        stock: Number(stock),
        lowStockThreshold: Number(lowStockThreshold),
        published,
        featured,
        sortOrder: Number(sortOrder),
        seoTitle: seoTitle.trim() || name,
        seoDescription: seoDescription.trim() || shortDescription,
        focusKeyword: focusKeyword.trim(),
        archived: false,
        createdAt: existing?.createdAt ?? new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const nextVariants = variants.map((variant, index) => {
        const variantResolved = resolveSku({
          submittedSku: variant.sku,
          previousSku: resolved.sku,
          previousSource: variant.sku.trim() ? "manual" : "auto",
          sequential: index + 1,
          existingSkus: [...allSkus(state, { productId: id, variantId: variant.id }), resolved.sku],
          variantLabel: variant.name || `VAR${index + 1}`,
        });
        return {
          ...variant,
          productId: id,
          sku: variantResolved.sku,
          skuSource: variant.sku.trim() ? ("manual" as const) : variantResolved.source,
        };
      });
      saveProduct(product, nextVariants);
      router.push("/admin/products");
    } catch (caught) {
      setError(caught instanceof SkuError || caught instanceof Error ? caught.message : "Could not save product");
    }
  }

  return (
    <form className="max-w-3xl space-y-5" onSubmit={save}>
      <h1 className="text-2xl font-semibold tracking-tight">{existing ? "Edit product" : "New product"}</h1>
      <Field label="Name">
        <Input
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            if (!existing) setSlug(slugify(event.target.value));
          }}
          required
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Slug">
          <Input value={slug} onChange={(event) => setSlug(slugify(event.target.value))} required />
        </Field>
        <Field label="SKU" hint="Leave blank to auto-generate. Edit anytime to override.">
          <Input
            value={sku}
            placeholder={previewSku}
            onChange={(event) => {
              setSku(event.target.value);
              setSkuTouched(event.target.value.trim().length > 0);
            }}
          />
        </Field>
      </div>
      <p className="text-xs text-ink-muted">
        {skuTouched ? `Manual SKU will save as ${previewSku}` : `Auto SKU: ${previewSku}`}
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Pet type">
          <Select
            value={petTypeId}
            onChange={(event) => {
              setPetTypeId(event.target.value);
              setCategoryId("");
            }}
          >
            {state.petTypes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Category">
          <Select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
            <option value="">Select</option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Subcategory">
          <Select value={subcategoryId} onChange={(event) => setSubcategoryId(event.target.value)}>
            <option value="">None</option>
            {subcategories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <Field label="Brand">
        <Select value={brandId} onChange={(event) => setBrandId(event.target.value)}>
          <option value="">None</option>
          {state.brands.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Short description">
        <Input value={shortDescription} onChange={(event) => setShortDescription(event.target.value)} />
      </Field>
      <Field label="Description">
        <Textarea value={description} onChange={(event) => setDescription(event.target.value)} />
      </Field>
      <Field label="Image URL">
        <Input value={image} onChange={(event) => setImage(event.target.value)} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-4">
        <Field label="MRP">
          <Input type="number" value={mrp} onChange={(event) => setMrp(Number(event.target.value))} />
        </Field>
        <Field label="Selling price">
          <Input type="number" value={price} onChange={(event) => setPrice(Number(event.target.value))} />
        </Field>
        <Field label="Cost">
          <Input type="number" value={cost} onChange={(event) => setCost(Number(event.target.value))} />
        </Field>
        <Field label="Stock">
          <Input type="number" value={stock} onChange={(event) => setStock(Number(event.target.value))} />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Low stock threshold">
          <Input type="number" value={lowStockThreshold} onChange={(event) => setLowStockThreshold(Number(event.target.value))} />
        </Field>
        <Field label="Sort order">
          <Input type="number" value={sortOrder} onChange={(event) => setSortOrder(Number(event.target.value))} />
        </Field>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={published} onChange={(event) => setPublished(event.target.checked)} />
        Published
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={featured} onChange={(event) => setFeatured(event.target.checked)} />
        Featured
      </label>
      <div className="rounded-lg border border-border p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-medium">SEO</h2>
          <SeoMeter
            size="sm"
            score={analyzeContent({
              kind: "product",
              title: name,
              slug,
              body: `${shortDescription}\n${description}`,
              excerpt: shortDescription,
              seoTitle: seoTitle || name,
              seoDescription: seoDescription || shortDescription,
              focusKeyword: focusKeyword || name,
              coverImage: image,
            }).score}
          />
        </div>
        <div className="space-y-3">
          <Field label="Focus keyword">
            <Input value={focusKeyword} onChange={(event) => setFocusKeyword(event.target.value)} />
          </Field>
          <Field label="SEO title" hint={`${(seoTitle || name).length}/60`}>
            <Input value={seoTitle} placeholder={name} onChange={(event) => setSeoTitle(event.target.value)} />
          </Field>
          <Field label="Meta description" hint={`${(seoDescription || shortDescription).length}/160`}>
            <Textarea value={seoDescription} placeholder={shortDescription} onChange={(event) => setSeoDescription(event.target.value)} />
          </Field>
          <SerpPreview title={seoTitle || name} url={`pawlix.com/product/${slug || "slug"}`} description={seoDescription || shortDescription} />
        </div>
      </div>
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-medium">Variants</h2>
          <Button
            size="sm"
            variant="secondary"
            onClick={() =>
              setVariants([
                ...variants,
                {
                  id: createId("var"),
                  productId: existing?.id ?? "new",
                  name: "",
                  sku: "",
                  skuSource: "auto",
                  price,
                  mrp,
                  cost,
                  stock: 0,
                },
              ])
            }
          >
            Add variant
          </Button>
        </div>
        <div className="space-y-3">
          {variants.map((variant, index) => (
            <div key={variant.id} className="grid gap-2 rounded-md border border-border p-3 sm:grid-cols-5">
              <Input
                placeholder="Name (1kg)"
                value={variant.name}
                onChange={(event) =>
                  setVariants(variants.map((row, rowIndex) => (rowIndex === index ? { ...row, name: event.target.value } : row)))
                }
              />
              <Input
                placeholder="SKU optional"
                value={variant.sku}
                onChange={(event) =>
                  setVariants(variants.map((row, rowIndex) => (rowIndex === index ? { ...row, sku: event.target.value } : row)))
                }
              />
              <Input
                type="number"
                placeholder="Price"
                value={variant.price}
                onChange={(event) =>
                  setVariants(variants.map((row, rowIndex) => (rowIndex === index ? { ...row, price: Number(event.target.value) } : row)))
                }
              />
              <Input
                type="number"
                placeholder="Stock"
                value={variant.stock}
                onChange={(event) =>
                  setVariants(variants.map((row, rowIndex) => (rowIndex === index ? { ...row, stock: Number(event.target.value) } : row)))
                }
              />
              <Button variant="ghost" size="sm" onClick={() => setVariants(variants.filter((_, rowIndex) => rowIndex !== index))}>
                Remove
              </Button>
            </div>
          ))}
        </div>
      </div>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <div className="flex gap-2">
        <Button type="submit">Save product</Button>
        <Button variant="secondary" onClick={() => router.push("/admin/products")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
