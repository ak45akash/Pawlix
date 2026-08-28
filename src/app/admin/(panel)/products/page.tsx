"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/field";
import { availableStock, categoryById, petTypeById, stockStatus } from "@/lib/catalog";
import { cmpNumber, cmpString, sortRows } from "@/lib/admin-table-sort";
import { TableSortSelect } from "@/components/admin/table-sort-select";
import { formatInr } from "@/lib/format";
import { useDemo } from "@/lib/demo-store";

export default function AdminProductsPage() {
  const { state, deleteEntity, duplicateProduct, can } = useDemo();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("order-asc");
  const canDelete = can("catalogue.delete");
  const sortOptions = [
    { value: "order-asc", label: "Display order" },
    { value: "name-asc", label: "Name (A–Z)" },
    { value: "price-asc", label: "Price (low to high)" },
    { value: "price-desc", label: "Price (high to low)" },
    { value: "stock-asc", label: "Stock (low first)" },
    { value: "status-draft", label: "Drafts first" },
  ];

  const products = useMemo(() => {
    const filtered = state.products
      .filter((product) => !product.archived)
      .filter((product) => product.name.toLowerCase().includes(query.toLowerCase()) || product.sku.includes(query.toUpperCase()));
    return sortRows(filtered, sort, {
      "order-asc": (a, b) => cmpNumber(a.sortOrder, b.sortOrder),
      "name-asc": (a, b) => cmpString(a.name, b.name),
      "price-asc": (a, b) => cmpNumber(a.price, b.price),
      "price-desc": (a, b) => cmpNumber(b.price, a.price),
      "stock-asc": (a, b) => cmpNumber(availableStock(state, a), availableStock(state, b)),
      "status-draft": (a, b) => cmpNumber(Number(a.published), Number(b.published)),
    });
  }, [state, query, sort]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
        <Link href="/admin/products/new">
          <Button size="sm">Add product</Button>
        </Link>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <Input className="max-w-sm" placeholder="Search name or SKU" value={query} onChange={(event) => setQuery(event.target.value)} />
        <TableSortSelect options={sortOptions} value={sort} onChange={setSort} />
      </div>
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
