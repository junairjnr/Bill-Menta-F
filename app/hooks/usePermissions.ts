"use client";

import { useAuthStore } from "../store/auth/auth.store";
import {
  canViewPermission,
  canActionPermission,
  getPermissionForPath,
  UserPermissions,
  ViewPermissionKey,
  PermissionAction,
} from "../config/permissions";
import { useMyPermissions } from "../hooks/settingsHook/useSettings";
import { useEffect } from "react";

export const usePermissions = () => {
  const user = useAuthStore((s) => s.user);
  const setPermissions = useAuthStore((s) => s.setPermissions);
  const storedPermissions = useAuthStore((s) => s.permissions);

  const shouldFetch = !!user && !storedPermissions;
  const { data: fetchedPermissions, isLoading } = useMyPermissions(shouldFetch);

  useEffect(() => {
    if (fetchedPermissions) setPermissions(fetchedPermissions);
  }, [fetchedPermissions, setPermissions]);

  const permissions: UserPermissions | null =
    storedPermissions || user?.permissions || fetchedPermissions || null;

  const canView = (key: ViewPermissionKey | string) =>
    canViewPermission(permissions, key);

  const canAction = (key: ViewPermissionKey | string, action: PermissionAction) =>
    canActionPermission(permissions, key, action);

  const canViewPath = (pathname: string) => {
    const key = getPermissionForPath(pathname);
    if (!key) return true;
    return canView(key);
  };

  const isSuperAdmin =
    permissions?.isSuperAdmin || permissions?.role === "super_admin";

  return {
    permissions,
    isLoading,
    canView,
    canAction,
    canViewPath,
    isSuperAdmin,
    role: permissions?.role ?? user?.role,
  };
};
