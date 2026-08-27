"use client";

import { EntityManager } from "@/components/admin/entity-manager";
import { useDemo } from "@/lib/demo-store";

export default function PetTypesPage() {
  const { state, savePetType, deleteEntity } = useDemo();
  return (
    <EntityManager
      title="Pet types"
      rows={state.petTypes.filter((item) => !item.archived)}
      onSave={(item) => savePetType(item)}
      onDelete={(id) => deleteEntity("petTypes", id)}
    />
  );
}
