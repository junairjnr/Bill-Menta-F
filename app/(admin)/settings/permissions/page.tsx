"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import PageHeader from "@/app/utilsComponents/PageHeader";
import {
  useRolePermissions,
  useUpdateRolePermissions,
} from "@/app/hooks/settingsHook/useSettings";
import { usePermissions } from "@/app/hooks/usePermissions";
import {
  permissionActionKey,
  type PermissionAction,
} from "@/app/config/permissions";
import { getRoleLabel } from "@/app/config/roles";
import type { PermissionSection } from "@/app/services/settings/settings.service";

const MATRIX_ACTIONS: PermissionAction[] = ["add", "edit", "view", "delete"];

const MATRIX_HEADERS = ["All", "Add", "Edit", "View", "Delete"] as const;

export default function RolePermissionsPage() {
  const { isSuperAdmin } = usePermissions();
  const { data, isLoading } = useRolePermissions();
  const { mutate: savePermissions, isPending } = useUpdateRolePermissions();
  const [activeRole, setActiveRole] = useState<string>("admin");
  const [openSection, setOpenSection] = useState<string>("MAIN");
  const [draft, setDraft] = useState<Record<string, Record<string, boolean>>>({});

  const permissionsByRole = useMemo(() => {
    if (!data) return {};
    return {
      ...data.permissionsByRole,
      ...draft,
    };
  }, [data, draft]);

  const activePermissions = permissionsByRole[activeRole] || {};

  const getActionValue = (resourceKey: string, action: PermissionAction) =>
    Boolean(activePermissions[permissionActionKey(resourceKey, action)]);

  const isRowAllChecked = (resourceKey: string) =>
    MATRIX_ACTIONS.every((action) => getActionValue(resourceKey, action));

  const isRowPartial = (resourceKey: string) => {
    const checked = MATRIX_ACTIONS.filter((action) =>
      getActionValue(resourceKey, action)
    ).length;
    return checked > 0 && checked < MATRIX_ACTIONS.length;
  };

  const updateResourceActions = (
    resourceKey: string,
    nextActions: Record<PermissionAction, boolean>
  ) => {
    setDraft((prev) => {
      const base = data?.permissionsByRole?.[activeRole] || {};
      const currentDraft = prev[activeRole] || {};
      const nextForRole = { ...base, ...currentDraft };

      MATRIX_ACTIONS.forEach((action) => {
        nextForRole[permissionActionKey(resourceKey, action)] = nextActions[action];
      });

      return {
        ...prev,
        [activeRole]: nextForRole,
      };
    });
  };

  const toggleRowAll = (resourceKey: string) => {
    const next = !isRowAllChecked(resourceKey);
    updateResourceActions(resourceKey, {
      add: next,
      edit: next,
      view: next,
      delete: next,
    });
  };

  const toggleAction = (resourceKey: string, action: PermissionAction) => {
    updateResourceActions(resourceKey, {
      add: getActionValue(resourceKey, "add"),
      edit: getActionValue(resourceKey, "edit"),
      view: getActionValue(resourceKey, "view"),
      delete: getActionValue(resourceKey, "delete"),
      [action]: !getActionValue(resourceKey, action),
    });
  };

  const handleSave = () => {
    const views = permissionsByRole[activeRole];
    if (!views) return;
    savePermissions(
      { role: activeRole, views },
      {
        onSuccess: () => {
          setDraft((prev) => {
            const next = { ...prev };
            delete next[activeRole];
            return next;
          });
        },
      }
    );
  };

  const hasUnsavedChanges = Boolean(draft[activeRole]);

  const sections: PermissionSection[] = useMemo(() => {
    if (!data?.sections?.length) {
      if (!data?.permissions?.length) return [];

      const grouped = data.permissions.reduce<
        Record<string, PermissionSection["resources"]>
      >((acc, item) => {
        acc[item.group] = acc[item.group] || [];
        acc[item.group].push({ key: item.key, label: item.label });
        return acc;
      }, {});

      return Object.entries(grouped).map(([title, resources]) => ({ title, resources }));
    }

    return data.sections;
  }, [data]);

  if (!isSuperAdmin) {
    return (
      <div className="p-6 text-sm text-gray-500">
        Only super admin can manage role permissions.
      </div>
    );
  }

  if (isLoading || !data) {
    return <div className="p-6 text-sm text-gray-500">Loading permissions...</div>;
  }

  const toggleSection = (title: string) => {
    setOpenSection(title);
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Role Permissions"
        description="Choose a role and set add, edit, view, and delete access for each module"
      />

      <div className="flex flex-wrap gap-2">
        {data.roles.map((role) => (
          <button
            key={role}
            type="button"
            onClick={() => setActiveRole(role)}
            className={`rounded-md px-4 py-2 text-sm capitalize ${
              activeRole === role
                ? "bg-emerald-700 text-white"
                : "border bg-white text-gray-700"
            }`}
          >
            {getRoleLabel(role, data.roleMeta?.[role]?.label)}
            {draft[role] ? " •" : ""}
          </button>
        ))}
      </div>

      <div className="rounded-lg border bg-white">
        {sections.map((section) => {
          const isOpen = openSection === section.title;

          return (
            <div key={section.title} className="border-b last:border-b-0">
              <button
                type="button"
                onClick={() => toggleSection(section.title)}
                className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
              >
                <span className="text-sm font-semibold tracking-wide text-gray-800">
                  {section.title}
                </span>
                <ChevronDown
                  size={18}
                  className={`text-gray-500 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="overflow-x-auto border-t bg-gray-50/40 px-4 py-4">
                  <table className="min-w-full border-separate border-spacing-0 text-sm">
                    <thead>
                      <tr>
                        <th className="sticky left-0 z-10 bg-gray-50/95 px-3 py-2 text-left font-semibold text-gray-700">
                          Resource
                        </th>
                        {MATRIX_HEADERS.map((header) => (
                          <th
                            key={header}
                            className="px-3 py-2 text-center font-semibold text-gray-700"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.resources.map((resource) => (
                        <tr key={resource.key} className="border-t border-gray-200">
                          <td className="sticky left-0 z-10 bg-white px-3 py-2 font-medium text-gray-800">
                            {resource.label}
                          </td>
                          <td className="px-3 py-2 text-center">
                            <input
                              type="checkbox"
                              checked={isRowAllChecked(resource.key)}
                              ref={(el) => {
                                if (el) el.indeterminate = isRowPartial(resource.key);
                              }}
                              onChange={() => toggleRowAll(resource.key)}
                              className="h-4 w-4 rounded border-gray-300 text-emerald-700 focus:ring-emerald-600"
                            />
                          </td>
                          {MATRIX_ACTIONS.map((action) => (
                            <td key={action} className="px-3 py-2 text-center">
                              <input
                                type="checkbox"
                                checked={getActionValue(resource.key, action)}
                                onChange={() => toggleAction(resource.key, action)}
                                className="h-4 w-4 rounded border-gray-300 text-emerald-700 focus:ring-emerald-600"
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}

        <div className="flex items-center justify-between gap-3 px-4 py-4">
          <p className="text-xs text-gray-500">
            {hasUnsavedChanges
              ? "You have unsaved changes for this role."
              : "Open one section at a time. Changes are kept when switching sections or roles."}
          </p>
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending || !hasUnsavedChanges}
            className="rounded-md bg-emerald-700 px-4 py-2 text-sm text-white disabled:opacity-60"
          >
            {isPending ? "Saving..." : `Save ${activeRole} Permissions`}
          </button>
        </div>
      </div>
    </div>
  );
}
