"use client";

import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";

import PageHeader from "@/app/utilsComponents/PageHeader";
import { PRICE_LEVEL_FORM_ID } from "@/app/utilsComponents/form-footer";

import FormInput from "@/app/formComponents/FormText";
import FormCheckbox from "@/app/formComponents/FormCheckBox";
import React from "react";
import {
  useCreatePriceLevel,
  useUpdatePriceLevel,
} from "@/app/hooks/masterHooks/priceLevelHook/usePriceLevel";
import FormNumber from "@/app/formComponents/FormNumber";

interface PriceLevelFormProps {
  initialValues?: {
    name: string;
    taxPercent: string;
    isActive: boolean;
  };
  editId?: string;
  isEdit?: boolean;
  onPendingChange?: (pending: boolean) => void;
}

const PriceLevelForm = ({
  initialValues,
  editId,
  isEdit = false,
  onPendingChange,
}: PriceLevelFormProps) => {
  const router = useRouter();

  const { mutate: create, isPending: creating } = useCreatePriceLevel();

  const { mutate: update, isPending: updating } = useUpdatePriceLevel();

  const isPending = creating || updating;

  useEffect(() => {
    onPendingChange?.(isPending);
  }, [isPending, onPendingChange]);

  const formik = useFormik({
    initialValues: initialValues || {
      name: "",
      taxPercent: "",
      isActive: true,
    },

    validationSchema: Yup.object({
      name: Yup.string().required("Price Level name is required"),

      taxPercent: Yup.string().required(
        "Price Level tax percentage is required"
      ),

      isActive: Yup.boolean(),
    }),

    enableReinitialize: true,

    validateOnChange: true,
    validateOnBlur: true,

    onSubmit: (values) => {
      if (isEdit && editId) {
        update(
          {
            id: editId,
            payload: values,
          },
          {
            onSuccess: () => router.back(),
          }
        );
      } else {
        create(values, {
          onSuccess: () => router.back(),
        });
      }
    },
  });

  const { handleChange, handleBlur, values, errors, touched, handleSubmit } =
    formik;

  return (
    <div className="w-full mx-auto p-5">
      <PageHeader
        title={isEdit ? "Edit PRICE LEVEL" : "Add PRICE LEVEL"}
        description="Enter PRICE LEVEL details"
      />

      <form
        id={PRICE_LEVEL_FORM_ID}
        onSubmit={handleSubmit}
        className="bg-white px-2 py-4 space-y-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
          <FormInput
            label="Name"
            name="name"
            value={values.name}
            placeholder="Enter Price Level"
            required
            error={errors.name}
            touched={touched.name}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <FormNumber
            label="Tax Percentage"
            name="taxPercent"
            value={values.taxPercent}
            placeholder="Enter Price Level tax percentage"
            required
            error={errors.taxPercent}
            touched={touched.taxPercent}
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
};
export default React.memo(PriceLevelForm);
