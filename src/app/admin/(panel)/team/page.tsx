"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Field, Input, Select } from "@/components/ui/field";
import { TableSortSelect } from "@/components/admin/table-sort-select";
import { cmpString, sortRows } from "@/lib/admin-table-sort";
import { RequireCapability } from "@/components/admin/guard";
import { useDemo } from "@/lib/demo-store";
import type { AdminMember } from "@/types/catalog";

export default function TeamPage() {
  return (
    <RequireCapability capability="team.view">
      <TeamManager />
    </RequireCapability>
  );
}

function TeamManager() {
  const { state, saveMember, deleteMember, can } = useDemo();
  const canManage = can("team.manage");
  const [editing, setEditing] = useState<Partial<AdminMember> | null>(null);
  const [error, setError] = useState("");
  const [sort, setSort] = useState("name-asc");
  const sortOptions = [
    { value: "name-asc", label: "Name (A–Z)" },
    { value: "role-asc", label: "Role (A–Z)" },
    { value: "status-active", label: "Active first" },
  ];
  const members = useMemo(
    () =>
      sortRows(state.members, sort, {
        "name-asc": (a, b) => cmpString(a.name, b.name),
        "role-asc": (a, b) =>
          cmpString(
            state.roles.find((role) => role.id === a.roleId)?.name ?? "",
            state.roles.find((role) => role.id === b.roleId)?.name ?? "",
          ),
        "status-active": (a, b) => cmpString(b.status, a.status),
      }),
    [state.members, state.roles, sort],
  );

  function persist() {
    setError("");
    try {
      saveMember({
        id: editing?.id,
        name: editing?.name ?? "",
        email: editing?.email ?? "",
        roleId: editing?.roleId ?? state.roles[0]?.id ?? "",
        status: editing?.status ?? "active",
        createdAt: editing?.createdAt,
      });
      setEditing(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not save member.");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Team</h1>
          <p className="mt-1 text-sm text-ink-muted">Add staff, managers, and other members, then assign a role.</p>
        </div>
        {canManage ? (
          <Button size="sm" onClick={() => setEditing({ name: "", email: "", roleId: state.roles.find((role) => role.slug === "staff")?.id ?? state.roles[0]?.id, status: "active" })}>
            Add member
          </Button>
        ) : null}
      </div>
      <div className="mt-4 flex justify-end">
        <TableSortSelect options={sortOptions} value={sort} onChange={setSort} />
      </div>
      <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-ink-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => {
              const role = state.roles.find((row) => row.id === member.roleId);
              return (
                <tr key={member.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium">{member.name}</td>
                  <td className="px-4 py-3">{member.email}</td>
                  <td className="px-4 py-3">{role?.name ?? "—"}</td>
                  <td className="px-4 py-3">
                    <Badge tone={member.status === "active" ? "success" : "neutral"}>{member.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {canManage ? (
                      <>
                        <button className="text-accent" onClick={() => setEditing(member)}>
                          Edit
                        </button>
                        <button
                          className="ml-3 text-danger"
                          onClick={() => {
                            if (!confirm(`Remove ${member.name} from the team?`)) return;
                            try {
                              deleteMember(member.id);
                            } catch (caught) {
                              setError(caught instanceof Error ? caught.message : "Could not delete.");
                            }
                          }}
                        >
                          Delete
                        </button>
                      </>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}
      <p className="mt-4 text-xs text-ink-muted">Demo sign-in uses these emails. Password is still admin123.</p>
      {editing ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse/50 p-4">
          <div className="w-full max-w-md rounded-lg border border-border bg-surface p-5">
            <h2 className="text-lg font-semibold">{editing.id ? "Edit member" : "Add member"}</h2>
            <div className="mt-4 space-y-3">
              <Field label="Name">
                <Input value={editing.name ?? ""} onChange={(event) => setEditing({ ...editing, name: event.target.value })} />
              </Field>
              <Field label="Email">
                <Input type="email" value={editing.email ?? ""} onChange={(event) => setEditing({ ...editing, email: event.target.value })} />
              </Field>
              <Field label="Role">
                <Select value={editing.roleId ?? ""} onChange={(event) => setEditing({ ...editing, roleId: event.target.value })}>
                  {state.roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Status">
                <Select
                  value={editing.status ?? "active"}
                  onChange={(event) => setEditing({ ...editing, status: event.target.value as AdminMember["status"] })}
                >
                  <option value="active">Active</option>
                  <option value="disabled">Disabled</option>
                </Select>
              </Field>
            </div>
            <div className="mt-5 flex gap-2">
              <Button onClick={persist}>Save</Button>
              <Button variant="secondary" onClick={() => setEditing(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
