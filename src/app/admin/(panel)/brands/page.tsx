"use client";

import { EntityManager } from "@/components/admin/entity-manager";
import { useDemo } from "@/lib/demo-store";

export default function BrandsPage() {
  const { state, saveBrand, deleteEntity } = useDemo();
  return (
    <EntityManager
      title="Brands"
      rows={state.brands.filter((item) => !item.archived)}
      onSave={(item) => saveBrand(item)}
      onDelete={(id) => deleteEntity("brands", id)}
    />
  );
}
