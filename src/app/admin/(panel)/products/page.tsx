"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/field";
import { availableStock, categoryById, petTypeById, stockStatus } from "@/lib/catalog";
import { formatInr } from "@/lib/format";
import { useDemo } from "@/lib/demo-store";

export default function AdminProductsPage() {
  const { state, deleteEntity, duplicateProduct, can } = useDemo();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const canDelete = can("catalogue.delete");

  const products = useMemo(
    () =>
      state.products
        .filter((product) => !product.archived)
        .filter((product) => product.name.toLowerCase().includes(query.toLowerCase()) || product.sku.includes(query.toUpperCase()))
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [state.products, query],
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
        <Link href="/admin/products/new">
          <Button size="sm">Add product</Button>
        </Link>
      </div>
      <Input className="mt-4 max-w-sm" placeholder="Search name or SKU" value={query} onChange={(event) => setQuery(event.target.value)} />
      <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-ink-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">SKU</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const qty = availableStock(state, product);
              const status = stockStatus(qty, product.lowStockThreshold);
              return (
                <tr key={product.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <Link href={`/admin/products/${product.id}`} className="font-medium">
                      {product.name}
                    </Link>
                    <p className="text-xs text-ink-muted">
                      {petTypeById(state, product.petTypeId)?.name} · {categoryById(state, product.categoryId)?.name}
                    </p>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{product.sku}</td>
                  <td className="px-4 py-3">{formatInr(product.price)}</td>
                  <td className="px-4 py-3">
                    <Badge tone={status === "ok" ? "success" : status === "low" ? "accent" : "danger"}>{qty}</Badge>
                  </td>
                  <td className="px-4 py-3">{product.published ? "Published" : "Draft"}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <Link href={`/admin/products/${product.id}`} className="text-accent">
                      Edit
                    </Link>
                    <button
                      className="ml-3 text-ink-muted"
                      onClick={() => router.push(`/admin/products/${duplicateProduct(product.id)}`)}
                    >
                      Duplicate
                    </button>
                    {canDelete ? (
                      <button
                        className="ml-3 text-danger"
                        onClick={() => {
                          if (confirm(`Delete ${product.name}?`)) deleteEntity("products", product.id);
                        }}
                      >
                        Delete
                      </button>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
