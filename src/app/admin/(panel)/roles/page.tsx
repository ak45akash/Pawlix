"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { RequireCapability } from "@/components/admin/guard";
import { CAPABILITY_GROUPS } from "@/lib/permissions/catalogue.ts";
import { slugify } from "@/lib/slug";
import { useDemo } from "@/lib/demo-store";
import type { AdminRoleRecord } from "@/types/catalog";

export default function RolesPage() {
  return (
    <RequireCapability capability="roles.manage">
      <RolesManager />
    </RequireCapability>
  );
}

function RolesManager() {
  const { state, saveRole, deleteRole } = useDemo();
  const [selectedId, setSelectedId] = useState(state.roles[0]?.id ?? "");
  const selected = state.roles.find((role) => role.id === selectedId) ?? state.roles[0];
  const [draft, setDraft] = useState<AdminRoleRecord | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const editing = draft ?? selected;

  const assigned = useMemo(
    () => state.members.filter((member) => member.roleId === editing?.id).length,
    [state.members, editing?.id],
  );

  function startNew() {
    setError("");
    setNotice("");
    const next: AdminRoleRecord = {
      id: "",
      name: "",
      slug: "",
      description: "",
      capabilities: ["content.edit"],
      system: false,
    };
    setDraft(next);
    setSelectedId("");
  }

  function toggleCap(id: string) {
    if (!editing || editing.system) return;
    const capabilities = editing.capabilities.includes(id)
      ? editing.capabilities.filter((item) => item !== id)
      : [...editing.capabilities, id];
    setDraft({ ...editing, id: editing.id, capabilities });
  }

  function persist() {
    if (!editing) return;
    setError("");
    setNotice("");
    try {
      saveRole({
        id: editing.id || undefined,
        name: editing.name,
        slug: editing.slug || slugify(editing.name),
        description: editing.description,
        capabilities: editing.capabilities,
      });
      setDraft(null);
      setNotice("Role saved.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not save role.");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Roles and rights</h1>
          <p className="mt-1 text-sm text-ink-muted">Create roles such as Manager or Editor, then tick what they can do.</p>
        </div>
        <Button size="sm" onClick={startNew}>
          Add role
        </Button>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <div className="rounded-lg border border-border bg-surface">
          {state.roles.map((role) => (
            <button
              key={role.id}
              type="button"
              onClick={() => {
                setSelectedId(role.id);
                setDraft(null);
                setError("");
                setNotice("");
              }}
              className={`block w-full border-b border-border px-4 py-3 text-left text-sm last:border-0 ${
                selectedId === role.id && !draft ? "bg-canvas" : ""
              }`}
            >
              <span className="font-medium">{role.name}</span>
              <span className="mt-0.5 block text-xs text-ink-muted">{role.capabilities.length} rights</span>
            </button>
          ))}
          {draft && !draft.id ? (
            <div className="bg-accent-soft px-4 py-3 text-sm font-medium text-accent">New role</div>
          ) : null}
        </div>
        {editing ? (
          <div className="rounded-lg border border-border bg-surface p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name">
                <Input
                  value={editing.name}
                  onChange={(event) =>
                    setDraft({
                      ...editing,
                      name: event.target.value,
                      slug: editing.id ? editing.slug : slugify(event.target.value),
                    })
                  }
                />
              </Field>
              <Field label="Slug">
                <Input
                  value={editing.slug}
                  disabled={editing.system}
                  onChange={(event) => setDraft({ ...editing, slug: slugify(event.target.value) })}
                />
              </Field>
            </div>
            <div className="mt-4">
              <Field label="Description">
                <Textarea
                  value={editing.description}
                  onChange={(event) => setDraft({ ...editing, description: event.target.value })}
                />
              </Field>
            </div>
            {editing.system ? (
              <p className="mt-4 text-sm text-ink-muted">Admin rights are locked. You can still rename the description for your team.</p>
            ) : (
              <p className="mt-4 text-sm text-ink-muted">{assigned} member{assigned === 1 ? "" : "s"} assigned to this role.</p>
            )}
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {CAPABILITY_GROUPS.map((group) => (
                <fieldset key={group.id} className="space-y-2">
                  <legend className="text-sm font-medium">{group.label}</legend>
                  {group.items.map((item) => (
                    <label key={item.id} className="flex items-start gap-2 text-sm">
                      <input
                        type="checkbox"
                        className="mt-1"
                        checked={editing.capabilities.includes(item.id)}
                        disabled={editing.system}
                        onChange={() => toggleCap(item.id)}
                      />
                      <span>
                        {item.label}
                        <span className="mt-0.5 block font-mono text-[11px] text-ink-muted">{item.id}</span>
                      </span>
                    </label>
                  ))}
                </fieldset>
              ))}
            </div>
            {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
            {notice ? <p className="mt-4 text-sm text-success">{notice}</p> : null}
            <div className="mt-6 flex flex-wrap gap-2">
              <Button onClick={persist}>Save role</Button>
              {!editing.system && editing.id ? (
                <Button
                  variant="danger"
                  onClick={() => {
                    if (!confirm(`Delete the ${editing.name} role?`)) return;
                    try {
                      deleteRole(editing.id);
                      setDraft(null);
                      setSelectedId(state.roles.find((role) => role.id !== editing.id)?.id ?? "");
                    } catch (caught) {
                      setError(caught instanceof Error ? caught.message : "Could not delete.");
                    }
                  }}
                >
                  Delete role
                </Button>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
