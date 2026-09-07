// // "use client";

// // import { useFormik } from "formik";
// // import * as Yup from "yup";
// // import PageHeader from "@/app/utils/PageHeader";
// // import { Button } from "@/components/ui/button";
// // import { useRouter } from "next/navigation";
// // import { colors } from "../../utilDatas/Colors";
// // import { useItemCategories } from "@/app/hooks/master/itemCategory/useItemCategory";
// // import { useCreateItem, useUpdateItem } from "@/app/hooks/master/item/useItem";

// // interface ProductFormProps {
// //   initialValues?: {
// //     name: string;
// //     price: string;
// //     category: string;
// //     stock: string;
// //     description: string;
// //   };
// //   onSubmit: (values: any) => void;
// //   isEdit?: boolean;
// //   editId?: string;
// // }

// // const categoryOptions = [
// //   "Electronics",
// //   "Clothing",
// //   "Food",
// //   "Furniture",
// //   "Books",
// // ];
// // export default function ProductForm({
// //   initialValues,
// //   onSubmit,
// //   isEdit = false,
// //   editId,
// // }: ProductFormProps) {
// //   const router = useRouter();
// //   const { mutate: create, isPending: creating } = useCreateItem();
// //   const { mutate: update, isPending: updating } = useUpdateItem();
// //   const { data, isLoading, isError } = useItemCategories({});

// //   // console.log("Category Data:", data, editId);

// //   const isPending = creating || updating;

// //   const formik = useFormik({
// //     initialValues: initialValues || {
// //       name: "",
// //       price: "",
// //       category: "",
// //       stock: "",
// //       description: "",
// //     },
// //     validationSchema: Yup.object({
// //       name: Yup.string().required("Required"),
// //       price: Yup.number().required("Required"),
// //       category: Yup.string().required("Required"),
// //       stock: Yup.number().required("Required"),
// //     }),
// //     enableReinitialize: true,
// //     validateOnChange: true,
// //     validateOnBlur: true,
// //     // onSubmit: (values) => {
// //     //   if (isEdit && editId) {
// //     //     update(
// //     //       { id: editId, payload: values },
// //     //       { onSuccess: () => router.back() }
// //     //     );
// //     //   } else {
// //     //     create(values, { onSuccess: () => router.back() });
// //     //   }
// //     // },
// //     onSubmit: (values) => {
// //       const payload = {
// //         ...values,
// //         price: Number(values.price),
// //         stock: Number(values.stock),
// //         unit: "pcs", // or get this from a form field if needed
// //         taxPercent: 0, // or get this from a form field if needed
// //         categoryId: values.category,
// //       };

// //       if (isEdit && editId) {
// //         update({ id: editId, payload }, { onSuccess: () => router.back() });
// //       } else {
// //         create(payload, { onSuccess: () => router.back() });
// //       }
// //     },
// //   });

// //   const { handleChange, handleBlur, values, errors, touched, handleSubmit } =
// //     formik;

// //   return (
// //     <div className="w-full mx-auto p-5">
// //       {/* Header */}
// //       <PageHeader
// //         title={isEdit ? "Edit Product" : "Add Product"}
// //         description="Enter product details"
// //       />

// //       {/* Form */}
// //       <form onSubmit={handleSubmit} className="bg-white px-2 py-4 space-y-8">
// //         {/* 🔥 Two Column Layout */}
// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
// //           {/* Name */}
// //           {/* <div className="flex items-center gap-4">
// //             <label className="w-32 text-sm text-gray-600">Name</label>
// //             <div className="flex-1">
// //               <input
// //                 name="name"
// //                 value={values.name}
// //                 onChange={handleChange}
// //                 onBlur={handleBlur}
// //                 className={`w-full border-b py-1 outline-none bg-transparent ${
// //                   touched.name && errors.name
// //                     ? "border-red-500"
// //                     : "border-gray-300 focus:border-blue-600"
// //                 }`}
// //               />
// //               {touched.name && errors.name && (
// //                 <p className="text-red-500 text-xs mt-1">
// //                   {errors.name}
// //                 </p>
// //               )}
// //             </div>
// //           </div> */}
// //           <div className="flex items-center gap-4 max-w-md">
// //             <label className="w-28 text-sm font-medium text-gray-700">
// //               <span className="text-red-500">*</span> Name
// //             </label>

// //             <div className="flex-1">
// //               <input
// //                 name="name"
// //                 value={values.name}
// //                 onChange={handleChange}
// //                 onBlur={handleBlur}
// //                 placeholder="Enter product name"
// //                 className={`w-full border-b-2 bg-transparent py-1.5 text-sm transition-all duration-200
// //         ${
// //           touched.name && errors.name
// //             ? "border-red-500 focus:border-red-500"
// //             : "border-gray-300 focus:border-blue-600"
// //         }
// //         focus:outline-none`}
// //               />

// //               {touched.name && errors.name && (
// //                 <p className="text-red-500 text-xs mt-1">{errors.name}</p>
// //               )}
// //             </div>
// //           </div>

// //           {/* Category */}
// //           <div className="flex items-center gap-4 max-w-md">
// //             <label className="w-28 text-sm font-medium text-gray-700">
// //               <span className="text-red-500">*</span> Category
// //             </label>

// //             <div className="flex-1">
// //               <select
// //                 name="category"
// //                 value={values.category}
// //                 onChange={handleChange}
// //                 onBlur={handleBlur}
// //                 className={`w-full border-b-2 bg-transparent py-1.5 text-sm transition-all duration-200
// //         ${
// //           touched.category && errors.category
// //             ? "border-red-500 focus:border-red-500"
// //             : "border-gray-300 focus:border-blue-600"
// //         }
// //         focus:outline-none`}
// //               >
// //                 <option value="">Select category</option>
// //                 {data?.data?.map((cat: any) => (
// //                   <option key={cat._id} value={cat._id}>
// //                     {cat.name}
// //                   </option>
// //                 ))}
// //               </select>

// //               {touched.category && errors.category && (
// //                 <p className="text-red-500 text-xs mt-1">{errors.category}</p>
// //               )}
// //             </div>
// //           </div>
// //           {/* <div className="flex items-center gap-4">
// //             <label className="w-32 text-sm text-gray-600">Category</label>
// //             <div className="flex-1">
// //               <input
// //                 name="category"
// //                 value={values.category}
// //                 onChange={handleChange}
// //                 onBlur={handleBlur}
// //                 className={`w-full border-b py-1 outline-none bg-transparent ${
// //                   touched.category && errors.category
// //                     ? "border-red-500"
// //                     : "border-gray-300 focus:border-blue-600"
// //                 }`}
// //               />
// //               {touched.category && errors.category && (
// //                 <p className="text-red-500 text-xs mt-1">{errors.category}</p>
// //               )}
// //             </div>
// //           </div> */}
// //           {/* <div className="flex items-center gap-4 max-w-md">
// //             <label className="w-28 text-sm font-medium text-gray-700">
// //               <span className="text-red-500">*</span> Category
// //             </label>

// //             <div className="flex-1">
// //               <input
// //                 name="category"
// //                 value={values.category}
// //                 onChange={handleChange}
// //                 onBlur={handleBlur}
// //                 placeholder="Enter category"
// //                 className={`w-full border-b-2 bg-transparent py-1.5 text-sm transition-all duration-200
// //         ${
// //           touched.category && errors.category
// //             ? "border-red-500 focus:border-red-500"
// //             : "border-gray-300 focus:border-blue-600"
// //         }
// //         focus:outline-none`}
// //               />

// //               {touched.category && errors.category && (
// //                 <p className="text-red-500 text-xs mt-1">{errors.category}</p>
// //               )}
// //             </div>
// //           </div> */}

// //           {/* Price */}
// //           {/* <div className="flex items-center gap-4">
// //             <label className="w-32 text-sm text-gray-600">Price</label>
// //             <div className="flex-1">
// //               <input
// //                 type="number"
// //                 name="price"
// //                 value={values.price}
// //                 onChange={handleChange}
// //                 onBlur={handleBlur}
// //                 className={`w-full border-b py-1 outline-none bg-transparent ${
// //                   touched.price && errors.price
// //                     ? "border-red-500"
// //                     : "border-gray-300 focus:border-blue-600"
// //                 }`}
// //               />
// //               {touched.price && errors.price && (
// //                 <p className="text-red-500 text-xs mt-1">{errors.price}</p>
// //               )}
// //             </div>
// //           </div> */}
// //           <div className="flex items-center gap-4 max-w-md">
// //             <label className="w-28 text-sm font-medium text-gray-700">
// //               <span className="text-red-500">*</span> Price
// //             </label>

// //             <div className="flex-1">
// //               <input
// //                 type="number"
// //                 name="price"
// //                 value={values.price}
// //                 onChange={handleChange}
// //                 onBlur={handleBlur}
// //                 placeholder="Enter price"
// //                 className={`w-full border-b-2 bg-transparent py-1.5 text-sm transition-all duration-200
// //         ${
// //           touched.price && errors.price
// //             ? "border-red-500 focus:border-red-500"
// //             : "border-gray-300 focus:border-blue-600"
// //         }
// //         focus:outline-none`}
// //               />

// //               {touched.price && errors.price && (
// //                 <p className="text-red-500 text-xs mt-1">{errors.price}</p>
// //               )}
// //             </div>
// //           </div>

// //           {/* Stock */}
// //           {/* <div className="flex items-center gap-4">
// //             <label className="w-32 text-sm text-gray-600">Stock</label>
// //             <div className="flex-1">
// //               <input
// //                 type="number"
// //                 name="stock"
// //                 value={values.stock}
// //                 onChange={handleChange}
// //                 onBlur={handleBlur}
// //                 className={`w-full border-b py-1 outline-none bg-transparent ${
// //                   touched.stock && errors.stock
// //                     ? "border-red-500"
// //                     : "border-gray-300 focus:border-blue-600"
// //                 }`}
// //               />
// //               {touched.stock && errors.stock && (
// //                 <p className="text-red-500 text-xs mt-1">{errors.stock}</p>
// //               )}
// //             </div>
// //           </div> */}
// //           <div className="flex items-center gap-4 max-w-md">
// //             <label className="w-28 text-sm font-medium text-gray-700">
// //               <span className="text-red-500">*</span> Stock
// //             </label>

// //             <div className="flex-1">
// //               <input
// //                 type="number"
// //                 name="stock"
// //                 value={values.stock}
// //                 onChange={handleChange}
// //                 onBlur={handleBlur}
// //                 placeholder="Enter stock"
// //                 className={`w-full border-b-2 bg-transparent py-1.5 text-sm transition-all duration-200
// //         ${
// //           touched.stock && errors.stock
// //             ? "border-red-500 focus:border-red-500"
// //             : "border-gray-300 focus:border-blue-600"
// //         }
// //         focus:outline-none`}
// //               />

// //               {touched.stock && errors.stock && (
// //                 <p className="text-red-500 text-xs mt-1">{errors.stock}</p>
// //               )}
// //             </div>
// //           </div>
// //         </div>

// //         {/* Actions */}
// //         <div className="flex justify-end pt-6">
// //           <Button
// //             type="button"
// //             variant="ghost"
// //             onClick={() => router.back()}
// //             className={`shadow-sm ml-3 ${colors.mainColor} hover:bg-green-700 text-white`}
// //           >
// //             Cancel
// //           </Button>

// //           <Button
// //             type="submit"
// //             className={`shadow-sm ml-3 ${colors.mainColor} hover:bg-green-700 text-white`}
// //           >
// //             {isEdit ? "Update Product" : "Save Product"}
// //           </Button>
// //         </div>
// //       </form>
// //     </div>
// //   );
// // }
// "use client";

// import { useFormik } from "formik";
// import * as Yup from "yup";
// import PageHeader from "@/app/utilsComponents/PageHeader";
// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";
// import { colors } from "../../utilDatas/Colors";
// import { useItemCategories } from "@/app/hooks/master/itemCategory/useItemCategory";
// import { useCreateItem, useUpdateItem } from "@/app/hooks/master/item/useItem";
// import { useUoms } from "@/app/hooks/master/uom/useUom";
// import { percentageField, positiveNumber } from "../../utilDatas/Validations";

// interface ProductFormProps {
//   initialValues?: {
//     name: string;
//     code: string;
//     uomId: string;
//     price: number | string;
//     stock: number | string;
//     taxPercent: number | string;
//     categoryId: string;
//     description: string;
//     isActive: boolean;
//   };
//   isEdit?: boolean;
//   editId?: string;
// }

// export default function ProductForm({
//   initialValues,
//   isEdit = false,
//   editId,
// }: ProductFormProps) {
//   const router = useRouter();

//   const { mutate: create, isPending: creating } = useCreateItem();
//   const { mutate: update, isPending: updating } = useUpdateItem();

//   const { data: categoryData } = useItemCategories({});
//   const { data: uomData } = useUoms({ limit: 100, isActive: true });
//   const uoms = uomData?.data ?? [];
//   const categories = categoryData?.data ?? [];

//   const isPending = creating || updating;

//   const formik = useFormik({
//     initialValues: initialValues || {
//       name: "",
//       code: "",
//       uomId: "",
//       price: 0,
//       taxPercent: 0,
//       categoryId: "",
//       description: "",
//       isActive: true,
//     },

//     enableReinitialize: true,

//     validationSchema: Yup.object({
//       name: Yup.string().required("Required"),
//       // price: Yup.number().required("Required"),
//       price: positiveNumber, // ← reusable
//       taxPercent: percentageField,
//       categoryId: Yup.string().required("Required"),
//     }),

//     onSubmit: (values) => {
//       const payload = {
//         ...values,
//         price: Number(values.price),
//         taxPercent: Number(values.taxPercent),
//       };

//       if (isEdit && editId) {
//         update(
//           { id: editId, payload },
//           {
//             onSuccess: () => router.back(),
//           }
//         );
//       } else {
//         create(payload, {
//           onSuccess: () => router.back(),
//         });
//       }
//     },
//   });

//   const { handleChange, handleBlur, handleSubmit, values, errors, touched } =
//     formik;

//   return (
//     <div className="w-full mx-auto p-5">
//       <PageHeader
//         title={isEdit ? "Edit Product" : "Add Product"}
//         description="Enter product details"
//       />

//       <form onSubmit={handleSubmit} className="bg-white px-2 py-4 space-y-8">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
//           {/* Name */}
//           <div className="flex items-center gap-4 max-w-md">
//             <label className="w-28 text-sm font-medium text-gray-700">
//               <span className="text-red-500">*</span>Name
//             </label>

//             <div className="flex-1">
//               <input
//                 name="name"
//                 value={values.name}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 placeholder="Enter product name"
//                 className="w-full border-b-2 border-gray-300 bg-transparent py-1.5 text-sm focus:outline-none focus:border-blue-600"
//               />

//               {touched.name && errors.name && (
//                 <p className="text-red-500 text-xs mt-1">{errors.name}</p>
//               )}
//             </div>
//           </div>

//           {/* Category */}
//           <div className="flex items-center gap-4 max-w-md">
//             <label className="w-28 text-sm font-medium text-gray-700">
//               <span className="text-red-500">*</span>Category
//             </label>

//             <div className="flex-1">
//               <select
//                 name="categoryId"
//                 value={values.categoryId}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 className="w-full border-b-2 border-gray-300 bg-transparent py-1.5 text-sm focus:outline-none focus:border-blue-600"
//               >
//                 <option value="">Select category</option>

//                 {categories?.map((cat: any) => (
//                   <option key={cat._id} value={cat._id}>
//                     {cat.name}
//                   </option>
//                 ))}
//               </select>

//               {touched.categoryId && errors.categoryId && (
//                 <p className="text-red-500 text-xs mt-1">{errors.categoryId}</p>
//               )}
//             </div>
//           </div>

//           {/* Price */}
//           <div className="flex items-center gap-4 max-w-md">
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
//                 className="w-full border-b-2 border-gray-300 bg-transparent py-1.5 text-sm focus:outline-none focus:border-blue-600"
//               />

//               {touched.price && errors.price && (
//                 <p className="text-red-500 text-xs mt-1">{errors.price}</p>
//               )}
//             </div>
//           </div>

//           {/* Stock */}
//           {/* <div className="flex items-center gap-4 max-w-md">
//             <label className="w-28 text-sm font-medium text-gray-700">
//               Stock
//             </label>

//             <div className="flex-1">
//               <input
//                 type="number"
//                 name="stock"
//                 value={values.stock}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 placeholder="Enter stock"
//                 className="w-full border-b-2 border-gray-300 bg-transparent py-1.5 text-sm focus:outline-none focus:border-blue-600"
//               />

//               {touched.stock && errors.stock && (
//                 <p className="text-red-500 text-xs mt-1">
//                   {errors.stock}
//                 </p>
//               )}
//             </div>
//           </div> */}
//           <div className="flex items-center gap-4 max-w-md">
//             <label className="w-28 text-sm font-medium text-gray-700">
//               <span className="text-red-500">*</span> Unit
//             </label>
//             <div className="flex-1">
//               <select
//                 name="uomId"
//                 value={values.uomId}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 className="w-full border-b-2 border-gray-300 focus:border-blue-600 bg-transparent py-1.5 text-sm focus:outline-none"
//               >
//                 <option value="">Select unit</option>
//                 {uoms.map((uom) => (
//                   <option key={uom._id} value={uom._id}>
//                     {uom.name} ({uom.shortCode}) {/* Kilogram (kg) */}
//                   </option>
//                 ))}
//               </select>
//               {touched.uomId && errors.uomId && (
//                 <p className="text-red-500 text-xs mt-1">{errors.uomId}</p>
//               )}
//             </div>
//           </div>

//           {/* Tax Percent */}
//           <div className="flex items-center gap-4 max-w-md">
//             <label className="w-28 text-sm font-medium text-gray-700">
//               <span className="text-red-500">*</span>Tax %
//             </label>

//             <div className="flex-1">
//               <input
//                 type="number"
//                 name="taxPercent"
//                 value={values.taxPercent}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 placeholder="Enter tax %"
//                 className="w-full border-b-2 border-gray-300 bg-transparent py-1.5 text-sm focus:outline-none focus:border-blue-600"
//               />
//             </div>
//           </div>

//           {/* Description */}
//           <div className="flex items-center gap-4 max-w-md">
//             <label className="w-28 text-sm font-medium text-gray-700">
//               Description
//             </label>

//             <div className="flex-1">
//               <textarea
//                 name="description"
//                 value={values.description}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 placeholder="Enter description"
//                 className="w-full border-b-2 border-gray-300 bg-transparent py-1.5 text-sm focus:outline-none focus:border-blue-600"
//               />
//             </div>
//           </div>
//         </div>

//         <div className="flex justify-end pt-6">
//           <Button
//             type="button"
//             variant="ghost"
//             onClick={() => router.back()}
//             className={`shadow-sm ml-3 ${colors.mainColor} hover:bg-green-700 text-white`}
//           >
//             Cancel
//           </Button>

//           <Button
//             type="submit"
//             disabled={isPending}
//             className={`shadow-sm ml-3 ${colors.mainColor} hover:bg-green-700 text-white`}
//           >
//             {isEdit ? "Update Product" : "Save Product"}
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import PageHeader from "@/app/utilsComponents/PageHeader";
import { PRODUCT_FORM_ID } from "@/app/utilsComponents/form-footer";
import { useRouter } from "next/navigation";
import {
  useCreateItem,
  useUpdateItem,
} from "@/app/hooks/masterHooks/itemHook/useItem";
import { loadCategories, loadUoms } from "@/app/formComponents/masterLoadOptions";
import { toOption, type SelectOption } from "@/app/formComponents/selectTypes";
import {
  percentageField,
  positiveNumber,
} from "../../../utilsComponents/Validations";
import FormSelectWithAdd from "@/app/formComponents/FormSelectWithAdd";
import FormNumberInput from "@/app/formComponents/FormNumber";
import FormTextarea from "@/app/formComponents/FormTextArea";
import FormInput from "@/app/formComponents/FormText";
import QuickAddDialog from "@/app/utilsComponents/QuickAddDialog";
import CategoryForm from "@/app/(admin)/master/category/CategoryForm";
import UOMForm from "@/app/(admin)/master/uom/UOMForm";
import {
  categoryFormFooterButtons,
  uomFormFooterButtons,
} from "@/app/utilsComponents/form-footer";
import { getEntityId } from "@/app/utilsComponents/InvoiceQuickAddModals";
import React from "react";

interface ProductFormProps {
  initialValues?: {
    name: string;
    code: string;
    hsnCode: string;
    uomId: string;
    salesRate: number | string;
    purchaseRate: number | string;
    price: number | string;
    taxPercent: number | string;
    categoryId: string;
    description: string;
    isActive: boolean;
  };
  isEdit?: boolean;
  editId?: string;
  modalMode?: boolean;
  onSuccess?: (data: unknown) => void;
  onPendingChange?: (pending: boolean) => void;
}

// ── Block negative keys on number inputs ──────────────────────
const blockNegative = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "-" || e.key === "e" || e.key === "E" || e.key === "+") {
    e.preventDefault();
  }
};

const ProductForm = ({
  initialValues,
  isEdit = false,
  editId,
  modalMode = false,
  onSuccess,
  onPendingChange,
}: ProductFormProps) => {
  const router = useRouter();
  const [categoryModal, setCategoryModal] = useState(false);
  const [uomModal, setUomModal] = useState(false);
  const [nestedPending, setNestedPending] = useState(false);
  const [categoryOption, setCategoryOption] = useState<SelectOption | null>(
    null
  );
  const [uomOption, setUomOption] = useState<SelectOption | null>(null);

  const { mutate: create, isPending: creating } = useCreateItem();
  const { mutate: update, isPending: updating } = useUpdateItem();

  const isPending = creating || updating;

  useEffect(() => {
    onPendingChange?.(isPending);
  }, [isPending, onPendingChange]);

  const formik = useFormik({
    initialValues: initialValues
      ? {
          ...initialValues,
          hasGst: Number(initialValues.taxPercent) > 0 ? "yes" : "no",
        }
      : {
      name: "",
      code: "",
      hsnCode: "",
      uomId: "",
      salesRate: "",
      purchaseRate: "",
      price: "",
      taxPercent: 18,
      hasGst: "no" as "yes" | "no",
      categoryId: "",
      description: "",
      isActive: true,
    },

    enableReinitialize: true,

    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      hsnCode: Yup.string().required("HSN Code is required"),
      salesRate: positiveNumber,
      purchaseRate: positiveNumber,
      hasGst: Yup.string().oneOf(["yes", "no"]),
      taxPercent: Yup.number().when("hasGst", {
        is: "yes",
        then: (schema) => schema.min(0.01, "Enter GST %").max(100),
        otherwise: (schema) => schema.min(0).max(100),
      }),
      categoryId: Yup.string().required("Category is required"),
      uomId: Yup.string().required("Unit is required"),
      code: Yup.string(),
      description: Yup.string(),
    }),

    onSubmit: (values) => {
      const payload = {
        name: values.name,
        code: values.code,
        hsnCode: values.hsnCode,
        uomId: values.uomId,
        salesRate: Number(values.salesRate),
        purchaseRate: Number(values.purchaseRate),
        price: Number(values.salesRate),
        taxPercent: values.hasGst === "yes" ? Number(values.taxPercent) : 0,
        categoryId: values.categoryId,
        description: values.description,
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

  const {
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
  } = formik;

  return (
    <div className={`w-full mx-auto ${modalMode ? "p-2" : "p-5"}`}>
      {!modalMode && (
        <PageHeader
          title={isEdit ? "Edit Product" : "Add Product"}
          description="Enter product details"
        />
      )}

      <form
        id={PRODUCT_FORM_ID}
        onSubmit={handleSubmit}
        className="bg-white px-2 py-4 space-y-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
          <FormInput
            label="Name"
            name="name"
            value={values.name}
            placeholder="Enter product name"
            required
            error={errors.name}
            touched={touched.name}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <FormInput
            label="Hsn Code"
            name="hsnCode"
            value={values.hsnCode}
            placeholder="Enter HSN code"
            required
            error={errors.hsnCode}
            touched={touched.hsnCode}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <FormSelectWithAdd
            label="Category"
            value={values.categoryId}
            selectedOption={categoryOption}
            required
            error={errors.categoryId}
            touched={touched.categoryId}
            loadOptions={loadCategories}
            placeholder="Search category..."
            addLabel="Add Category"
            onAddClick={() => setCategoryModal(true)}
            onValueChange={(id, opt) => {
              setFieldValue("categoryId", id);
              setCategoryOption(opt);
            }}
            onBlur={() => setFieldTouched("categoryId", true)}
          />

          <FormNumberInput
            label="Purchase Rate"
            name="purchaseRate"
            value={values.purchaseRate}
            placeholder="Enter purchase rate"
            required
            error={errors.purchaseRate}
            touched={touched.purchaseRate}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={blockNegative}
          />


          <FormNumberInput
            label="Sales Rate"
            name="salesRate"
            value={values.salesRate}
            placeholder="Enter sales rate"
            required
            error={errors.salesRate}
            touched={touched.salesRate}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={blockNegative}
          />

          <FormNumberInput
            label="Profit Percentage"
            name="purchaseRate"
            value={values.purchaseRate}
            placeholder="Enter purchase rate"
            required
            error={errors.purchaseRate}
            touched={touched.purchaseRate}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={blockNegative}
          />


          
          <FormSelectWithAdd
            label="Unit"
            value={values.uomId}
            selectedOption={uomOption}
            required
            error={errors.uomId}
            touched={touched.uomId}
            loadOptions={loadUoms}
            placeholder="Search unit..."
            addLabel="Add UOM"
            onAddClick={() => setUomModal(true)}
            onValueChange={(id, opt) => {
              setFieldValue("uomId", id);
              setUomOption(opt);
            }}
            onBlur={() => setFieldTouched("uomId", true)}
          />

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              GST Applicable
            </label>
            <div className="flex flex-wrap gap-2">
              {(["no", "yes"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setFieldValue("hasGst", option);
                    if (option === "no") {
                      setFieldValue("taxPercent", 0);
                    } else if (!Number(values.taxPercent)) {
                      setFieldValue("taxPercent", 18);
                    }
                  }}
                  className={`rounded-md border px-4 py-2 text-sm font-medium transition ${
                    values.hasGst === option
                      ? "border-black bg-black text-white"
                      : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {option === "yes" ? "Yes" : "No"}
                </button>
              ))}
            </div>
          </div>

          {values.hasGst === "yes" && (
            <FormNumberInput
              label="GST %"
              name="taxPercent"
              value={values.taxPercent}
              placeholder="18"
              required
              error={errors.taxPercent}
              touched={touched.taxPercent}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={blockNegative}
            />
          )}

          <FormInput
            label="Item Code"
            name="code"
            value={values.code}
            placeholder="Item Code (optional)"
            error={errors.code}
            touched={touched.code}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <FormTextarea
            label="Description"
            name="description"
            value={values.description}
            placeholder="Enter description (optional)"
            error={errors.description}
            touched={touched.description}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>
      </form>

      <QuickAddDialog
        open={categoryModal}
        onOpenChange={setCategoryModal}
        title="Add Category"
        footerButtons={categoryFormFooterButtons({
          isPending: nestedPending,
          onCancel: () => setCategoryModal(false),
        })}
      >
        <CategoryForm
          modalMode
          onPendingChange={setNestedPending}
          onSuccess={(data) => {
            const id = getEntityId(data);
            const c = data as { name?: string };
            setFieldValue("categoryId", id);
            setCategoryOption(toOption(id, c.name ?? "Category", data));
            setCategoryModal(false);
          }}
        />
      </QuickAddDialog>

      <QuickAddDialog
        open={uomModal}
        onOpenChange={setUomModal}
        title="Add UOM"
        footerButtons={uomFormFooterButtons({
          isPending: nestedPending,
          onCancel: () => setUomModal(false),
        })}
      >
        <UOMForm
          modalMode
          onPendingChange={setNestedPending}
          onSuccess={(data) => {
            const id = getEntityId(data);
            const u = data as { name?: string; shortCode?: string };
            const label = u.shortCode
              ? `${u.name} (${u.shortCode})`
              : (u.name ?? "UOM");
            setFieldValue("uomId", id);
            setUomOption(toOption(id, label, data));
            setUomModal(false);
          }}
        />
      </QuickAddDialog>
    </div>
  );
};
export default React.memo(ProductForm);
