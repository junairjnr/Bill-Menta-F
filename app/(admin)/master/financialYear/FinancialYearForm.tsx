"use client";

import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import PageHeader from "@/app/utilsComponents/PageHeader";
import { FINANCIAL_YEAR_FORM_ID } from "@/app/utilsComponents/form-footer";
import FormNumber from "@/app/formComponents/FormNumber";
import { useCreateFY } from "@/app/hooks/financialYearHook/useFinancialYear";
import React from "react";

interface FinancialYearFormProps {
  onPendingChange?: (pending: boolean) => void;
}

const FinancialYearForm = ({ onPendingChange }: FinancialYearFormProps) => {
  const router = useRouter();
  const { mutate: create, isPending } = useCreateFY();

  useEffect(() => {
    onPendingChange?.(isPending);
  }, [isPending, onPendingChange]);

  const formik = useFormik({
    initialValues: { startYear: "" },
    validationSchema: Yup.object({
      startYear: Yup.number()
        .typeError("Start year is required")
        .integer("Enter a valid year")
        .min(2000, "Year must be 2000 or later")
        .max(2100, "Year must be 2100 or earlier")
        .required("Start year is required"),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      create(
        { startYear: Number(values.startYear) },
        { onSuccess: () => router.back() }
      );
    },
  });

  const { handleChange, handleBlur, values, errors, touched, handleSubmit } = formik;

  return (
    <div className="mx-auto w-full max-w-xl p-5">
      <PageHeader
        title="Add Financial Year"
        description="Enter the starting year. The system will create the FY period automatically."
      />

      <form
        id={FINANCIAL_YEAR_FORM_ID}
        onSubmit={handleSubmit}
        className="space-y-6 bg-white px-2 py-4"
      >
        <FormNumber
          label="Start Year"
          name="startYear"
          value={values.startYear}
          placeholder="e.g. 2026"
          required
          error={errors.startYear}
          touched={touched.startYear}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </form>
    </div>
  );
};

export default React.memo(FinancialYearForm);
