import axiosInstance from "../../api/axios";
import { ApiResponse } from "../../types";
import { UserPermissions } from "../../config/permissions";

export interface PermissionCatalogItem {
  key: string;
  label: string;
  group: string;
}

export interface PermissionSection {
  title: string;
  resources: { key: string; label: string }[];
}

export type PermissionAction = "view" | "add" | "edit" | "delete";

export interface RolePermissionsResponse {
  roles: string[];
  roleMeta?: Record<string, { label: string; description: string }>;
  actions: PermissionAction[];
  sections: PermissionSection[];
  permissions: PermissionCatalogItem[];
  permissionsByRole: Record<string, Record<string, boolean>>;
}

export interface RoleListItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  isSystem: boolean;
  basedOn?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface RolesResponse {
  systemRoles: RoleListItem[];
  customRoles: RoleListItem[];
}

export interface CreateRolePayload {
  name: string;
  description?: string;
  basedOn?: string;
}

export interface UpdateRolePayload {
  name?: string;
  description?: string;
}

export interface CompanySettings {
  _id: string;
  name: string;
  code?: string;
  email: string;
  phone?: string;
  address?: string;
  gstin?: string;
  terms?: string;
  logo?: string;
  plan?: "free" | "pro" | "enterprise";
  defaultSalesType?: "retail" | "wholesale";
  isActive?: boolean;
}

export const settingsService = {
  getMyPermissions: async (): Promise<UserPermissions> => {
    const res = await axiosInstance.get<ApiResponse<UserPermissions>>(
      "/settings/my-permissions"
    );
    return res.data.data;
  },

  getRolePermissions: async (): Promise<RolePermissionsResponse> => {
    const res = await axiosInstance.get<ApiResponse<RolePermissionsResponse>>(
      "/settings/permissions"
    );
    return res.data.data;
  },

  updateRolePermissions: async (
    role: string,
    views: Record<string, boolean>
  ) => {
    const res = await axiosInstance.put<ApiResponse<{ role: string; views: Record<string, boolean> }>>(
      `/settings/permissions/${role}`,
      { views }
    );
    return res.data.data;
  },

  getCompany: async (): Promise<CompanySettings> => {
    const res = await axiosInstance.get<ApiResponse<CompanySettings>>(
      "/settings/company"
    );
    return res.data.data;
  },

  updateCompany: async (payload: Partial<CompanySettings>) => {
    const res = await axiosInstance.put<ApiResponse<CompanySettings>>(
      "/settings/company",
      payload
    );
    return res.data.data;
  },

  getRoles: async (): Promise<RolesResponse> => {
    const res = await axiosInstance.get<ApiResponse<RolesResponse>>("/settings/roles");
    return res.data.data;
  },

  createRole: async (payload: CreateRolePayload) => {
    const res = await axiosInstance.post<ApiResponse<RoleListItem>>(
      "/settings/roles",
      payload
    );
    return res.data.data;
  },

  updateRole: async (id: string, payload: UpdateRolePayload) => {
    const res = await axiosInstance.put<ApiResponse<RoleListItem>>(
      `/settings/roles/${id}`,
      payload
    );
    return res.data.data;
  },

  deleteRole: async (id: string) => {
    await axiosInstance.delete(`/settings/roles/${id}`);
  },
};
