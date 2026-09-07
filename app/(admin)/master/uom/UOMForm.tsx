"use client";

import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";

import PageHeader from "@/app/utilsComponents/PageHeader";
import { UOM_FORM_ID } from "@/app/utilsComponents/form-footer";

import {
  useCreateUom,
  useUpdateUom,
} from "@/app/hooks/masterHooks/uomHook/useUom";
import FormInput from "@/app/formComponents/FormText";
import FormCheckbox from "@/app/formComponents/FormCheckBox";
import React from "react";


interface UOMFormProps {
  initialValues?: {
    name: string;
    shortCode: string;
    isActive: boolean;
  };
  editId?: string;
  isEdit?: boolean;
  modalMode?: boolean;
  onSuccess?: (data: unknown) => void;
  onPendingChange?: (pending: boolean) => void;
}

const UOMForm = ({
  initialValues,
  editId,
  isEdit = false,
  modalMode = false,
  onSuccess,
  onPendingChange,
}: UOMFormProps) => {
  const router = useRouter();

  const { mutate: create, isPending: creating } =
    useCreateUom();

  const { mutate: update, isPending: updating } =
    useUpdateUom();

  const isPending = creating || updating;

  useEffect(() => {
    onPendingChange?.(isPending);
  }, [isPending, onPendingChange]);

  const formik = useFormik({
    initialValues:
      initialValues || {
        name: "",
        shortCode: "",
        isActive: true,
      },

    validationSchema: Yup.object({
      name: Yup.string().required(
        "UOM name is required"
      ),

      shortCode: Yup.string().required(
        "UOM code is required"
      ),

      isActive: Yup.boolean(),
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

  const {
    handleChange,
    handleBlur,
    values,
    errors,
    touched,
    handleSubmit,
  } = formik;

  return (
    <div className={`w-full mx-auto ${modalMode ? "p-2" : "p-5"}`}>
      {!modalMode && (
        <PageHeader
          title={isEdit ? "Edit UOM" : "Add UOM"}
          description="Enter UOM details"
        />
      )}

      <form
        id={UOM_FORM_ID}
        onSubmit={handleSubmit}
        className="bg-white px-2 py-4 space-y-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
          <FormInput
            label="Name"
            name="name"
            value={values.name}
            placeholder="Enter UOM name"
            required
            error={errors.name}
            touched={touched.name}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <FormInput
            label="Code"
            name="shortCode"
            value={values.shortCode}
            placeholder="Enter UOM code"
            required
            error={errors.shortCode}
            touched={touched.shortCode}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <FormCheckbox
            label="Active"
            name="isActive"
            checked={values.isActive}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>
      </form>
    </div>
  );
}
export default React.memo(UOMForm);