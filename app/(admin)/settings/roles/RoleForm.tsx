"use client";

import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import PageHeader from "@/app/utilsComponents/PageHeader";
import { ROLE_FORM_ID } from "@/app/utilsComponents/form-footer";
import FormText from "@/app/formComponents/FormText";
import FormSelect from "@/app/formComponents/FormSelect";
import FormTextArea from "@/app/formComponents/FormTextArea";
import {
  useCreateRole,
  useUpdateRole,
} from "@/app/hooks/settingsHook/useSettings";
import {
  ASSIGNABLE_SYSTEM_ROLES,
  SYSTEM_ROLE_META,
} from "@/app/config/roles";

interface RoleFormValues {
  name: string;
  description: string;
  basedOn: string;
}

interface RoleFormProps {
  initialValues?: RoleFormValues;
  editId?: string;
  isEdit?: boolean;
  onPendingChange?: (pending: boolean) => void;
}

const defaultValues: RoleFormValues = {
  name: "",
  description: "",
  basedOn: "viewer",
};

export default function RoleForm({
  initialValues,
  editId,
  isEdit = false,
  onPendingChange,
}: RoleFormProps) {
  const router = useRouter();
  const { mutate: create, isPending: creating } = useCreateRole();
  const { mutate: update, isPending: updating } = useUpdateRole();
  const isPending = creating || updating;

  useEffect(() => {
    onPendingChange?.(isPending);
  }, [isPending, onPendingChange]);

  const formik = useFormik<RoleFormValues>({
    initialValues: initialValues || defaultValues,
    validationSchema: Yup.object({
      name: Yup.string().required("Role name is required"),
    }),
    enableReinitialize: true,
    onSubmit: (values) => {
      const onDone = () => router.back();

      if (isEdit && editId) {
        update(
          {
            id: editId,
            payload: {
              name: values.name.trim(),
              description: values.description.trim(),
            },
          },
          { onSuccess: onDone }
        );
        return;
      }

      create(
        {
          name: values.name.trim(),
          description: values.description.trim(),
          basedOn: values.basedOn,
        },
        { onSuccess: onDone }
      );
    },
  });

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = formik;

  return (
    <div className="w-full mx-auto p-5">
      <PageHeader
        title={isEdit ? "Edit Custom Role" : "Add Custom Role"}
        description="Create a role tailored to your team and copy permissions from a built-in role"
      />

      <form
        id={ROLE_FORM_ID}
        onSubmit={handleSubmit}
        className="bg-white px-2 py-4 space-y-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
          <FormText
            label="Role Name"
            name="name"
            value={values.name}
            required
            placeholder="e.g. Regional Sales Lead"
            onChange={handleChange}
            onBlur={handleBlur}
            touched={touched.name}
            error={errors.name}
          />

          {!isEdit && (
            <FormSelect
              label="Copy permissions from"
              name="basedOn"
              value={values.basedOn}
              options={ASSIGNABLE_SYSTEM_ROLES.map((role) => ({
                value: role,
                label: SYSTEM_ROLE_META[role]?.label || role,
              }))}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          )}

          <div className="md:col-span-2">
            <FormTextArea
              label="Description"
              name="description"
              value={values.description}
              rows={3}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
