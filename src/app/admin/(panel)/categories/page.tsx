"use client";

import { EntityManager } from "@/components/admin/entity-manager";
import { Field, Select } from "@/components/ui/field";
import { useDemo } from "@/lib/demo-store";

export default function CategoriesPage() {
  const { state, saveCategory, deleteEntity } = useDemo();
  return (
    <EntityManager
      title="Categories"
      rows={state.categories.filter((item) => !item.archived)}
      extraFields={(item, setItem) => (
        <Field label="Pet type">
          <Select
            value={(item as { petTypeId?: string }).petTypeId ?? state.petTypes[0]?.id}
            onChange={(event) => setItem({ ...item, petTypeId: event.target.value })}
          >
            {state.petTypes.map((pet) => (
              <option key={pet.id} value={pet.id}>
                {pet.name}
              </option>
            ))}
          </Select>
        </Field>
      )}
      onSave={(item) =>
        saveCategory({
          ...item,
          petTypeId: (item as { petTypeId?: string }).petTypeId ?? state.petTypes[0].id,
        })
      }
      onDelete={(id) => deleteEntity("categories", id)}
    />
  );
}
