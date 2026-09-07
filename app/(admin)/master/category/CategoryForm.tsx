// "use client";

// import { useFormik } from "formik";
// import * as Yup from "yup";
// import PageHeader from "@/app/utils/PageHeader";
// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";

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
//         title={isEdit ? "Edit Product" : "Add Product"}
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
//               <span className="text-red-500">*</span> Name
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
//           <div className="flex items-center gap-4 max-w-md">
//             <label className="w-28 text-sm font-medium text-gray-700">
//               <span className="text-red-500">*</span> Category
//             </label>

//             <div className="flex-1">
//               <input
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
//               />

//               {touched.category && errors.category && (
//                 <p className="text-red-500 text-xs mt-1">{errors.category}</p>
//               )}
//             </div>
//           </div>

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
//           </div>

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
//               <span className="text-red-500">*</span> Stock
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
import { CATEGORY_FORM_ID } from "@/app/utilsComponents/form-footer";
import { useRouter } from "next/navigation";
import {
  useCreateItemCategory,
  useItemCategory,
  useUpdateItemCategory,
} from "@/app/hooks/masterHooks/itemCategoryHook/useItemCategory";
import { colors } from "../../../utilsComponents/Colors";
import FormInput from "@/app/formComponents/FormText";
import FormTextarea from "@/app/formComponents/FormTextArea";
import FormCheckbox from "@/app/formComponents/FormCheckBox";
import React from "react";

interface CategoryFormProps {
  initialValues?: {
    name: string;
    description: string;
    isActive: boolean;
  };
  editId?: string;
  isEdit?: boolean;
  modalMode?: boolean;
  onSuccess?: (data: unknown) => void;
  onPendingChange?: (pending: boolean) => void;
}

const CategoryForm = ({
  initialValues,
  editId,
  isEdit = false,
  modalMode = false,
  onSuccess,
  onPendingChange,
}: CategoryFormProps) => {
  const router = useRouter();
  const { mutate: create, isPending: creating } = useCreateItemCategory();
  const { mutate: update, isPending: updating } = useUpdateItemCategory();

  // console.log("Category Data:", data, editId);

  const isPending = creating || updating;

  useEffect(() => {
    onPendingChange?.(isPending);
  }, [isPending, onPendingChange]);

  const formik = useFormik({
    initialValues: initialValues || {
      name: "",
      description: "",
      isActive: true,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Category name is required"),
      description: Yup.string(),
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

  const { handleChange, handleBlur, values, errors, touched, handleSubmit } =
    formik;

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
          title={isEdit ? "Edit Category" : "Add Category"}
          description="Enter category details"
        />
      )}

      <form id={CATEGORY_FORM_ID} onSubmit={handleSubmit} className="bg-white px-2 py-4 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
          <FormInput
            label="Name"
            name="name"
            value={values.name}
            placeholder="Enter category name"
            required
            error={errors.name}
            touched={touched.name}
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

          {/* Active Checkbox */}
          <FormCheckbox
            label="Active"
            name="isActive"
            checked={values.isActive}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {/* <div className="flex items-center gap-4 max-w-md mt-4">
            <label className="w-28 text-sm font-medium text-gray-700">
              Active
            </label>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={values.isActive}
                onChange={handleChange}
                onBlur={handleBlur}
                className="h-4 w-4 rounded border-gray-300"
              />
            </div>
          </div> */}
        </div>

      </form>
    </div>
  );
};
export default React.memo(CategoryForm);
