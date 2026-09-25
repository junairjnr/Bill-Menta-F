// "use client";

// import { useFormik } from "formik";
// import * as Yup from "yup";
// import PageHeader from "@/app/utilsComponents/PageHeader";
// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";
// import ProductInvoiceForm from "./fiedArray";

// interface ProductFormProps {
//   initialValues?: {
//     name: string;
//     price: string;
//     category: string;
//     stock: string;
//     description: string;
//   };
//   onSubmit: (values: any) => void;
//   isEdit?: boolean;
// }

// export default function ProductForm({
//   initialValues,
//   onSubmit,
//   isEdit = false,
// }: ProductFormProps) {
//   const router = useRouter();

//   const formik = useFormik({
//     initialValues: initialValues || {
//       name: "",
//       price: "",
//       category: "",
//       stock: "",
//       description: "",
//     },
//     validationSchema: Yup.object({
//       name: Yup.string().required("Required"),
//       price: Yup.number().required("Required"),
//       category: Yup.string().required("Required"),
//       stock: Yup.number().required("Required"),
//     }),
//     onSubmit,
//     enableReinitialize: true,

//     // ✅ optional better UX
//     validateOnChange: true,
//     validateOnBlur: true,
//   });

//   const { handleChange, handleBlur, values, errors, touched, handleSubmit } =
//     formik;

//   return (
//     <div className="w-full mx-auto p-5">
//       {/* Header */}
//       <PageHeader
//         title={isEdit ? "Edit Product" : "Add Invoice"}
//         description="Enter product details"
//       />

//       {/* Form */}
//       <form onSubmit={handleSubmit} className="bg-white px-2 py-4 space-y-8">
//         {/* 🔥 Two Column Layout */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
//           {/* Name */}
//           {/* <div className="flex items-center gap-4">
//             <label className="w-32 text-sm text-gray-600">Name</label>
//             <div className="flex-1">
//               <input
//                 name="name"
//                 value={values.name}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 className={`w-full border-b py-1 outline-none bg-transparent ${
//                   touched.name && errors.name
//                     ? "border-red-500"
//                     : "border-gray-300 focus:border-blue-600"
//                 }`}
//               />
//               {touched.name && errors.name && (
//                 <p className="text-red-500 text-xs mt-1">
//                   {errors.name}
//                 </p>
//               )}
//             </div>
//           </div> */}
//           <div className="flex items-center gap-4 max-w-md">
//             <label className="w-28 text-sm font-medium text-gray-700">
//               <span className="text-red-500">*</span> Invoice Date
//             </label>

//             <div className="flex-1">
//               <input
//                 name="name"
//                 value={values.name}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 placeholder="Enter product name"
//                 className={`w-full border-b-2 bg-transparent py-1.5 text-sm transition-all duration-200
//         ${
//           touched.name && errors.name
//             ? "border-red-500 focus:border-red-500"
//             : "border-gray-300 focus:border-blue-600"
//         }
//         focus:outline-none`}
//               />

//               {touched.name && errors.name && (
//                 <p className="text-red-500 text-xs mt-1">{errors.name}</p>
//               )}
//             </div>
//           </div>

//  <div className="flex items-center gap-4 max-w-md">
//             <label className="w-28 text-sm font-medium text-gray-700">
//               <span className="text-red-500">*</span> Invoice Type
//             </label>

//             <div className="flex-1">
//               {/* <input
//                 name="category"
//                 value={values.category}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 placeholder="Enter category"
//                 className={`w-full border-b-2 bg-transparent py-1.5 text-sm transition-all duration-200
//         ${
//           touched.category && errors.category
//             ? "border-red-500 focus:border-red-500"
//             : "border-gray-300 focus:border-blue-600"
//         }
//         focus:outline-none`}
//               /> */}
//               <select>
//                 <option value="">Select Invoice Type</option>
//                 <option value="regular">Wholesale</option>
//                 <option value="recurring">Retail</option>
//               </select>

//               {touched.category && errors.category && (
//                 <p className="text-red-500 text-xs mt-1">{errors.category}</p>
//               )}
//             </div>
//           </div>

//           <div className="flex items-center gap-4 max-w-md">
//             <label className="w-28 text-sm font-medium text-gray-700">
//               <span className="text-red-500">*</span> Invoice Number
//             </label>

//             <div className="flex-1">
//               <input
//                 name="name"
//                 value={values.name}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 placeholder="Enter product name"
//                 className={`w-full border-b-2 bg-transparent py-1.5 text-sm transition-all duration-200
//         ${
//           touched.name && errors.name
//             ? "border-red-500 focus:border-red-500"
//             : "border-gray-300 focus:border-blue-600"
//         }
//         focus:outline-none`}
//               />

//               {touched.name && errors.name && (
//                 <p className="text-red-500 text-xs mt-1">{errors.name}</p>
//               )}
//             </div>
//           </div>

//           {/* Category */}
//           {/* <div className="flex items-center gap-4">
//             <label className="w-32 text-sm text-gray-600">Category</label>
//             <div className="flex-1">
//               <input
//                 name="category"
//                 value={values.category}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 className={`w-full border-b py-1 outline-none bg-transparent ${
//                   touched.category && errors.category
//                     ? "border-red-500"
//                     : "border-gray-300 focus:border-blue-600"
//                 }`}
//               />
//               {touched.category && errors.category && (
//                 <p className="text-red-500 text-xs mt-1">{errors.category}</p>
//               )}
//             </div>
//           </div> */}

//           {/* Price */}
//           {/* <div className="flex items-center gap-4">
//             <label className="w-32 text-sm text-gray-600">Price</label>
//             <div className="flex-1">
//               <input
//                 type="number"
//                 name="price"
//                 value={values.price}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 className={`w-full border-b py-1 outline-none bg-transparent ${
//                   touched.price && errors.price
//                     ? "border-red-500"
//                     : "border-gray-300 focus:border-blue-600"
//                 }`}
//               />
//               {touched.price && errors.price && (
//                 <p className="text-red-500 text-xs mt-1">{errors.price}</p>
//               )}
//             </div>
//           </div> */}
//           <div className="flex items-center gap-4 max-w-md">
//             <label className="w-28 text-sm font-medium text-gray-700">
//               <span className="text-red-500">*</span> Select Customer
//             </label>

//             <div className="flex-1">
//               {/* <input
//                 name="category"
//                 value={values.category}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 placeholder="Enter category"
//                 className={`w-full border-b-2 bg-transparent py-1.5 text-sm transition-all duration-200
//         ${
//           touched.category && errors.category
//             ? "border-red-500 focus:border-red-500"
//             : "border-gray-300 focus:border-blue-600"
//         }
//         focus:outline-none`}
//               /> */}
//               <select>
//                 <option value="">Select Customer</option>
//                 <option value="regular">ANfal W</option>
//                 <option value="recurring">Safvan R</option>
//               </select>

//               {touched.category && errors.category && (
//                 <p className="text-red-500 text-xs mt-1">{errors.category}</p>
//               )}
//             </div>
//           </div>

//           <div className="flex items-center gap-4 max-w-md">
//             <label className="w-28 text-sm font-medium text-gray-700">
//               <span className="text-red-500">*</span> Price Level
//             </label>

//             <div className="flex-1">
//               {/* <input
//                 name="category"
//                 value={values.category}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 placeholder="Enter category"
//                 className={`w-full border-b-2 bg-transparent py-1.5 text-sm transition-all duration-200
//         ${
//           touched.category && errors.category
//             ? "border-red-500 focus:border-red-500"
//             : "border-gray-300 focus:border-blue-600"
//         }
//         focus:outline-none`}
//               /> */}
//               <select>
//                 <option value="">Select Tax Type</option>
//                 <option value="regular">Wholesale percentage</option>
//                 <option value="recurring">Retail percentage</option>
//               </select>

//               {touched.category && errors.category && (
//                 <p className="text-red-500 text-xs mt-1">{errors.category}</p>
//               )}
//             </div>
//           </div>
//           {/* <div className="flex items-center gap-4 max-w-md">
//             <label className="w-28 text-sm font-medium text-gray-700">
//               <span className="text-red-500">*</span> Price
//             </label>

//             <div className="flex-1">
//               <input
//                 type="number"
//                 name="price"
//                 value={values.price}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 placeholder="Enter price"
//                 className={`w-full border-b-2 bg-transparent py-1.5 text-sm transition-all duration-200
//         ${
//           touched.price && errors.price
//             ? "border-red-500 focus:border-red-500"
//             : "border-gray-300 focus:border-blue-600"
//         }
//         focus:outline-none`}
//               />

//               {touched.price && errors.price && (
//                 <p className="text-red-500 text-xs mt-1">{errors.price}</p>
//               )}
//             </div>
//           </div> */}

//           {/* Stock */}
//           {/* <div className="flex items-center gap-4">
//             <label className="w-32 text-sm text-gray-600">Stock</label>
//             <div className="flex-1">
//               <input
//                 type="number"
//                 name="stock"
//                 value={values.stock}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 className={`w-full border-b py-1 outline-none bg-transparent ${
//                   touched.stock && errors.stock
//                     ? "border-red-500"
//                     : "border-gray-300 focus:border-blue-600"
//                 }`}
//               />
//               {touched.stock && errors.stock && (
//                 <p className="text-red-500 text-xs mt-1">{errors.stock}</p>
//               )}
//             </div>
//           </div> */}
//           <div className="flex items-center gap-4 max-w-md">
//             <label className="w-28 text-sm font-medium text-gray-700">
//               <span className="text-red-500">*</span> Supply place
//             </label>

//             <div className="flex-1">
//               <input
//                 type="number"
//                 name="stock"
//                 value={values.stock}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 placeholder="Enter stock"
//                 className={`w-full border-b-2 bg-transparent py-1.5 text-sm transition-all duration-200
//         ${
//           touched.stock && errors.stock
//             ? "border-red-500 focus:border-red-500"
//             : "border-gray-300 focus:border-blue-600"
//         }
//         focus:outline-none`}
//               />

//               {touched.stock && errors.stock && (
//                 <p className="text-red-500 text-xs mt-1">{errors.stock}</p>
//               )}
//             </div>
//           </div>
//         </div>

//         <ProductInvoiceForm />

//         {/* Actions */}
//         <div className="flex justify-end pt-6">
//           <Button
//             type="button"
//             variant="ghost"
//             onClick={() => router.back()}
//             className="shadow-sm ml-3 bg-green-600 hover:bg-green-700 text-white"
//           >
//             Cancel
//           </Button>

//           <Button
//             type="submit"
//             className="shadow-sm ml-3 bg-green-600 hover:bg-green-700 text-white"
//           >
//             {isEdit ? "Update Product" : "Save Product"}
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// }
"use client";

import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import PageHeader from "@/app/utilsComponents/PageHeader";
import { useRouter } from "next/navigation";
import { CUSTOMER_FORM_ID } from "@/app/utilsComponents/form-footer";
import {
  useCreateCustomer,
  useUpdateCustomer,
} from "@/app/hooks/masterHooks/customerHook/useCustomer";
import FormText from "@/app/formComponents/FormText";
import FormSelect from "@/app/formComponents/FormSelect";
import FormNumber from "@/app/formComponents/FormNumber";
import FormRadio from "@/app/formComponents/FormRadio";

// ── Indian states list ────────────────────────────────────────
const INDIAN_STATES = [
  { name: "Andhra Pradesh", code: "37" },
  { name: "Arunachal Pradesh", code: "12" },
  { name: "Assam", code: "18" },
  { name: "Bihar", code: "10" },
  { name: "Chhattisgarh", code: "22" },
  { name: "Goa", code: "30" },
  { name: "Gujarat", code: "24" },
  { name: "Haryana", code: "06" },
  { name: "Himachal Pradesh", code: "02" },
  { name: "Jharkhand", code: "20" },
  { name: "Karnataka", code: "29" },
  { name: "Kerala", code: "32" },
  { name: "Madhya Pradesh", code: "23" },
  { name: "Maharashtra", code: "27" },
  { name: "Tamil Nadu", code: "33" },
  { name: "Telangana", code: "36" },
  { name: "Uttar Pradesh", code: "09" },
  { name: "West Bengal", code: "19" },
  { name: "Delhi", code: "07" },
  { name: "Rajasthan", code: "08" },
  { name: "Punjab", code: "03" },
  { name: "Uttarakhand", code: "05" },
  { name: "Odisha", code: "21" },
  { name: "Jammu and Kashmir", code: "01" },
  { name: "Ladakh", code: "38" },
  { name: "Puducherry", code: "34" },
  { name: "Chandigarh", code: "04" },
  { name: "Lakshadweep", code: "31" },
  { name: "Andaman and Nicobar Islands", code: "35" },
];

interface CustomerFormProps {
  initialValues?: {
    type: string;
    name: string;
    email: string;
    phone: string;
    gstin: string;
    customerType: string;
    creditLimit: string | number;
    line1: string;
    line2: string;
    place: string;
    city: string;
    state: string;
    stateCode: string;
    pincode: string;
  };
  editId?: string;
  isEdit?: boolean;
  modalMode?: boolean;
  onSuccess?: (data: unknown) => void;
  onPendingChange?: (pending: boolean) => void;
}

export default function CustomerForm({
  initialValues,
  editId,
  isEdit = false,
  modalMode = false,
  onSuccess,
  onPendingChange,
}: CustomerFormProps) {
  const router = useRouter();
  const { mutate: create, isPending: creating } = useCreateCustomer();
  const { mutate: update, isPending: updating } = useUpdateCustomer();
  const isPending = creating || updating;

  useEffect(() => {
    onPendingChange?.(isPending);
  }, [isPending, onPendingChange]);

  const formik = useFormik({
    initialValues: initialValues || {
      type: "sales",
      name: "",
      email: "",
      phone: "",
      gstin: "",
      customerType: "retail",
      creditLimit: "",
      line1: "",
      line2: "",
      place: "",
      city: "",
      state: "",
      stateCode: "",
      pincode: "",
    },

    validationSchema: Yup.object({
      type: Yup.string().required("Party type is required"),
      name: Yup.string().required("Name is required"),
      phone: Yup.string()
        .required("Phone is required")
        .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
      email: Yup.string().email("Invalid email"),
      gstin: Yup.string(),
      customerType: Yup.string().when("type", {
        is: "sales",
        then: (schema) => schema.required("Customer type is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      creditLimit: Yup.number()
        .min(0, "Cannot be negative")
        .typeError("Must be a number"),
    }),

    enableReinitialize: true,
    validateOnChange: true,
    validateOnBlur: true,

    onSubmit: (values) => {
      const payload = {
        type: values.type,
        name: values.name,
        email: values.email,
        phone: values.phone,
        gstin: values.gstin,

        customerType:
          values.type === "sales"
            ? (values.customerType as "retail" | "wholesale")
            : "retail",
        creditLimit:
          values.type === "sales" ? Number(values.creditLimit) || 0 : 0,

        address: {
          line1: values.line1,
          line2: values.line2,
          place: values.place,
          city: values.city,
          state: values.state,
          stateCode: values.stateCode,
          pincode: values.pincode,
          country: "India",
        },
        isActive: true,
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

  const {
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    errors,
    touched,
    setFieldValue,
  } = formik;

  const handlePartyTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextType = e.target.value;
    setFieldValue("type", nextType);
    if (nextType === "purchase") {
      setFieldValue("customerType", "retail");
      setFieldValue("creditLimit", 0);
    }
  };

  // ── Auto fill state code when state selected ──────────────
  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = INDIAN_STATES.find((s) => s.name === e.target.value);
    setFieldValue("state", e.target.value);
    setFieldValue("stateCode", selected?.code || "");
  };

  // ── Reusable input class ──────────────────────────────────
  const inputClass = (field: string) =>
    `w-full border-b-2 bg-transparent py-1.5 text-sm transition-all duration-200 focus:outline-none ${
      touched[field as keyof typeof touched] &&
      errors[field as keyof typeof errors]
        ? "border-red-500 focus:border-red-500"
        : "border-gray-300 focus:border-blue-600"
    }`;

  return (
    <div className={`w-full mx-auto ${modalMode ? "p-2" : "p-5"}`}>
      {!modalMode && (
        <PageHeader
          title={isEdit ? "Edit Party" : "Add Party"}
          description="Add sales customer or purchase party"
        />
      )}

      {/* <form onSubmit={handleSubmit} className="bg-white px-2 py-4 space-y-10">

        <div className="flex items-center gap-6">
          <span className="text-sm font-medium text-gray-700">
            <span className="text-red-500">*</span> Party Type
          </span>
          <div className="flex gap-6">
            {[
              { value: "sales",    label: "Sales Customer" },
              { value: "purchase", label: "Purchase Party" },
            ].map((t) => (
              <label
                key={t.value}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="type"
                  value={t.value}
                  checked={values.type === t.value}
                  onChange={handleChange}
                  className="accent-green-600 w-4 h-4"
                />
                <span className="text-sm font-medium text-gray-700">
                  {t.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">
            Basic Info
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">

            <div className="flex items-center gap-4 max-w-md">
              <label className="w-28 text-sm font-medium text-gray-700">
                <span className="text-red-500">*</span> Name
              </label>
              <div className="flex-1">
                <input
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Party name"
                  className={inputClass("name")}
                />
                {touched.name && errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 max-w-md">
              <label className="w-28 text-sm font-medium text-gray-700">
                <span className="text-red-500">*</span> Phone
              </label>
              <div className="flex-1">
                <input
                  name="phone"
                  value={values.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Phone number"
                  className={inputClass("phone")}
                />
                {touched.phone && errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 max-w-md">
              <label className="w-28 text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="flex-1">
                <input
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Email address"
                  className={inputClass("email")}
                />
                {touched.email && errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 max-w-md">
              <label className="w-28 text-sm font-medium text-gray-700">
                GSTIN
              </label>
              <div className="flex-1">
                <input
                  name="gstin"
                  value={values.gstin}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="GST number (optional)"
                  className={inputClass("gstin")}
                />
              </div>
            </div>

            {values.type === "sales" && (
              <>
                <div className="flex items-center gap-4 max-w-md">
                  <label className="w-28 text-sm font-medium text-gray-700">
                    <span className="text-red-500">*</span> Type
                  </label>
                  <div className="flex-1">
                    <select
                      name="customerType"
                      value={values.customerType}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={inputClass("customerType")}
                    >
                      <option value="retail">Retail</option>
                      <option value="wholesale">Wholesale</option>
                    </select>
                    {touched.customerType && errors.customerType && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.customerType}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 max-w-md">
                  <label className="w-28 text-sm font-medium text-gray-700">
                    Credit Limit
                  </label>
                  <div className="flex-1">
                    <input
                      type="number"
                      name="creditLimit"
                      value={values.creditLimit}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="0"
                      min="0"
                      onKeyDown={(e) => {
                        if (["-", "e", "E", "+"].includes(e.key))
                          e.preventDefault();
                      }}
                      className={inputClass("creditLimit")}
                    />
                    {touched.creditLimit && errors.creditLimit && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.creditLimit as string}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}

          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">
            Address
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">

            <div className="flex items-center gap-4 max-w-md">
              <label className="w-28 text-sm font-medium text-gray-700">
                Line 1
              </label>
              <div className="flex-1">
                <input
                  name="line1"
                  value={values.line1}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Street address"
                  className={inputClass("line1")}
                />
              </div>
            </div>

            <div className="flex items-center gap-4 max-w-md">
              <label className="w-28 text-sm font-medium text-gray-700">
                Line 2
              </label>
              <div className="flex-1">
                <input
                  name="line2"
                  value={values.line2}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Apartment, suite, etc."
                  className={inputClass("line2")}
                />
              </div>
            </div>

            <div className="flex items-center gap-4 max-w-md">
              <label className="w-28 text-sm font-medium text-gray-700">
                Place
              </label>
              <div className="flex-1">
                <input
                  name="place"
                  value={values.place}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Locality / Area"
                  className={inputClass("place")}
                />
              </div>
            </div>

            <div className="flex items-center gap-4 max-w-md">
              <label className="w-28 text-sm font-medium text-gray-700">
                City
              </label>
              <div className="flex-1">
                <input
                  name="city"
                  value={values.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="City"
                  className={inputClass("city")}
                />
              </div>
            </div>

            <div className="flex items-center gap-4 max-w-md">
              <label className="w-28 text-sm font-medium text-gray-700">
                State
              </label>
              <div className="flex-1">
                <select
                  name="state"
                  value={values.state}
                  onChange={handleStateChange}
                  onBlur={handleBlur}
                  className={inputClass("state")}
                >
                  <option value="">Select state</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s.code} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4 max-w-md">
              <label className="w-28 text-sm font-medium text-gray-700">
                State Code
              </label>
              <div className="flex-1">
                <input
                  name="stateCode"
                  value={values.stateCode}
                  readOnly
                  placeholder="Auto-filled on state select"
                  className="w-full border-b-2 border-gray-200 bg-gray-50 py-1.5 text-sm focus:outline-none text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 max-w-md">
              <label className="w-28 text-sm font-medium text-gray-700">
                Pincode
              </label>
              <div className="flex-1">
                <input
                  name="pincode"
                  value={values.pincode}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="PIN code"
                  className={inputClass("pincode")}
                />
              </div>
            </div>

          </div>
        </div>

        <div className="flex justify-end pt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            className="shadow-sm ml-3 bg-gray-200 hover:bg-gray-300 text-gray-700"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="shadow-sm ml-3 bg-green-600 hover:bg-green-700 text-white"
          >
            {isPending
              ? "Saving..."
              : isEdit
              ? "Update Party"
              : "Save Party"}
          </Button>
        </div>
      </form> */}
      <form
        id={CUSTOMER_FORM_ID}
        onSubmit={handleSubmit}
        className="bg-white px-2 py-4 space-y-10"
      >
        {/* Party Type — hidden in modal (type preset by caller) */}
        {!modalMode && (
          <FormRadio
            label="Party Type"
            name="type"
            value={values.type}
            onChange={handlePartyTypeChange}
            options={[
              {
                value: "sales",
                label: "Sales Customer",
              },
              {
                value: "purchase",
                label: "Purchase Party",
              },
            ]}
          />
        )}

        {/* Basic Info */}
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">
            Basic Info
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
            <FormText
              label="Name"
              name="name"
              value={values.name}
              placeholder="Party name"
              required
              error={errors.name}
              touched={touched.name}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <FormText
              label="Phone"
              name="phone"
              value={values.phone}
              placeholder="Phone number"
              required
              error={errors.phone}
              touched={touched.phone}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <FormText
              label="Email"
              name="email"
              type="email"
              value={values.email}
              placeholder="Email address"
              error={errors.email}
              touched={touched.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <FormText
              label="GSTIN"
              name="gstin"
              value={values.gstin}
              placeholder="GST number (optional)"
              error={errors.gstin}
              touched={touched.gstin}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            {values.type === "sales" && (
              <FormSelect
                label="Customer Type"
                name="customerType"
                value={values.customerType}
                required
                error={errors.customerType}
                touched={touched.customerType}
                onChange={handleChange}
                onBlur={handleBlur}
                options={[
                  {
                    label: "Retail",
                    value: "retail",
                  },
                  {
                    label: "Wholesale",
                    value: "wholesale",
                  },
                ]}
              />
            )}

            {values.type === "sales" && (
              <FormNumber
                label="Credit Limit"
                name="creditLimit"
                value={values.creditLimit}
                placeholder="0"
                min={0}
                error={errors.creditLimit as string}
                touched={touched.creditLimit}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={(e) => {
                  if (["-", "e", "E", "+"].includes(e.key))
                    e.preventDefault();
                }}
              />
            )}
          </div>
        </div>

        {/* Address */}
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">
            Address
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
            <FormText
              label="Line 1"
              name="line1"
              value={values.line1}
              placeholder="Street address"
              error={errors.line1}
              touched={touched.line1}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <FormText
              label="Line 2"
              name="line2"
              value={values.line2}
              placeholder="Apartment, suite, etc."
              error={errors.line2}
              touched={touched.line2}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <FormText
              label="Place"
              name="place"
              value={values.place}
              placeholder="Locality / Area"
              error={errors.place}
              touched={touched.place}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <FormText
              label="City"
              name="city"
              value={values.city}
              placeholder="City"
              error={errors.city}
              touched={touched.city}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <FormSelect
              label="State"
              name="state"
              value={values.state}
              onChange={handleStateChange}
              onBlur={handleBlur}
              options={INDIAN_STATES.map((s) => ({
                label: s.name,
                value: s.name,
              }))}
              placeholder="Select state"
            />

            <FormText
              label="State Code"
              name="stateCode"
              value={values.stateCode}
              placeholder="Auto-filled on state select"
              onChange={() => {}}
              onBlur={() => {}}
              disabled
            />

            <FormText
              label="Pincode"
              name="pincode"
              value={values.pincode}
              placeholder="PIN code"
              error={errors.pincode}
              touched={touched.pincode}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
