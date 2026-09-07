"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Shield, Trash2, Pencil } from "lucide-react";
import PageHeader from "@/app/utilsComponents/PageHeader";
import { usePermissions } from "@/app/hooks/usePermissions";
import {
  useRoles,
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
} from "@/app/hooks/settingsHook/useSettings";
import {
  ASSIGNABLE_SYSTEM_ROLES,
  SYSTEM_ROLE_META,
} from "@/app/config/roles";
import type { RoleListItem } from "@/app/services/settings/settings.service";

type FormMode = "create" | "edit" | null;

export default function RolesSettingsPage() {
  const { isSuperAdmin, canAction } = usePermissions();
  const { data, isLoading } = useRoles();
  const { mutate: createRole, isPending: creating } = useCreateRole();
  const { mutate: updateRole, isPending: updating } = useUpdateRole();
  const { mutate: deleteRole, isPending: deleting } = useDeleteRole();

  const [mode, setMode] = useState<FormMode>(null);
  const [selectedRole, setSelectedRole] = useState<RoleListItem | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [basedOn, setBasedOn] = useState("viewer");

  const canManage = isSuperAdmin || canAction("settings.roles", "view");
  const canAdd = isSuperAdmin || canAction("settings.roles", "add");
  const canEdit = isSuperAdmin || canAction("settings.roles", "edit");
  const canDelete = isSuperAdmin || canAction("settings.roles", "delete");

  const systemRoles = useMemo(() => {
    if (data?.systemRoles?.length) return data.systemRoles;
    return ASSIGNABLE_SYSTEM_ROLES.map((role) => ({
      id: role,
      slug: role,
      name: SYSTEM_ROLE_META[role]?.label || role,
      description: SYSTEM_ROLE_META[role]?.description || "",
      isSystem: true,
      basedOn: null,
    }));
  }, [data]);

  const openCreate = () => {
    setMode("create");
    setSelectedRole(null);
    setName("");
    setDescription("");
    setBasedOn("viewer");
  };

  const openEdit = (role: RoleListItem) => {
    setMode("edit");
    setSelectedRole(role);
    setName(role.name);
    setDescription(role.description);
  };

  const closeForm = () => {
    setMode(null);
    setSelectedRole(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "create") {
      createRole(
        { name: name.trim(), description: description.trim(), basedOn },
        { onSuccess: closeForm }
      );
      return;
    }
    if (!selectedRole) return;
    updateRole(
      {
        id: selectedRole.id,
        payload: { name: name.trim(), description: description.trim() },
      },
      { onSuccess: closeForm }
    );
  };

  if (!canManage) {
    return (
      <div className="p-6 text-sm text-gray-500">
        You do not have permission to manage roles.
      </div>
    );
  }

  if (isLoading) {
    return <div className="p-6 text-sm text-gray-500">Loading roles...</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles"
        description="Built-in business roles plus custom roles you can create for your team"
        actionLabel={canAdd ? "Create Role" : undefined}
        onAction={canAdd ? openCreate : undefined}
        btnClassName="inline-flex items-center gap-2 rounded-md bg-emerald-700 px-4 py-2 text-sm text-white hover:bg-emerald-800"
      />

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
          Built-in Roles
        </h2>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {systemRoles.map((role) => (
            <div key={role.slug} className="rounded-lg border bg-white p-4">
              <div className="mb-2 flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{role.name}</h3>
                  <p className="text-xs text-gray-500">{role.slug}</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">
                  System
                </span>
              </div>
              <p className="text-sm text-gray-600">{role.description}</p>
              {isSuperAdmin && (
                <Link
                  href="/settings/permissions"
                  className="mt-3 inline-flex items-center gap-1 text-sm text-emerald-700 hover:underline"
                >
                  <Shield size={14} />
                  Edit permissions
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
          Custom Roles
        </h2>
        <div className="overflow-hidden rounded-lg border bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-700">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Slug</th>
                <th className="px-4 py-3 font-semibold">Based On</th>
                <th className="px-4 py-3 font-semibold">Description</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.customRoles?.length ? (
                data.customRoles.map((role) => (
                  <tr key={role.id} className="border-t">
                    <td className="px-4 py-3 font-medium">{role.name}</td>
                    <td className="px-4 py-3 text-gray-500">{role.slug}</td>
                    <td className="px-4 py-3 capitalize text-gray-600">
                      {role.basedOn?.replace(/_/g, " ") || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{role.description || "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        {canEdit && (
                          <button
                            type="button"
                            onClick={() => openEdit(role)}
                            className="rounded-md border p-2 hover:bg-gray-50"
                          >
                            <Pencil size={14} />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            type="button"
                            onClick={() => deleteRole(role.id)}
                            disabled={deleting}
                            className="rounded-md border p-2 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-gray-400">
                    No custom roles yet. Create one to match your team structure.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {mode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center gap-2">
              {mode === "create" ? <Plus size={18} /> : <Pencil size={18} />}
              <h2 className="text-lg font-semibold">
                {mode === "create" ? "Create Custom Role" : "Edit Custom Role"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Role Name</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  placeholder="e.g. Regional Sales Lead"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-md border px-3 py-2 text-sm"
                />
              </div>

              {mode === "create" && (
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Copy permissions from
                  </label>
                  <select
                    value={basedOn}
                    onChange={(e) => setBasedOn(e.target.value)}
                    className="w-full rounded-md border px-3 py-2 text-sm"
                  >
                    {ASSIGNABLE_SYSTEM_ROLES.map((role) => (
                      <option key={role} value={role}>
                        {SYSTEM_ROLE_META[role]?.label || role}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-md border px-4 py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || updating}
                  className="rounded-md bg-emerald-700 px-4 py-2 text-sm text-white disabled:opacity-60"
                >
                  {creating || updating ? "Saving..." : "Save Role"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
