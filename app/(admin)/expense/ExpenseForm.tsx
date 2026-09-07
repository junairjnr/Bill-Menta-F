"use client";

import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import PageHeader from "@/app/utilsComponents/PageHeader";
import { EXPENSE_FORM_ID } from "@/app/utilsComponents/form-footer";
import FormInput from "@/app/formComponents/FormText";
import FormSelect from "@/app/formComponents/FormSelect";
import FormTextarea from "@/app/formComponents/FormTextArea";
import {
  useCreateExpense,
  useExpense,
  useUpdateExpense,
} from "@/app/hooks/expenseHook/useExpense";
import { EXPENSE_CATEGORIES, PAYMENT_MODES } from "@/app/utilsComponents/expenseConstants";
import NextDocumentNumberField from "@/app/formComponents/NextDocumentNumberField";

interface ExpenseFormProps {
  editId?: string;
  isEdit?: boolean;
  onPendingChange?: (pending: boolean) => void;
}

export default function ExpenseForm({ editId, isEdit = false, onPendingChange }: ExpenseFormProps) {
  const router = useRouter();
  const { data: existing, isLoading } = useExpense(editId || "");
  const { mutate: create, isPending: creating } = useCreateExpense();
  const { mutate: update, isPending: updating } = useUpdateExpense();
  const isPending = creating || updating;

  useEffect(() => {
    onPendingChange?.(isPending);
  }, [isPending, onPendingChange]);

  const formik = useFormik({
    initialValues: {
      date: existing?.date
        ? String(existing.date).slice(0, 10)
        : new Date().toISOString().slice(0, 10),
      category: existing?.category || "other",
      title: existing?.title || "",
      amount: existing?.amount ?? "",
      paymentMode: existing?.paymentMode || "cash",
      referenceNo: existing?.referenceNo || "",
      notes: existing?.notes || "",
    },
    validationSchema: Yup.object({
      date: Yup.string().required("Date is required"),
      category: Yup.string().required("Category is required"),
      title: Yup.string().required("Title is required"),
      amount: Yup.number()
        .typeError("Enter a valid amount")
        .min(0.01, "Amount must be greater than 0")
        .required("Amount is required"),
      paymentMode: Yup.string().required("Payment mode is required"),
    }),
    enableReinitialize: true,
    onSubmit: (values) => {
      const payload = {
        ...values,
        amount: Number(values.amount),
      };
      const onDone = () => router.push("/expense");
      if (isEdit && editId) {
        update({ id: editId, payload }, { onSuccess: onDone });
      } else {
        create(payload, { onSuccess: onDone });
      }
    },
  });

  const { handleChange, handleBlur, values, errors, touched, handleSubmit } = formik;

  if (isEdit && editId && isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-gray-400">Loading expense...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full p-5">
      <PageHeader
        title={isEdit ? "Edit Expense" : "New Expense"}
        description="Record business expenses for the current financial year"
      />

      <form id={EXPENSE_FORM_ID} onSubmit={handleSubmit} className="space-y-8 bg-white px-2 py-4">
        <div className="grid grid-cols-1 gap-x-16 gap-y-6 md:grid-cols-2">
          {!isEdit && (
            <NextDocumentNumberField documentType="expense" label="Expense No" />
          )}

          <FormInput
            label="Date"
            name="date"
            type="date"
            value={values.date}
            required
            error={errors.date}
            touched={touched.date}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <FormSelect
            label="Category"
            name="category"
            value={values.category}
            options={[...EXPENSE_CATEGORIES]}
            required
            error={errors.category}
            touched={touched.category}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <FormInput
            label="Title"
            name="title"
            value={values.title}
            placeholder="Expense description"
            required
            error={errors.title}
            touched={touched.title}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <FormInput
            label="Amount"
            name="amount"
            type="number"
            value={values.amount}
            placeholder="0.00"
            required
            error={errors.amount}
            touched={touched.amount}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <FormSelect
            label="Payment Mode"
            name="paymentMode"
            value={values.paymentMode}
            options={[...PAYMENT_MODES]}
            required
            error={errors.paymentMode}
            touched={touched.paymentMode}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <FormInput
            label="Reference No"
            name="referenceNo"
            value={values.referenceNo}
            placeholder="Cheque / UPI reference"
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <div className="md:col-span-2">
            <FormTextarea
              label="Notes"
              name="notes"
              value={values.notes}
              placeholder="Optional notes"
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
