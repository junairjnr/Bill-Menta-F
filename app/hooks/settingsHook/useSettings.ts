import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsService } from "../../services/settings/settings.service";
import toast from "react-hot-toast";
import type { CreateRolePayload, UpdateRolePayload } from "../../services/settings/settings.service";

export const useMyPermissions = (enabled = true) =>
  useQuery({
    queryKey: ["my-permissions"],
    queryFn: () => settingsService.getMyPermissions(),
    enabled,
    staleTime: 5 * 60 * 1000,
  });

export const useRolePermissions = () =>
  useQuery({
    queryKey: ["role-permissions"],
    queryFn: () => settingsService.getRolePermissions(),
  });

export const useUpdateRolePermissions = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      role,
      views,
    }: {
      role: string;
      views: Record<string, boolean>;
    }) => settingsService.updateRolePermissions(role, views),
    onSuccess: () => {
      toast.success("Role permissions updated");
      qc.invalidateQueries({ queryKey: ["role-permissions"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update permissions");
    },
  });
};

export const useCompanySettings = () =>
  useQuery({
    queryKey: ["company-settings"],
    queryFn: () => settingsService.getCompany(),
  });

export const useUpdateCompanySettings = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: settingsService.updateCompany,
    onSuccess: () => {
      toast.success("Company updated");
      qc.invalidateQueries({ queryKey: ["company-settings"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update company");
    },
  });
};

export const useRoles = () =>
  useQuery({
    queryKey: ["roles"],
    queryFn: () => settingsService.getRoles(),
  });

export const useRole = (id: string) =>
  useQuery({
    queryKey: ["roles", id],
    queryFn: async () => {
      const data = await settingsService.getRoles();
      const all = [...data.systemRoles, ...data.customRoles];
      const role = all.find((item) => item.id === id || item.slug === id);
      if (!role) {
        throw new Error("Role not found");
      }
      return role;
    },
    enabled: !!id,
  });

export const useCreateRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateRolePayload) => settingsService.createRole(payload),
    onSuccess: () => {
      toast.success("Role created");
      qc.invalidateQueries({ queryKey: ["roles"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to create role");
    },
  });
};

export const useUpdateRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateRolePayload }) =>
      settingsService.updateRole(id, payload),
    onSuccess: () => {
      toast.success("Role updated");
      qc.invalidateQueries({ queryKey: ["roles"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update role");
    },
  });
};

export const useDeleteRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => settingsService.deleteRole(id),
    onSuccess: () => {
      toast.success("Role deleted");
      qc.invalidateQueries({ queryKey: ["roles"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to delete role");
    },
  });
};
