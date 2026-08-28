"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Field, Input } from "@/components/ui/field";
import { TableSortSelect } from "@/components/admin/table-sort-select";
import { cmpNumber, cmpString, sortRows } from "@/lib/admin-table-sort";
import { slugify } from "@/lib/slug";
import { useDemo } from "@/lib/demo-store";
import type { Category } from "@/types/catalog";

type Draft = Partial<Category>;

export default function CategoriesPage() {
  const { state, saveCategory, deleteEntity, can } = useDemo();
  const canDelete = can("catalogue.delete");
  const [editing, setEditing] = useState<Draft | null>(null);
  const [error, setError] = useState("");
  const [sort, setSort] = useState("order-asc");
  const sortOptions = [
    { value: "order-asc", label: "Display order" },
    { value: "name-asc", label: "Name (A–Z)" },
    { value: "name-desc", label: "Name (Z–A)" },
  ];
  const rows = useMemo(() => {
    const filtered = state.categories.filter((item) => !item.archived);
    return sortRows(filtered, sort, {
      "order-asc": (a, b) => cmpNumber(a.sortOrder, b.sortOrder),
      "name-asc": (a, b) => cmpString(a.name, b.name),
      "name-desc": (a, b) => cmpString(b.name, a.name),
    });
  }, [state.categories, sort]);

  function togglePet(draft: Draft, petId: string) {
    const current = draft.petTypeIds ?? [];
    const petTypeIds = current.includes(petId) ? current.filter((id) => id !== petId) : [...current, petId];
    setEditing({ ...draft, petTypeIds });
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Categories</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Shared across pets. Create Food once, then choose which pet types it applies to.
          </p>
        </div>
        <Button
          size="sm"
          onClick={() =>
            setEditing({
              name: "",
              slug: "",
              sortOrder: rows.length + 1,
              petTypeIds: state.petTypes.map((pet) => pet.id),
            })
          }
        >
          Add
        </Button>
      </div>
      <div className="mt-4 flex justify-end">
        <TableSortSelect options={sortOptions} value={sort} onChange={setSort} />
      </div>
      <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-ink-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Applies to</th>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  {row.name}
                  <span className="block text-xs text-ink-muted">{row.slug}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {row.petTypeIds.map((id) => (
                      <Badge key={id}>{state.petTypes.find((pet) => pet.id === id)?.name ?? id}</Badge>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">{row.sortOrder}</td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <button className="text-accent" onClick={() => setEditing(row)}>
                    Edit
                  </button>
                  {canDelete ? (
                    <button
                      className="ml-3 text-danger"
                      onClick={() => {
                        if (confirm(`Delete ${row.name}?`)) deleteEntity("categories", row.id);
                      }}
                    >
                      Delete
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editing ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-inverse/50 p-4">
          <form
            className="w-full max-w-md space-y-4 rounded-lg bg-surface p-5"
            onSubmit={(event) => {
              event.preventDefault();
              setError("");
              const petTypeIds = editing.petTypeIds ?? [];
              if (!petTypeIds.length) {
                setError("Choose at least one pet type.");
                return;
              }
              const slug = editing.slug ?? slugify(editing.name ?? "");
              const slugTaken = state.categories.some(
                (row) => !row.archived && row.slug === slug && row.id !== editing.id,
              );
              if (slugTaken) {
                setError("That slug is already used. Shared categories need a unique slug (one Food, one Toys).");
                return;
              }
              saveCategory({
                id: editing.id,
                name: editing.name ?? "",
                slug,
                sortOrder: Number(editing.sortOrder ?? 1),
                petTypeIds,
              });
              setEditing(null);
            }}
          >
            <h2 className="font-medium">{editing.id ? "Edit category" : "Add category"}</h2>
            <Field label="Name">
              <Input
                value={editing.name ?? ""}
                onChange={(event) =>
                  setEditing({
                    ...editing,
                    name: event.target.value,
                    slug: editing.id ? editing.slug : slugify(event.target.value),
                  })
                }
                required
              />
            </Field>
            <Field label="Slug">
              <Input
                value={editing.slug ?? ""}
                onChange={(event) => setEditing({ ...editing, slug: slugify(event.target.value) })}
                required
              />
            </Field>
            <Field label="Applies to pet types" hint="Food can be Dog, Cat and Bird. Toys might skip Bird.">
              <div className="space-y-2 rounded-md border border-border px-3 py-2">
                {state.petTypes
                  .filter((pet) => !pet.archived)
                  .map((pet) => (
                    <label key={pet.id} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={(editing.petTypeIds ?? []).includes(pet.id)}
                        onChange={() => togglePet(editing, pet.id)}
                      />
                      {pet.name}
                    </label>
                  ))}
              </div>
            </Field>
            <Field label="Sort order">
              <Input
                type="number"
                value={editing.sortOrder ?? 1}
                onChange={(event) => setEditing({ ...editing, sortOrder: Number(event.target.value) })}
              />
            </Field>
            {error ? <p className="text-sm text-danger">{error}</p> : null}
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
