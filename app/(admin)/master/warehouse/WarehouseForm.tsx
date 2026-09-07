"use client";

import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";

import PageHeader from "@/app/utilsComponents/PageHeader";
import { WAREHOUSE_FORM_ID } from "@/app/utilsComponents/form-footer";

import FormInput from "@/app/formComponents/FormText";
import FormCheckbox from "@/app/formComponents/FormCheckBox";
import React from "react";
import {
  useCreateWarehouse,
  useUpdateWarehouse,
} from "@/app/hooks/warehouseHooks/useWarehouse";
import FormTextArea from "@/app/formComponents/FormTextArea";

interface WarehouseFormProps {
  initialValues?: {
    name: string;
    code: string;
    description: string;
    isDefault: boolean;
  };
  editId?: string;
  isEdit?: boolean;
  modalMode?: boolean;
  onSuccess?: (data: unknown) => void;
  onPendingChange?: (pending: boolean) => void;
}

const WarehouseForm = ({
  initialValues,
  editId,
  isEdit = false,
  modalMode = false,
  onSuccess,
  onPendingChange,
}: WarehouseFormProps) => {
  const router = useRouter();

  const { mutate: create, isPending: creating } = useCreateWarehouse();

  const { mutate: update, isPending: updating } = useUpdateWarehouse();

  const isPending = creating || updating;

  useEffect(() => {
    onPendingChange?.(isPending);
  }, [isPending, onPendingChange]);

  const formik = useFormik({
    initialValues: initialValues || {
      name: "",
      code: "",
      description: "",
      isDefault: true,
    },

    validationSchema: Yup.object({
      name: Yup.string().required("Warehouse name is required"),

      code: Yup.string().required("Warehouse code is required"),

    //   description: Yup.string().required("Warehouse description is required"),

      isDefault: Yup.boolean(),
    }),

    enableReinitialize: true,

    validateOnChange: true,
    validateOnBlur: true,

    onSubmit: (values) => {
      const onDone = (data: unknown) => {
        if (onSuccess) onSuccess(data);
        else router.back();
      };
      if (isEdit && editId) {
        update({ id: editId, payload: values }, { onSuccess: onDone });
      } else {
        create(values, { onSuccess: onDone });
      }
    },
  });

  const { handleChange, handleBlur, values, errors, touched, handleSubmit } =
    formik;

  return (
    <div className={`w-full mx-auto ${modalMode ? "p-2" : "p-5"}`}>
      {!modalMode && (
        <PageHeader
          title={isEdit ? "Edit Warehouse" : "Add Warehouse"}
          description="Enter Warehouse details"
        />
      )}

      <form
        id={WAREHOUSE_FORM_ID}
        onSubmit={handleSubmit}
        className="bg-white px-2 py-4 space-y-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
          <FormInput
            label="Name"
            name="name"
            value={values.name}
            placeholder="Enter Warehouse name"
            required
            error={errors.name}
            touched={touched.name}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <FormInput
            label="Code"
            name="code"
            value={values.code}
            placeholder="Enter Warehouse code"
            required
            error={errors.code}
            touched={touched.code}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <FormTextArea
            label="Description"
            name="description"
            value={values.description}
            placeholder="Enter Warehouse description"
            // required
            error={errors.description}
            touched={touched.description}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <FormCheckbox
            label="Default"
            name="isDefault"
            checked={values.isDefault}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>
      </form>
    </div>
  );
};
export default React.memo(WarehouseForm);
