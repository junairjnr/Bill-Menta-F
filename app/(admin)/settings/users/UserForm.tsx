"use client";

import { useEffect, useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import PageHeader from "@/app/utilsComponents/PageHeader";
import { USER_FORM_ID } from "@/app/utilsComponents/form-footer";
import FormText from "@/app/formComponents/FormText";
import FormSelect from "@/app/formComponents/FormSelect";
import FormCheckbox from "@/app/formComponents/FormCheckBox";
import { useBranches } from "@/app/hooks/branchHook/useBranch";
import { useRoles } from "@/app/hooks/settingsHook/useSettings";
import {
  useCreateUser,
  useUpdateUser,
} from "@/app/hooks/userHook/useUser";
import { usePermissions } from "@/app/hooks/usePermissions";
import {
  ASSIGNABLE_SYSTEM_ROLES,
  PRIVILEGED_ROLES,
  SYSTEM_ROLE_META,
} from "@/app/config/roles";

interface UserFormValues {
  name: string;
  email: string;
  password: string;
  role: string;
  branchId: string;
  isActive: boolean;
}

interface UserFormProps {
  initialValues?: UserFormValues;
  editId?: string;
  isEdit?: boolean;
  onPendingChange?: (pending: boolean) => void;
}

const defaultValues: UserFormValues = {
  name: "",
  email: "",
  password: "",
  role: "viewer",
  branchId: "",
  isActive: true,
};

export default function UserForm({
  initialValues,
  editId,
  isEdit = false,
  onPendingChange,
}: UserFormProps) {
  const router = useRouter();
  const { isSuperAdmin } = usePermissions();
  const { data: rolesData } = useRoles();
  const { data: branchesData } = useBranches({ isActive: true });
  const { mutate: create, isPending: creating } = useCreateUser();
  const { mutate: update, isPending: updating } = useUpdateUser();
  const isPending = creating || updating;

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

  useEffect(() => {
    onPendingChange?.(isPending);
  }, [isPending, onPendingChange]);

  const formik = useFormik<UserFormValues>({
    initialValues: initialValues || {
      ...defaultValues,
      branchId: branches[0]?._id || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: isEdit
        ? Yup.string()
        : Yup.string().required("Password is required"),
      role: Yup.string().required("Role is required"),
      branchId: Yup.string().required("Branch is required"),
    }),
    enableReinitialize: true,
    onSubmit: (values) => {
      const onDone = () => router.back();

      if (isEdit && editId) {
        const payload: Record<string, unknown> = {
          name: values.name.trim(),
          role: values.role,
          branchId: values.branchId,
          isActive: values.isActive,
        };
        if (values.password.trim()) payload.password = values.password;
        update({ id: editId, payload }, { onSuccess: onDone });
        return;
      }

      create(
        {
          name: values.name.trim(),
          email: values.email.trim(),
          password: values.password,
          role: values.role,
          branchId: values.branchId,
        },
        { onSuccess: onDone }
      );
    },
  });

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue } =
    formik;

  return (
    <div className="w-full mx-auto p-5">
      <PageHeader
        title={isEdit ? "Edit User" : "Add User"}
        description="Assign role and branch access for a team member"
      />

      <form
        id={USER_FORM_ID}
        onSubmit={handleSubmit}
        className="bg-white px-2 py-4 space-y-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
          <FormText
            label="Name"
            name="name"
            value={values.name}
            required
            onChange={handleChange}
            onBlur={handleBlur}
            touched={touched.name}
            error={errors.name}
          />

          <FormText
            label="Email"
            name="email"
            type="email"
            value={values.email}
            required
            disabled={isEdit}
            onChange={handleChange}
            onBlur={handleBlur}
            touched={touched.email}
            error={errors.email}
          />

          <FormText
            label={isEdit ? "New Password (optional)" : "Password"}
            name="password"
            type="password"
            value={values.password}
            required={!isEdit}
            onChange={handleChange}
            onBlur={handleBlur}
            touched={touched.password}
            error={errors.password}
          />

          <FormSelect
            label="Role"
            name="role"
            value={values.role}
            required
            options={roleOptions}
            onChange={handleChange}
            onBlur={handleBlur}
            touched={touched.role}
            error={errors.role}
          />

          <FormSelect
            label="Branch"
            name="branchId"
            value={values.branchId}
            required
            placeholder="Select branch"
            options={branches.map((branch) => ({
              value: branch._id,
              label: branch.name,
            }))}
            onChange={handleChange}
            onBlur={handleBlur}
            touched={touched.branchId}
            error={errors.branchId}
          />

          {isEdit && (
            <FormCheckbox
              label="Active account"
              name="isActive"
              checked={values.isActive}
              onChange={(e) => setFieldValue("isActive", e.target.checked)}
            />
          )}
        </div>
      </form>
    </div>
  );
}
