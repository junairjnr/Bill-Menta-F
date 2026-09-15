"use client";

import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";

import PageHeader from "@/app/utilsComponents/PageHeader";
import { TAX_MASTER_FORM_ID } from "@/app/utilsComponents/form-footer";
import FormInput from "@/app/formComponents/FormText";
import FormCheckbox from "@/app/formComponents/FormCheckBox";
import FormNumber from "@/app/formComponents/FormNumber";
import React from "react";
import {
  useCreateTaxMaster,
  useUpdateTaxMaster,
} from "@/app/hooks/masterHooks/taxMasterHook/useTaxMaster";

interface TaxMasterFormProps {
  initialValues?: {
    name: string;
    taxPercent: string | number;
    isActive: boolean;
  };
  editId?: string;
  isEdit?: boolean;
  modalMode?: boolean;
  onSuccess?: (data: unknown) => void;
  onPendingChange?: (pending: boolean) => void;
}

const TaxMasterForm = ({
  initialValues,
  editId,
  isEdit = false,
  modalMode = false,
  onSuccess,
  onPendingChange,
}: TaxMasterFormProps) => {
  const router = useRouter();
  const { mutate: create, isPending: creating } = useCreateTaxMaster();
  const { mutate: update, isPending: updating } = useUpdateTaxMaster();
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
      name: Yup.string().required("Tax name is required"),
      taxPercent: Yup.number()
        .typeError("Enter GST %")
        .min(0.01, "Enter GST %")
        .max(100, "GST % cannot exceed 100")
        .required("GST % is required"),
      isActive: Yup.boolean(),
    }),
    enableReinitialize: true,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      const payload = {
        name: values.name,
        taxPercent: Number(values.taxPercent),
        isActive: values.isActive,
      };

      const onDone = (data: unknown) => {
        if (onSuccess) onSuccess(data);
        else router.back();
      };

      if (isEdit && editId) {
        update({ id: editId, payload }, { onSuccess: onDone });
      } else {
        create(payload, { onSuccess: onDone });
      }
    },
  });

  const { handleChange, handleBlur, values, errors, touched, handleSubmit } = formik;

  return (
    <div className={`w-full mx-auto ${modalMode ? "p-2" : "p-5"}`}>
      {!modalMode && (
        <PageHeader
          title={isEdit ? "Edit Tax Master" : "Add Tax Master"}
          description="Enter GST tax slab details"
        />
      )}

      <form
        id={TAX_MASTER_FORM_ID}
        onSubmit={handleSubmit}
        className="bg-white px-2 py-4 space-y-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
          <FormInput
            label="Name"
            name="name"
            value={values.name}
            placeholder="e.g. GST 18%"
            required
            error={errors.name}
            touched={touched.name}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <FormNumber
            label="GST %"
            name="taxPercent"
            value={values.taxPercent}
            placeholder="18"
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

export default React.memo(TaxMasterForm);
