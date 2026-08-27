"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { availableStock, productVariants, stockStatus } from "@/lib/catalog";
import { formatDate } from "@/lib/format";
import { useDemo } from "@/lib/demo-store";

export default function InventoryPage() {
  const { state, adjustStock } = useDemo();
  const [productId, setProductId] = useState(state.products[0]?.id ?? "");
  const [variantId, setVariantId] = useState("");
  const [type, setType] = useState<"STOCK_ADJUSTMENT" | "OFFLINE_SALE" | "STOCK_RECEIVED" | "DAMAGED">("OFFLINE_SALE");
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const variants = productVariants(state, productId);

  return (
    <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
      <form
        className="space-y-4 rounded-lg border border-border bg-surface p-4"
        onSubmit={(event) => {
          event.preventDefault();
          setError("");
          try {
            adjustStock({
              productId,
              variantId: variantId || null,
              type,
              quantity,
              reason: reason || type.replace(/_/g, " "),
              note,
            });
            setQuantity(1);
            setNote("");
          } catch (caught) {
            setError(caught instanceof Error ? caught.message : "Could not update stock");
          }
        }}
      >
        <h1 className="text-xl font-semibold">Inventory</h1>
        <Field label="Product">
          <Select
            value={productId}
            onChange={(event) => {
              setProductId(event.target.value);
              setVariantId("");
            }}
          >
            {state.products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </Select>
        </Field>
        {variants.length ? (
          <Field label="Variant">
            <Select value={variantId} onChange={(event) => setVariantId(event.target.value)}>
              <option value="">Select variant</option>
              {variants.map((variant) => (
                <option key={variant.id} value={variant.id}>
                  {variant.name} · {variant.stock}
                </option>
              ))}
            </Select>
          </Field>
        ) : null}
        <Field label="Action">
          <Select value={type} onChange={(event) => setType(event.target.value as typeof type)}>
            <option value="OFFLINE_SALE">Record offline sale</option>
            <option value="STOCK_RECEIVED">Stock received</option>
            <option value="STOCK_ADJUSTMENT">Adjustment (+/−)</option>
            <option value="DAMAGED">Damaged</option>
          </Select>
        </Field>
        <Field label="Quantity" hint={type === "STOCK_ADJUSTMENT" ? "Use a negative number to reduce." : undefined}>
          <Input type="number" value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} />
        </Field>
        <Field label="Reason">
          <Input value={reason} onChange={(event) => setReason(event.target.value)} />
        </Field>
        <Field label="Note">
          <Textarea value={note} onChange={(event) => setNote(event.target.value)} />
        </Field>
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <Button type="submit">{type === "OFFLINE_SALE" ? "Record sale" : "Update stock"}</Button>
      </form>
      <div>
        <h2 className="font-medium">Current stock</h2>
        <div className="mt-3 overflow-x-auto rounded-lg border border-border bg-surface">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-ink-muted">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Qty</th>
              </tr>
            </thead>
            <tbody>
              {state.products.map((product) => {
                const qty = availableStock(state, product);
                const status = stockStatus(qty, product.lowStockThreshold);
                return (
                  <tr key={product.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3">{product.name}</td>
                    <td className="px-4 py-3">
                      <Badge tone={status === "ok" ? "success" : status === "low" ? "accent" : "danger"}>{qty}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <h2 className="mt-8 font-medium">Movement history</h2>
        <div className="mt-3 space-y-3">
          {state.movements.map((movement) => (
            <div key={movement.id} className="rounded-md border border-border bg-surface p-3 text-sm">
              <p className="font-medium">
                {movement.type.replace(/_/g, " ")} · {movement.quantityChange > 0 ? "+" : ""}
                {movement.quantityChange}
              </p>
              <p className="text-ink-muted">
                {movement.previousQuantity} → {movement.newQuantity} · {movement.actor} · {formatDate(movement.createdAt)}
              </p>
              {movement.note ? <p className="text-ink-muted">{movement.note}</p> : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
