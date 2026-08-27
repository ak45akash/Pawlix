"use client";

import { useParams } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { useDemo } from "@/lib/demo-store";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const { state } = useDemo();
  const exists = state.products.some((product) => product.id === id);
  if (!exists) return <p>Product not found.</p>;
  return <ProductForm productId={id} />;
}
