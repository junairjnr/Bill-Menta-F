"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import BackPanel from "@/app/utilsComponents/BackPanel";
import PageHeader from "@/app/utilsComponents/PageHeader";
import {
  useCompanySettings,
  useUpdateCompanySettings,
} from "@/app/hooks/settingsHook/useSettings";
import { usePermissions } from "@/app/hooks/usePermissions";

interface CompanyFormValues {
  name: string;
  code: string;
  email: string;
  phone: string;
  address: string;
  gstin: string;
  terms: string;
  logo: string;
  plan: "free" | "pro" | "enterprise";
  defaultSalesType: "retail" | "wholesale";
}

export default function CompanySettingsPage() {
  const { isSuperAdmin, canAction } = usePermissions();
  const { data: company, isLoading } = useCompanySettings();
  const { mutate: updateCompany, isPending } = useUpdateCompanySettings();

  const canManage = isSuperAdmin || canAction("settings.company", "view");
  const canSave = isSuperAdmin || canAction("settings.company", "edit");

  const formik = useFormik<CompanyFormValues>({
    enableReinitialize: true,
    initialValues: {
      name: company?.name || "",
      code: company?.code || "",
      email: company?.email || "",
      phone: company?.phone || "",
      address: company?.address || "",
      gstin: company?.gstin || "",
      terms: company?.terms || "",
      logo: company?.logo || "",
      plan: company?.plan || "free",
      defaultSalesType: company?.defaultSalesType || "retail",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Company name is required"),
      code: Yup.string().required("Company code is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
    }),
    onSubmit: (values) => updateCompany(values),
  });

  if (!canManage) {
    return (
      <BackPanel>
        <div className="p-6 text-sm text-gray-500">
          You do not have permission to access company settings.
        </div>
      </BackPanel>
    );
  }

  if (isLoading) {
    return (
      <BackPanel>
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm text-gray-400">Loading...</p>
        </div>
      </BackPanel>
    );
  }

  const renderField = (
    label: string,
    name: keyof CompanyFormValues,
    required = false,
    type = "text"
  ) => (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {required && <span className="text-red-500">* </span>}
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        disabled={!canSave}
        className="w-full rounded-md border px-3 py-2 text-sm disabled:bg-gray-50"
      />
      {formik.touched[name] && formik.errors[name] && (
        <p className="mt-1 text-xs text-red-500">{formik.errors[name]}</p>
      )}
    </div>
  );

  return (
    <BackPanel>
      <div className="space-y-4 p-6">
        <PageHeader
          title="Company Settings"
          description="Manage company profile and invoice code"
        />

        <form
          onSubmit={formik.handleSubmit}
          className="max-w-3xl space-y-4 rounded-xl border bg-white p-6 shadow-sm"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {renderField("Company Name", "name", true)}
            {renderField("Company Code", "code", true)}
            {renderField("Email", "email", true)}
            {renderField("Phone", "phone")}
            {renderField("Logo URL", "logo")}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Plan</label>
              <select
                name="plan"
                value={formik.values.plan}
                onChange={formik.handleChange}
                disabled={!canSave}
                className="w-full rounded-md border px-3 py-2 text-sm disabled:bg-gray-50"
              >
                <option value="free">Free</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
          </div>

          {renderField("Address", "address")}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {renderField("GSTIN", "gstin")}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Default Sales Type (Invoice)
            </label>
            <div className="flex flex-wrap gap-2">
              {(["retail", "wholesale"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  disabled={!canSave}
                  onClick={() => formik.setFieldValue("defaultSalesType", type)}
                  className={`rounded-md border px-4 py-2 text-sm font-medium transition disabled:opacity-60 ${
                    formik.values.defaultSalesType === type
                      ? "border-[#1E2235] bg-[#1E2235] text-white"
                      : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {type === "retail" ? "Retail" : "Wholesale"}
                </button>
              ))}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Pre-selected on new sales invoices; can be changed per invoice.
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Terms & Conditions (Invoice)
            </label>
            <textarea
              name="terms"
              value={formik.values.terms}
              onChange={formik.handleChange}
              disabled={!canSave}
              rows={3}
              className="w-full rounded-md border px-3 py-2 text-sm disabled:bg-gray-50"
              placeholder="Terms printed on tax invoice"
            />
          </div>

          {canSave && (
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isPending}
                className="rounded-md bg-emerald-700 px-4 py-2 text-sm text-white disabled:opacity-60"
              >
                {isPending ? "Saving..." : "Save Company"}
              </button>
            </div>
          )}
        </form>
      </div>
    </BackPanel>
  );
}
