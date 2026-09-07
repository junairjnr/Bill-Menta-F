// // "use client";

// // import { FieldArray, FormikProvider, useFormik } from "formik";
// // import * as Yup from "yup";

// // interface InvoiceItem {
// //   itemName: string;
// //   qty: number;
// //   price: number;
// // }

// // interface FormValues {
// //   invoices: InvoiceItem[];
// // }

// // export default function ProductInvoiceForm() {
// //   const formik = useFormik<FormValues>({
// //     initialValues: {
// //       invoices: [
// //         {
// //           itemName: "",
// //           qty: 1,
// //           price: 0,
// //         },
// //       ],
// //     },

// //     validationSchema: Yup.object({
// //       invoices: Yup.array().of(
// //         Yup.object({
// //           itemName: Yup.string().required("Required"),
// //           qty: Yup.number().required(),
// //           price: Yup.number().required(),
// //         })
// //       ),
// //     }),

// //     onSubmit: (values) => {
// //       console.log(values);
// //     },
// //   });

// //   return (
// //     <FormikProvider value={formik}>
// //       <form onSubmit={formik.handleSubmit} className="space-y-4">
// //       <FieldArray
// //   name="items"
// //   render={(arrayHelpers) => (
// //     <div className="space-y-3 overflow-x-auto">
// //       {/* Header */}
// //       <div className="grid grid-cols-12 gap-2 font-semibold min-w-[1600px]">
// //         <div>Sl No</div>
// //         <div>Item</div>
// //         <div>HSN</div>
// //         <div>UOM</div>
// //         <div>Price</div>
// //         <div>Rate (+18%)</div>
// //         <div>Qty</div>
// //         <div>Taxable</div>
// //         <div>IGST</div>
// //         <div>SGST</div>
// //         <div>CGST</div>
// //         <div>Action</div>
// //       </div>

// //       {formik.values.items.map((item, index) => {
// //         const rate = Number(item.price || 0) * 1.18;
// //         const taxable = rate * Number(item.qty || 0);

// //         const gst = taxable * 0.18;
// //         const sgst = gst / 2;
// //         const cgst = gst / 2;

// //         return (
// //           <div
// //             key={index}
// //             className="grid grid-cols-12 gap-2 items-center min-w-[1600px]"
// //           >
// //             {/* Serial */}
// //             <input
// //               type="text"
// //               value={index + 1}
// //               disabled
// //               className="border p-2 rounded"
// //             />

// //             {/* Item */}
// //             <input
// //               type="text"
// //               name={`items.${index}.item`}
// //               value={item.item}
// //               onChange={formik.handleChange}
// //               className="border p-2 rounded"
// //               placeholder="Item"
// //             />

// //             {/* HSN */}
// //             <input
// //               type="text"
// //               name={`items.${index}.hsn`}
// //               value={item.hsn}
// //               onChange={formik.handleChange}
// //               className="border p-2 rounded"
// //               placeholder="HSN"
// //             />

// //             {/* UOM */}
// //             <input
// //               type="text"
// //               name={`items.${index}.uom`}
// //               value={item.uom}
// //               onChange={formik.handleChange}
// //               className="border p-2 rounded"
// //               placeholder="UOM"
// //             />

// //             {/* Price */}
// //             <input
// //               type="number"
// //               name={`items.${index}.price`}
// //               value={item.price}
// //               onChange={formik.handleChange}
// //               className="border p-2 rounded"
// //               placeholder="Price"
// //             />

// //             {/* Rate */}
// //             <input
// //               type="number"
// //               value={rate.toFixed(2)}
// //               disabled
// //               className="border p-2 rounded bg-gray-100"
// //             />

// //             {/* Qty */}
// //             <input
// //               type="number"
// //               name={`items.${index}.qty`}
// //               value={item.qty}
// //               onChange={formik.handleChange}
// //               className="border p-2 rounded"
// //               placeholder="Qty"
// //             />

// //             {/* Taxable Value */}
// //             <input
// //               type="number"
// //               value={taxable.toFixed(2)}
// //               disabled
// //               className="border p-2 rounded bg-gray-100"
// //             />

// //             {/* IGST */}
// //             <input
// //               type="number"
// //               value={gst.toFixed(2)}
// //               disabled
// //               className="border p-2 rounded bg-gray-100"
// //             />

// //             {/* SGST */}
// //             <input
// //               type="number"
// //               value={sgst.toFixed(2)}
// //               disabled
// //               className="border p-2 rounded bg-gray-100"
// //             />

// //             {/* CGST */}
// //             <input
// //               type="number"
// //               value={cgst.toFixed(2)}
// //               disabled
// //               className="border p-2 rounded bg-gray-100"
// //             />

// //             {/* Remove */}
// //             <button
// //               type="button"
// //               onClick={() => arrayHelpers.remove(index)}
// //               className="bg-red-500 text-white px-3 py-2 rounded"
// //             >
// //               Remove
// //             </button>
// //           </div>
// //         );
// //       })}

// //       {/* Add Button */}
// //       <button
// //         type="button"
// //         onClick={() =>
// //           arrayHelpers.push({
// //             item: "",
// //             hsn: "",
// //             uom: "",
// //             price: 0,
// //             qty: 1,
// //           })
// //         }
// //         className="bg-blue-500 text-white px-4 py-2 rounded"
// //       >
// //         + Add Item
// //       </button>
// //     </div>
// //   )}
// // /> 

// //         <button
// //           type="submit"
// //           className="bg-green-600 text-white px-5 py-2 rounded"
// //         >
// //           Submit
// //         </button>
// //       </form>
// //     </FormikProvider>
// //   );
// // }
// "use client";

// import { FieldArray, FormikProvider, useFormik } from "formik";
// import * as Yup from "yup";

// interface InvoiceItem {
//   item: string;
//   hsn: string;
//   uom: string;
//   price: number;
//   qty: number;
// }

// interface FormValues {
//   items: InvoiceItem[];
// }

// export default function ProductInvoiceForm() {
//   const formik = useFormik<FormValues>({
//     initialValues: {
//       items: [
//         {
//           item: "",
//           hsn: "",
//           uom: "",
//           price: 0,
//           qty: 1,
//         },
//       ],
//     },

//     validationSchema: Yup.object({
//       items: Yup.array().of(
//         Yup.object({
//           item: Yup.string().required("Item is required"),
//           hsn: Yup.string().required("HSN is required"),
//           uom: Yup.string().required("UOM is required"),
//           price: Yup.number().required("Price is required"),
//           qty: Yup.number().required("Qty is required"),
//         })
//       ),
//     }),

//     onSubmit: (values) => {
//       console.log(values);
//     },
//   });

//   return (
//     <FormikProvider value={formik}>
//       <form
//         onSubmit={formik.handleSubmit}
//         className="space-y-4 p-4"
//       >
//         <FieldArray
//           name="items"
//           render={(arrayHelpers) => (
//             <div className="space-y-3 overflow-x-auto">
//               {/* Header */}
//               <div className="grid grid-cols-12 gap-2 font-semibold min-w-[1600px] bg-gray-100 p-3 rounded">
//                 <div>Sl No</div>
//                 <div>Item</div>
//                 <div>HSN</div>
//                 <div>UOM</div>
//                 <div>Price</div>
//                 <div>Rate</div>
//                 <div>Qty</div>
//                 <div>Taxable</div>
//                 <div>IGST</div>
//                 <div>SGST</div>
//                 <div>CGST</div>
//                 <div>Action</div>
//               </div>

//               {formik.values.items.map((item, index) => {
//                 const price = Number(item.price || 0);

//                 // Price + 18%
//                 const rate = price + price * 0.18;

//                 // Taxable Value
//                 const taxable = rate * Number(item.qty || 0);

//                 // GST Values
//                 const igst = taxable * 0.18;
//                 const sgst = igst / 2;
//                 const cgst = igst / 2;

//                 return (
//                   <div
//                     key={index}
//                     className="grid grid-cols-12 gap-2 items-center min-w-[1600px]"
//                   >
//                     {/* Serial Number */}
//                     <input
//                       type="text"
//                       value={index + 1}
//                       disabled
//                       className="border p-2 rounded bg-gray-100"
//                     />

//                     {/* Item */}
//                     <input
//                       type="text"
//                       name={`items.${index}.item`}
//                       value={item.item}
//                       onChange={formik.handleChange}
//                       className="border p-2 rounded"
//                       placeholder="Item"
//                     />

//                     {/* HSN */}
//                     <input
//                       type="text"
//                       name={`items.${index}.hsn`}
//                       value={item.hsn}
//                       onChange={formik.handleChange}
//                       className="border p-2 rounded"
//                       placeholder="HSN"
//                     />

//                     {/* UOM */}
//                     <input
//                       type="text"
//                       name={`items.${index}.uom`}
//                       value={item.uom}
//                       onChange={formik.handleChange}
//                       className="border p-2 rounded"
//                       placeholder="UOM"
//                     />

//                     {/* Price */}
//                     <input
//                       type="number"
//                       name={`items.${index}.price`}
//                       value={item.price}
//                       onChange={formik.handleChange}
//                       className="border p-2 rounded"
//                       placeholder="Price"
//                     />

//                     {/* Rate */}
//                     <input
//                       type="number"
//                       value={rate.toFixed(2)}
//                       disabled
//                       className="border p-2 rounded bg-gray-100"
//                     />

//                     {/* Qty */}
//                     <input
//                       type="number"
//                       name={`items.${index}.qty`}
//                       value={item.qty}
//                       onChange={formik.handleChange}
//                       className="border p-2 rounded"
//                       placeholder="Qty"
//                     />

//                     {/* Taxable Value */}
//                     <input
//                       type="number"
//                       value={taxable.toFixed(2)}
//                       disabled
//                       className="border p-2 rounded bg-gray-100"
//                     />

//                     {/* IGST */}
//                     <input
//                       type="number"
//                       value={igst.toFixed(2)}
//                       disabled
//                       className="border p-2 rounded bg-gray-100"
//                     />

//                     {/* SGST */}
//                     <input
//                       type="number"
//                       value={sgst.toFixed(2)}
//                       disabled
//                       className="border p-2 rounded bg-gray-100"
//                     />

//                     {/* CGST */}
//                     <input
//                       type="number"
//                       value={cgst.toFixed(2)}
//                       disabled
//                       className="border p-2 rounded bg-gray-100"
//                     />

//                     {/* Remove Button */}
//                     <button
//                       type="button"
//                       onClick={() => arrayHelpers.remove(index)}
//                       className="bg-red-500 text-white px-3 py-2 rounded"
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 );
//               })}

//               {/* Add Button */}
//               <button
//                 type="button"
//                 onClick={() =>
//                   arrayHelpers.push({
//                     item: "",
//                     hsn: "",
//                     uom: "",
//                     price: 0,
//                     qty: 1,
//                   })
//                 }
//                 className="bg-blue-500 text-white px-4 py-2 rounded"
//               >
//                 + Add Item
//               </button>
//             </div>
//           )}
//         />

//         {/* Submit Button */}
//         <button
//           type="submit"
//           className="bg-green-600 text-white px-5 py-2 rounded"
//         >
//           Submit
//         </button>
//       </form>
//     </FormikProvider>
//   );
// }

"use client";

import { FieldArray, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";

interface InvoiceItem {
  item: string;
  hsn: string;
  uom: string;
  price: number;
  qty: number;
}

interface FormValues {
  items: InvoiceItem[];
}

export default function ProductInvoiceForm() {
  const formik = useFormik<FormValues>({
    initialValues: {
      items: [
        {
          item: "",
          hsn: "",
          uom: "",
          price: 0,
          qty: 1,
        },
      ],
    },

    validationSchema: Yup.object({
      items: Yup.array().of(
        Yup.object({
          item: Yup.string().required("Item is required"),
          hsn: Yup.string().required("HSN is required"),
          uom: Yup.string().required("UOM is required"),
          price: Yup.number().required("Price is required"),
          qty: Yup.number().required("Qty is required"),
        })
      ),
    }),

    onSubmit: (values) => {
      console.log(values);
    },
  });

  // Grand Total
  const grandTotal = formik.values.items.reduce(
    (acc, item) => {
      const price = Number(item.price || 0);
      const qty = Number(item.qty || 0);

      const taxable = price * qty;

      const gst = taxable * 0.18;
      const total = taxable + gst;

      return acc + total;
    },
    0
  );

  return (
    <FormikProvider value={formik}>
      <form
        onSubmit={formik.handleSubmit}
        className="space-y-4 p-4"
      >
        <FieldArray
          name="items"
          render={(arrayHelpers) => (
            <div className="space-y-3 overflow-x-auto">
              {/* Header */}
              <div className="grid grid-cols-12 gap-2 font-semibold min-w-[1700px] bg-gray-100 p-3 rounded">
                <div>Sl No</div>
                <div>Item</div>
                <div>HSN</div>
                <div>UOM</div>
                <div>Price</div>
                <div>Qty</div>
                <div>Taxable</div>
                <div>SGST 9%</div>
                <div>CGST 9%</div>
                <div>Total</div>
                <div>Action</div>
              </div>

              {formik.values.items.map((item, index) => {
                const price = Number(item.price || 0);
                const qty = Number(item.qty || 0);

                // Taxable value
                const taxable = price * qty;

                // Kerala GST Split
                const sgst = taxable * 0.09;
                const cgst = taxable * 0.09;

                // Total
                const total = taxable + sgst + cgst;

                return (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-2 items-center min-w-[1700px]"
                  >
                    {/* Serial */}
                    <input
                      type="text"
                      value={index + 1}
                      disabled
                      className="border p-2 rounded bg-gray-100"
                    />

                    {/* Item */}
                    <input
                      type="text"
                      name={`items.${index}.item`}
                      value={item.item}
                      onChange={formik.handleChange}
                      className="border p-2 rounded"
                      placeholder="Item"
                    />

                    {/* HSN */}
                    <input
                      type="text"
                      name={`items.${index}.hsn`}
                      value={item.hsn}
                      onChange={formik.handleChange}
                      className="border p-2 rounded"
                      placeholder="HSN"
                    />

                    {/* UOM */}
                    <input
                      type="text"
                      name={`items.${index}.uom`}
                      value={item.uom}
                      onChange={formik.handleChange}
                      className="border p-2 rounded"
                      placeholder="UOM"
                    />

                    {/* Price */}
                    <input
                      type="number"
                      name={`items.${index}.price`}
                      value={item.price}
                      onChange={formik.handleChange}
                      className="border p-2 rounded"
                      placeholder="Price"
                    />

                    {/* Qty */}
                    <input
                      type="number"
                      name={`items.${index}.qty`}
                      value={item.qty}
                      onChange={formik.handleChange}
                      className="border p-2 rounded"
                      placeholder="Qty"
                    />

                    {/* Taxable */}
                    <input
                      type="number"
                      value={taxable.toFixed(2)}
                      disabled
                      className="border p-2 rounded bg-gray-100"
                    />

                    {/* SGST */}
                    <input
                      type="number"
                      value={sgst.toFixed(2)}
                      disabled
                      className="border p-2 rounded bg-gray-100"
                    />

                    {/* CGST */}
                    <input
                      type="number"
                      value={cgst.toFixed(2)}
                      disabled
                      className="border p-2 rounded bg-gray-100"
                    />

                    {/* Total */}
                    <input
                      type="number"
                      value={total.toFixed(2)}
                      disabled
                      className="border p-2 rounded bg-green-100 font-semibold"
                    />

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() => arrayHelpers.remove(index)}
                      className="bg-red-500 text-white px-3 py-2 rounded"
                    >
                      Remove
                    </button>
                  </div>
                );
              })}

              {/* Add Button */}
              <button
                type="button"
                onClick={() =>
                  arrayHelpers.push({
                    item: "",
                    hsn: "",
                    uom: "",
                    price: 0,
                    qty: 1,
                  })
                }
                className="bg-blue-500 text-white px-4 py-2 rounded w-fit"
              >
                + Add Item
              </button>

              {/* Grand Total */}
              <div className="flex justify-end">
                <div className="bg-gray-100 p-4 rounded text-xl font-bold">
                  Grand Total : ₹ {grandTotal.toFixed(2)}
                </div>
              </div>
            </div>
          )}
        />

        {/* Submit */}
        <button
          type="submit"
          className="bg-green-600 text-white px-5 py-2 rounded"
        >
          Submit
        </button>
      </form>
    </FormikProvider>
  );
}