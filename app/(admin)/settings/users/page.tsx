"use client";

import { useMemo, useState } from "react";
import { Pencil, UserPlus, UserX } from "lucide-react";
import PageHeader from "@/app/utilsComponents/PageHeader";
import { usePermissions } from "@/app/hooks/usePermissions";
import { useBranches } from "@/app/hooks/branchHook/useBranch";
import { useRoles } from "@/app/hooks/settingsHook/useSettings";
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeactivateUser,
} from "@/app/hooks/userHook/useUser";
import {
  ASSIGNABLE_SYSTEM_ROLES,
  getRoleLabel,
  PRIVILEGED_ROLES,
  SYSTEM_ROLE_META,
} from "@/app/config/roles";
import type { User } from "@/app/types";

type FormMode = "create" | "edit" | null;

interface UserFormState {
  name: string;
  email: string;
  password: string;
  role: string;
  branchId: string;
  isActive: boolean;
}

const emptyForm = (): UserFormState => ({
  name: "",
  email: "",
  password: "",
  role: "viewer",
  branchId: "",
  isActive: true,
});

export default function UsersSettingsPage() {
  const { isSuperAdmin, canAction } = usePermissions();
  const { data: users = [], isLoading } = useUsers();
  const { data: rolesData } = useRoles();
  const { data: branchesData } = useBranches({ isActive: true });
  const { mutate: createUser, isPending: creating } = useCreateUser();
  const { mutate: updateUser, isPending: updating } = useUpdateUser();
  const { mutate: deactivateUser, isPending: deactivating } = useDeactivateUser();

  const [mode, setMode] = useState<FormMode>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [form, setForm] = useState<UserFormState>(emptyForm());

  const branches = branchesData?.data ?? [];

  const roleOptions = useMemo(() => {
    const system = ASSIGNABLE_SYSTEM_ROLES.filter((role) => {
      if (PRIVILEGED_ROLES.includes(role) && !isSuperAdmin) return false;
      return true;
    }).map((role) => ({
      value: role,
      label: SYSTEM_ROLE_META[role]?.label || role,
    }));

    const custom =
      rolesData?.customRoles.map((role) => ({
        value: role.slug,
        label: role.name,
      })) ?? [];

    return [...system, ...custom];
  }, [isSuperAdmin, rolesData]);

  const canManage =
    isSuperAdmin || canAction("settings.users", "view");

  const canAdd = isSuperAdmin || canAction("settings.users", "add");
  const canEdit = isSuperAdmin || canAction("settings.users", "edit");
  const canDelete = isSuperAdmin || canAction("settings.users", "delete");

  const openCreate = () => {
    setMode("create");
    setSelectedUser(null);
    setForm({
      ...emptyForm(),
      branchId: branches[0]?._id || "",
    });
  };

  const openEdit = (user: User) => {
    if (user.role === "super_admin") return;
    setMode("edit");
    setSelectedUser(user);
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      branchId:
        typeof user.branchId === "string"
          ? user.branchId
          : user.branchId?._id || "",
      isActive: user.isActive,
    });
  };

  const closeForm = () => {
    setMode(null);
    setSelectedUser(null);
    setForm(emptyForm());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "create") {
      createUser(
        {
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          role: form.role,
          branchId: form.branchId,
        },
        { onSuccess: closeForm }
      );
      return;
    }

    if (!selectedUser) return;

    const payload: Record<string, unknown> = {
      name: form.name.trim(),
      role: form.role,
      branchId: form.branchId,
      isActive: form.isActive,
    };

    if (form.password.trim()) payload.password = form.password;

    updateUser(
      { id: selectedUser._id, payload },
      { onSuccess: closeForm }
    );
  };

  if (!canManage) {
    return (
      <div className="p-6 text-sm text-gray-500">
        You do not have permission to manage users.
      </div>
    );
  }

  if (isLoading) {
    return <div className="p-6 text-sm text-gray-500">Loading users...</div>;
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Users"
        description="Add and manage team members with the right role and branch access"
        actionLabel={canAdd ? "Add User" : undefined}
        onAction={canAdd ? openCreate : undefined}
        btnClassName="inline-flex items-center gap-2 rounded-md bg-emerald-700 px-4 py-2 text-sm text-white hover:bg-emerald-800"
      />

      <div className="overflow-hidden rounded-lg border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-700">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Role</th>
              <th className="px-4 py-3 font-semibold">Branch</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length ? (
              users.map((user) => {
                const branchName =
                  typeof user.branchId === "object" && user.branchId
                    ? user.branchId.name
                    : "—";

                return (
                  <tr key={user._id} className="border-t">
                    <td className="px-4 py-3 font-medium text-gray-900">{user.name}</td>
                    <td className="px-4 py-3 text-gray-600">{user.email}</td>
                    <td className="px-4 py-3 capitalize text-gray-700">
                      {getRoleLabel(user.role)}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{branchName}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          user.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        {canEdit && user.role !== "super_admin" && (
                          <button
                            type="button"
                            onClick={() => openEdit(user)}
                            className="rounded-md border p-2 hover:bg-gray-50"
                            title="Edit user"
                          >
                            <Pencil size={14} />
                          </button>
                        )}
                        {canDelete && user.role !== "super_admin" && user.isActive && (
                          <button
                            type="button"
                            onClick={() => deactivateUser(user._id)}
                            disabled={deactivating}
                            className="rounded-md border p-2 text-red-600 hover:bg-red-50"
                            title="Deactivate user"
                          >
                            <UserX size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-gray-400">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {mode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center gap-2">
              {mode === "create" ? <UserPlus size={18} /> : <Pencil size={18} />}
              <h2 className="text-lg font-semibold">
                {mode === "create" ? "Add User" : "Edit User"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-md border px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Email</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  disabled={mode === "edit"}
                  className="w-full rounded-md border px-3 py-2 text-sm disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  {mode === "create" ? "Password" : "New Password (optional)"}
                </label>
                <input
                  type="password"
                  required={mode === "create"}
                  value={form.password}
                  onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                  className="w-full rounded-md border px-3 py-2 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Role</label>
                  <select
                    required
                    value={form.role}
                    onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
                    className="w-full rounded-md border px-3 py-2 text-sm"
                  >
                    {roleOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Branch</label>
                  <select
                    required
                    value={form.branchId}
                    onChange={(e) => setForm((prev) => ({ ...prev, branchId: e.target.value }))}
                    className="w-full rounded-md border px-3 py-2 text-sm"
                  >
                    <option value="">Select branch</option>
                    {branches.map((branch) => (
                      <option key={branch._id} value={branch._id}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {mode === "edit" && (
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, isActive: e.target.checked }))
                    }
                  />
                  Active account
                </label>
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
                  {creating || updating
                    ? "Saving..."
                    : mode === "create"
                      ? "Create User"
                      : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
