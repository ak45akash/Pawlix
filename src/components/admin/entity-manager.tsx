"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { slugify } from "@/lib/slug";
import { useDemo } from "@/lib/demo-store";

type Entity = { id: string; name: string; slug: string; sortOrder: number };

export function EntityManager<T extends Entity>({
  title,
  rows,
  extraFields,
  onSave,
  onDelete,
}: {
  title: string;
  rows: T[];
  extraFields?: (item: Partial<T>, setItem: (next: Partial<T>) => void) => React.ReactNode;
  onSave: (item: Omit<T, "id" | "archived"> & { id?: string }) => void;
  onDelete: (id: string) => void;
}) {
  const { can } = useDemo();
  const canDelete = can("catalogue.delete");
  const [editing, setEditing] = useState<Partial<T> | null>(null);
  const [error, setError] = useState("");

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <Button
          size="sm"
          onClick={() => setEditing({ name: "", slug: "", sortOrder: rows.length + 1 } as Partial<T>)}
        >
          Add
        </Button>
      </div>
      <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-ink-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">{row.name}</td>
                <td className="px-4 py-3 text-ink-muted">{row.slug}</td>
                <td className="px-4 py-3">{row.sortOrder}</td>
                <td className="px-4 py-3 text-right">
                  <button className="text-accent" onClick={() => setEditing(row)}>
                    Edit
                  </button>
                  {canDelete ? (
                    <button
                      className="ml-3 text-danger"
                      onClick={() => {
                        if (confirm(`Delete ${row.name}?`)) onDelete(row.id);
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
              try {
                onSave(editing as Omit<T, "id" | "archived"> & { id?: string });
                setEditing(null);
              } catch (caught) {
                setError(caught instanceof Error ? caught.message : "Could not save");
              }
            }}
          >
            <h2 className="font-medium">{editing.id ? "Edit" : "Add"} {title.toLowerCase()}</h2>
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
            <Field label="Sort order">
              <Input
                type="number"
                value={editing.sortOrder ?? 1}
                onChange={(event) => setEditing({ ...editing, sortOrder: Number(event.target.value) })}
              />
            </Field>
            {extraFields ? extraFields(editing, setEditing) : null}
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
