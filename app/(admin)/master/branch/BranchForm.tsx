"use client";

import { useEffect } from "react";
import { getIn, useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";

import PageHeader from "@/app/utilsComponents/PageHeader";
import { BRANCH_FORM_ID } from "@/app/utilsComponents/form-footer";

import {
  useCreateBranch,
  useUpdateBranch,
} from "@/app/hooks/branchHook/useBranch";
import FormInput from "@/app/formComponents/FormText";
import React from "react";

interface BranchFormValues {
  name: string;
  code: string;
  address: {
    line1: string;
    place: string;
    city: string;
    state: string;
    stateCode: string;
    pincode: string;
  };
  phone: string;
  email: string;
  gstin: string;
  isHeadOffice: boolean;
  isActive: boolean;
}

interface BranchFormProps {
  initialValues?: BranchFormValues;
  editId?: string;
  isEdit?: boolean;
  onPendingChange?: (pending: boolean) => void;
}

const defaultValues: BranchFormValues = {
  name: "",
  code: "",
  address: {
    line1: "",
    place: "",
    city: "",
    state: "",
    stateCode: "",
    pincode: "",
  },
  phone: "",
  email: "",
  gstin: "",
  isHeadOffice: false,
  isActive: true,
};

const BranchForm = ({
  initialValues,
  editId,
  isEdit = false,
  onPendingChange,
}: BranchFormProps) => {
  const router = useRouter();

  const { mutate: createBranch, isPending: creating } = useCreateBranch();

  const { mutate: updateBranch, isPending: updating } = useUpdateBranch();

  const isPending = creating || updating;

  useEffect(() => {
    onPendingChange?.(isPending);
  }, [isPending, onPendingChange]);

  const formik = useFormik<BranchFormValues>({
    initialValues: initialValues || defaultValues,

    enableReinitialize: true,

    validationSchema: Yup.object({
      name: Yup.string().required("Branch name is required"),
      code: Yup.string().required("Branch code is required"),

      email: Yup.string().email("Invalid email").nullable(),

      phone: Yup.string().nullable(),

      gstin: Yup.string().nullable(),
    }),

    onSubmit: (values) => {
      if (isEdit && editId) {
        updateBranch(
          {
            id: editId,
            payload: values,
          },
          {
            onSuccess: () => router.back(),
          }
        );
      } else {
        createBranch(values, {
          onSuccess: () => router.back(),
        });
      }
    },
  });

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    formik;

  const inputClass = (hasError?: boolean) =>
    `w-full border-b-2 bg-transparent py-2 text-sm outline-none transition ${
      hasError
        ? "border-red-500 focus:border-red-500"
        : "border-gray-300 focus:border-blue-600"
    }`;

  const renderInput = (
    label: string,
    name: string,
    placeholder: string,
    required = false,
    type = "text"
  ) => {
    const fieldError =
      touched[name as keyof typeof touched] &&
      errors[name as keyof typeof errors];

    return (
      <div className="flex items-start gap-4">
        <label className="w-32 pt-2 text-sm font-medium text-gray-700">
          {required && <span className="text-red-500">*</span>} {label}
        </label>

        <div className="flex-1">
          <input
            type={type}
            name={name}
            value={name
              .split(".")
              .reduce((obj: any, key) => obj?.[key], values)}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={inputClass(!!fieldError)}
          />

          {fieldError && (
            <p className="mt-1 text-xs text-red-500">{fieldError as string}</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full p-5">
      <PageHeader
        title={isEdit ? "Edit Branch" : "Add Branch"}
        description="Enter branch details"
      />

      <form
        id={BRANCH_FORM_ID}
        onSubmit={handleSubmit}
        className="mt-6 rounded-lg bg-white p-6 shadow-sm"
      >
        <div className="grid grid-cols-1 gap-x-16 gap-y-6 md:grid-cols-2">
          <FormInput
            label="Name"
            name="name"
            value={values.name}
            placeholder="Enter branch name"
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
            placeholder="Enter branch code"
            required
            error={errors.code}
            touched={touched.code}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <FormInput
            label="Address"
            name="address.line1"
            value={values.address.line1}
            placeholder="Enter address line 1"
            error={getIn(errors, "address.line1")}
            touched={getIn(touched, "address.line1")}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <FormInput
            label="Place"
            name="address.place"
            value={values.address.place}
            placeholder="Enter place"
            error={getIn(errors, "address.place")}
            touched={getIn(touched, "address.place")}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <FormInput
            label="City"
            name="address.city"
            value={values.address.city}
            placeholder="Enter city"
            error={getIn(errors, "address.city")}
            touched={getIn(touched, "address.city")}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <FormInput
            label="State"
            name="address.state"
            value={values.address.state}
            placeholder="Enter state"
            error={getIn(errors, "address.state")}
            touched={getIn(touched, "address.state")}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <FormInput
            label="State Code"
            name="address.stateCode"
            value={values.address.stateCode}
            placeholder="Enter state code"
            error={getIn(errors, "address.stateCode")}
            touched={getIn(touched, "address.stateCode")}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <FormInput
            label="Pincode"
            name="address.pincode"
            value={values.address.pincode}
            placeholder="Enter pincode"
            error={getIn(errors, "address.pincode")}
            touched={getIn(touched, "address.pincode")}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <FormInput
            label="Phone"
            name="phone"
            value={values.phone}
            placeholder="Enter phone number"
            error={errors.phone}
            touched={touched.phone}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <FormInput
            label="Email"
            name="email"
            type="email"
            value={values.email}
            placeholder="Enter email"
            error={errors.email}
            touched={touched.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <FormInput
            label="GSTIN"
            name="gstin"
            value={values.gstin}
            placeholder="Enter GSTIN"
            error={errors.gstin}
            touched={touched.gstin}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          {/* Head Office */}
          <div className="flex items-center gap-4">
            <label className="w-32 text-sm font-medium text-gray-700">
              Head Office
            </label>

            <input
              type="checkbox"
              name="isHeadOffice"
              checked={values.isHeadOffice}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300"
            />
          </div>

          {/* Active */}
          <div className="flex items-center gap-4">
            <label className="w-32 text-sm font-medium text-gray-700">
              Active
            </label>

            <input
              type="checkbox"
              name="isActive"
              checked={values.isActive}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
export default React.memo(BranchForm);