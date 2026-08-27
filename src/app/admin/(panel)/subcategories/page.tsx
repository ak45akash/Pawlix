"use client";

import { EntityManager } from "@/components/admin/entity-manager";
import { Field, Select } from "@/components/ui/field";
import { useDemo } from "@/lib/demo-store";

export default function SubcategoriesPage() {
  const { state, saveSubcategory, deleteEntity } = useDemo();
  return (
    <EntityManager
      title="Subcategories"
      rows={state.subcategories.filter((item) => !item.archived)}
      extraFields={(item, setItem) => (
        <Field label="Category">
          <Select
            value={(item as { categoryId?: string }).categoryId ?? state.categories[0]?.id}
            onChange={(event) => setItem({ ...item, categoryId: event.target.value })}
          >
            {state.categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        </Field>
      )}
      onSave={(item) =>
        saveSubcategory({
          ...item,
          categoryId: (item as { categoryId?: string }).categoryId ?? state.categories[0].id,
        })
      }
      onDelete={(id) => deleteEntity("subcategories", id)}
    />
  );
}
