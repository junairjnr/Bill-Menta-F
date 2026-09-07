"use client";

import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";

import PageHeader from "@/app/utilsComponents/PageHeader";
import { BANK_FORM_ID } from "@/app/utilsComponents/form-footer";
import FormInput from "@/app/formComponents/FormText";
import FormSelect from "@/app/formComponents/FormSelect";
import FormCheckbox from "@/app/formComponents/FormCheckBox";
import React from "react";
import {
  useCreateBankAccount,
  useUpdateBankAccount,
} from "@/app/hooks/masterHooks/bankHook/useBank";

interface BankAccountFormValues {
  accountName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branch: string;
  accountType: "current" | "savings" | "overdraft";
  upiId: string;
  isDefault: boolean;
}

interface BankAccountFormProps {
  initialValues?: BankAccountFormValues;
  editId?: string;
  isEdit?: boolean;
  onPendingChange?: (pending: boolean) => void;
}

const BankAccountForm = ({
  initialValues,
  editId,
  isEdit = false,
  onPendingChange,
}: BankAccountFormProps) => {
  const router = useRouter();
  const { mutate: create, isPending: creating } = useCreateBankAccount();
  const { mutate: update, isPending: updating } = useUpdateBankAccount();
  const isPending = creating || updating;

  useEffect(() => {
    onPendingChange?.(isPending);
  }, [isPending, onPendingChange]);

  const formik = useFormik<BankAccountFormValues>({
    initialValues: initialValues || {
      accountName: "",
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      branch: "",
      accountType: "current",
      upiId: "",
      isDefault: false,
    },
    validationSchema: Yup.object({
      accountName: Yup.string().required("Account name is required"),
      bankName: Yup.string().required("Bank name is required"),
      accountNumber: Yup.string().required("Account number is required"),
      ifscCode: Yup.string(),
      accountType: Yup.string().required("Account type is required"),
    }),
    enableReinitialize: true,
    onSubmit: (values) => {
      const onDone = () => router.back();
      if (isEdit && editId) {
        update({ id: editId, payload: values }, { onSuccess: onDone });
      } else {
        create(values, { onSuccess: onDone });
      }
    },
  });

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = formik;

  return (
    <div className="w-full mx-auto p-5">
      <PageHeader
        title={isEdit ? "Edit Bank Account" : "Add Bank Account"}
        description="Add your company bank account details"
      />

      <form
        id={BANK_FORM_ID}
        onSubmit={handleSubmit}
        className="bg-white px-2 py-4 space-y-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
          <FormInput
            label="Account Name"
            name="accountName"
            value={values.accountName}
            required
            placeholder="e.g. SBI Current A/C"
            onChange={handleChange}
            onBlur={handleBlur}
            touched={touched.accountName}
            error={errors.accountName}
          />

          <FormInput
            label="Bank Name"
            name="bankName"
            value={values.bankName}
            required
            placeholder="e.g. State Bank of India"
            onChange={handleChange}
            onBlur={handleBlur}
            touched={touched.bankName}
            error={errors.bankName}
          />

          <FormInput
            label="Account No"
            name="accountNumber"
            value={values.accountNumber}
            required
            placeholder="Account number"
            onChange={handleChange}
            onBlur={handleBlur}
            touched={touched.accountNumber}
            error={errors.accountNumber}
          />

          <FormInput
            label="IFSC Code"
            name="ifscCode"
            value={values.ifscCode}
            placeholder="e.g. SBIN0001234"
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <FormInput
            label="Bank Branch"
            name="branch"
            value={values.branch}
            placeholder="e.g. Kozhikode Main"
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <FormSelect
            label="Account Type"
            name="accountType"
            value={values.accountType}
            required
            options={[
              { label: "Current", value: "current" },
              { label: "Savings", value: "savings" },
              { label: "Overdraft", value: "overdraft" },
            ]}
            onChange={handleChange}
            onBlur={handleBlur}
            touched={touched.accountType}
            error={errors.accountType}
          />

          <FormInput
            label="UPI ID"
            name="upiId"
            value={values.upiId}
            placeholder="e.g. company@sbi (optional)"
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <FormCheckbox
            label="Set as Default"
            name="isDefault"
            checked={values.isDefault}
            onChange={handleChange}
          />
        </div>
      </form>
    </div>
  );
};

export default React.memo(BankAccountForm);
