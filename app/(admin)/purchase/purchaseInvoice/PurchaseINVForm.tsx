"use client";

import { useFormik, FieldArray, FormikProvider, getIn } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/app/utilsComponents/PageHeader";
import { useCreatePurchaseInvoice } from "@/app/hooks/purchaseHooks/usePurchaseInvoice";
import { useWarehouses } from "@/app/hooks/warehouseHooks/useWarehouse";
import { FORM_LOOKUP_LIMIT } from "@/app/config/pagination";
import {
  loadVendors,
  loadItems,
  mapStaticOptions,
} from "@/app/formComponents/masterLoadOptions";
import { toOption, type SelectOption } from "@/app/formComponents/selectTypes";
import { amountInWords } from "../../../utilsComponents/AmountInWords";
import FormInput from "../../../formComponents/FormText";
import FormDateInput from "../../../formComponents/FormDate";
import FormSelect from "../../../formComponents/FormSelect";
import FormSelectWithAdd from "../../../formComponents/FormSelectWithAdd";
import ItemSelectWithAdd from "../../../formComponents/ItemSelectWithAdd";
import InvoiceQuickAddModals, {
  getEntityId,
  type QuickAddModal,
} from "@/app/utilsComponents/InvoiceQuickAddModals";
import FormNumberInput from "../../../formComponents/FormNumber";
import FormTextarea from "../../../formComponents/FormTextArea";
import { useState, useEffect, useMemo, useRef } from "react";
import { colors } from "@/app/utilsComponents/Colors";
import { PURCHASE_INVOICE_FORM_ID } from "@/app/utilsComponents/form-footer";
import { useInvoiceFormShortcuts } from "@/app/hooks/useInvoiceFormShortcuts";
import InvoiceFormKeyboardHints from "@/app/utilsComponents/InvoiceFormKeyboardHints";
import { invoiceItemsTableClass, invoiceSummaryPanelClass, invoiceSummaryGrandTotalClass } from "@/app/utilsComponents/report-ui";
import {
  appendMergedInvoiceRow,
  clearPurchaseRowCalculated,
  clearPurchaseRowQtyDependents,
  computeInvoiceTotalsFromItems,
  focusLastItemRow,
} from "@/app/utilsComponents/invoiceFormUtils";
import NextDocumentNumberField from "@/app/formComponents/NextDocumentNumberField";
import DocumentAttachmentsField from "@/app/utilsComponents/DocumentAttachments";
import type { DocumentAttachment } from "@/app/types";
import { itemPurchaseRate } from "@/app/utils/itemRates";
import { itemService } from "@/app/services/masterServices/item/item.service";
import toast from "react-hot-toast";

// ── Empty item row ────────────────────────────────────────────
const blockNeg = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (["-", "e", "E", "+"].includes(e.key)) e.preventDefault();
};

const emptyRow = () => ({
  itemId: "",
  itemName: "",
  hsn: "",
  uomId: "",
  uomName: "",
  rate: "",
  qty: "",
  discount: "0",
  discountAmt: 0,
  taxableValue: 0,
  taxPercent: 0,
  sgst: 0,
  cgst: 0,
  total: 0,
});

// ── Recalculate one row ───────────────────────────────────────
const DEFAULT_GST_PERCENT = 18;

const calcRow = (row: any) => {
  const qty = Number(row.qty) || 0;
  const rate = Number(row.rate) || 0;
  const discount = Number(row.discount) || 0;
  const grossAmt = Number((qty * rate).toFixed(2));
  const discountAmt = Number(((grossAmt * discount) / 100).toFixed(2));
  const taxableValue = Number((grossAmt - discountAmt).toFixed(2));
  const taxPercent = Number(row.taxPercent) || DEFAULT_GST_PERCENT;
  const sgst = Number(((taxableValue * taxPercent) / 200).toFixed(2));
  const cgst = Number(((taxableValue * taxPercent) / 200).toFixed(2));
  const total = Number((taxableValue + sgst + cgst).toFixed(2));
  return {
    ...row,
    discount: row.discount ?? "0",
    discountAmt,
    taxPercent,
    taxableValue,
    sgst,
    cgst,
    total,
  };
};

export default function PurchaseInvoiceForm({
  onPendingChange,
}: {
  onPendingChange?: (pending: boolean) => void;
}) {
  const router = useRouter();
  const { mutate: create, isPending } = useCreatePurchaseInvoice();

  useEffect(() => {
    onPendingChange?.(isPending);
  }, [isPending, onPendingChange]);

  // ── API data ──────────────────────────────────────────────
  const { data: warehouseData } = useWarehouses({ limit: FORM_LOOKUP_LIMIT });
  const warehouseOptions = useMemo(
    () => mapStaticOptions(warehouseData?.data ?? []),
    [warehouseData]
  );

  // ── Vendor auto-fill state ────────────────────────────────
  const [vendorDetails, setVendorDetails] = useState({
    gstin: "",
    place: "",
    state: "",
    stateCode: "",
    address: "",
  });
  const [quickAdd, setQuickAdd] = useState<QuickAddModal>(null);
  const [productRowIndex, setProductRowIndex] = useState<number | null>(null);
  const [vendorOption, setVendorOption] = useState<SelectOption | null>(null);
  const [attachments, setAttachments] = useState<DocumentAttachment[]>([]);
  const pushRowRef = useRef<(() => void) | null>(null);

  const {
    formRef,
    allowPastDates,
    today,
    minDate,
    maxDate,
    handleFormKeyDown,
    dateHint,
    keyboard,
  } = useInvoiceFormShortcuts({
    onEnterAtLastField: () => pushRowRef.current?.(),
  });

  // ── Formik with FieldArray ────────────────────────────────
  const validationSchema = useMemo(
    () =>
      Yup.object({
        vendorId: Yup.string().required("Vendor is required"),
        purchaseDate: Yup.string()
          .required("Date is required")
          .test("date-range", "Invalid date", function (value) {
            if (!value) return false;
            if (value > today) {
              return this.createError({ message: "Future dates are not allowed" });
            }
            if (!allowPastDates && value !== today) {
              return this.createError({
                message: keyboard.pastDatesValidationMessage,
              });
            }
            return true;
          }),
        warehouseId: Yup.string().required("Warehouse is required"),
        cashDiscountAmt: Yup.number().min(0),
        items: Yup.array()
          .of(
            Yup.object({
              itemId: Yup.string().required("Item is required"),
              qty: Yup.number()
                .required("Qty is required")
                .min(0.01, "Must be > 0"),
              rate: Yup.number()
                .required("Rate is required")
                .min(0.01, "Must be > 0"),
              discount: Yup.number().min(0).max(100),
            })
          )
          .min(1, "Add at least one item"),
      }),
    [allowPastDates, today, keyboard.pastDatesValidationMessage]
  );

  const formik = useFormik({
    initialValues: {
      vendorId: "",
      vendorInvoiceNo: "",
      purchaseDate: today,
      warehouseId: "",
      notes: "",
      cashDiscountAmt: "0",
      items: [emptyRow()], // ← items inside formik
    },

    validationSchema,

    onSubmit: (values) => {
      const payload = {
        vendorId: values.vendorId,
        vendorInvoiceNo: values.vendorInvoiceNo,
        purchaseDate: values.purchaseDate,
        warehouseId: values.warehouseId,
        notes: values.notes,
        cashDiscountPercent: 0,
        cashDiscountAmt: Number(values.cashDiscountAmt) || 0,
        attachments,
        items: values.items.map((r, i) => ({
          slNo: i + 1,
          itemId: r.itemId,
          hsn: r.hsn,
          uomId: r.uomId,
          rate: Number(r.rate),
          qty: Number(r.qty),
          discount: Number(r.discount) || 0,
          discountAmt: r.discountAmt,
          taxableValue: r.taxableValue,
          taxPercent: r.taxPercent,
          sgst: r.sgst,
          cgst: r.cgst,
          total: r.total,
        })),
      };
      create(payload, {
        onSuccess: () => router.push("/purchase/purchaseInvoice"),
      });
    },
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldTouched,
  } = formik;

  useEffect(() => {
    if (!allowPastDates && values.purchaseDate !== today) {
      setFieldValue("purchaseDate", today);
    }
  }, [allowPastDates, today, values.purchaseDate, setFieldValue]);

  const fillVendorDetails = (vendorId: string, vendorData?: any) => {
    const vendor = vendorData;
    if (vendor) {
      setVendorDetails({
        gstin: vendor.gstin || "",
        place: vendor.address?.place || "",
        state: vendor.address?.state || "",
        stateCode: vendor.address?.stateCode || "",
        address: [
          vendor.address?.line1,
          vendor.address?.place,
          vendor.address?.city,
        ]
          .filter(Boolean)
          .join(", "),
      });
    } else {
      setVendorDetails({
        gstin: "",
        place: "",
        state: "",
        stateCode: "",
        address: "",
      });
    }
  };

  const openProductAdd = (rowIndex: number) => {
    setProductRowIndex(rowIndex);
    setQuickAdd("product");
  };

  // ── Item select handler ───────────────────────────────────
  const handleItemSelect = async (
    index: number,
    itemId: string,
    itemData?: any
  ) => {
    if (!itemId) {
      setFieldValue(`items[${index}]`, emptyRow());
      return;
    }

    let item = itemData;
    if (!item) {
      try {
        item = await itemService.getOne(itemId);
      } catch {
        toast.error("Failed to load product details");
        return;
      }
    }

    const updated = clearPurchaseRowQtyDependents({
      ...emptyRow(),
      itemId,
      itemName: item?.name || "",
      hsn: item?.hsnCode || item?.hsn || "",
      uomId:
        typeof item?.uomId === "object" ? item?.uomId?._id : item?.uomId || "",
      uomName:
        typeof item?.uomId === "object"
          ? `${item?.uomId?.name} (${item?.uomId?.shortCode})`
          : "",
      taxPercent: Number(item?.taxPercent) || 18,
      rate: String(itemPurchaseRate(item) || ""),
    });
    setFieldValue(`items[${index}]`, calcRow(updated));
  };

  // ── Rate / Qty change handler ─────────────────────────────
  const handleRowNumChange = (
    index: number,
    field: "qty" | "discount",
    value: string
  ) => {
    const updated = clearPurchaseRowCalculated({
      ...values.items[index],
      [field]: value,
    });
    setFieldValue(`items[${index}]`, calcRow(updated));
  };

  // ── Totals ────────────────────────────────────────────────
  const {
    netAmount,
    totalSGST,
    totalCGST,
    totalTax,
    total,
    billTotal,
    roundOff,
    cashDiscountAmt,
    grandTotal,
  } = computeInvoiceTotalsFromItems(values.items, values.cashDiscountAmt);

  return (
    <FormikProvider value={formik}>
      <div className="w-full mx-auto p-5">
        <PageHeader
          title="New Purchase Invoice"
          description="Record a new purchase"
        />

        <InvoiceFormKeyboardHints allowPastDates={allowPastDates} keyboard={keyboard} />

        <form
          ref={formRef}
          id={PURCHASE_INVOICE_FORM_ID}
          onSubmit={handleSubmit}
          onKeyDown={handleFormKeyDown}
          className="space-y-8"
        >
          {/* ── Invoice Details ───────────────────────────── */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">
              Invoice Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-6">
              <NextDocumentNumberField
                documentType="purchase_invoice"
                label="Invoice No"
              />

              <FormDateInput
                label="Date"
                name="purchaseDate"
                value={values.purchaseDate}
                required
                min={minDate}
                max={maxDate}
                hint={dateHint}
                enterNav
                touched={touched.purchaseDate}
                error={errors.purchaseDate}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              <FormInput
                label="Vendor Inv No"
                name="vendorInvoiceNo"
                value={values.vendorInvoiceNo}
                placeholder="Supplier's invoice number"
                enterNav
                onChange={handleChange}
                onBlur={handleBlur}
                touched={touched.vendorInvoiceNo}
                error={errors.vendorInvoiceNo}
              />

              <FormSelectWithAdd
                label="Warehouse"
                instanceId="purchase-warehouse"
                value={values.warehouseId}
                required
                enterNav
                placeholder="Search warehouse..."
                options={warehouseOptions}
                onValueChange={(id) => setFieldValue("warehouseId", id)}
                onBlur={() => setFieldTouched("warehouseId", true)}
                touched={touched.warehouseId}
                error={errors.warehouseId}
                addLabel="Add Warehouse"
                onAddClick={() => setQuickAdd("warehouse")}
              />
            </div>
          </div>

          {/* ── Vendor Details ────────────────────────────── */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">
              Vendor Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-6">
              <FormSelectWithAdd
                label="Vendor"
                instanceId="purchase-vendor"
                value={values.vendorId}
                selectedOption={vendorOption}
                required
                enterNav
                placeholder="Search vendor..."
                loadOptions={loadVendors}
                onValueChange={(id, opt) => {
                  setFieldValue("vendorId", id);
                  setVendorOption(id ? opt : null);
                  fillVendorDetails(id, opt?.data);
                }}
                onBlur={() => setFieldTouched("vendorId", true)}
                touched={touched.vendorId}
                error={errors.vendorId}
                addLabel="Add Vendor"
                onAddClick={() => setQuickAdd("party")}
              />

              <FormInput
                label="GSTIN"
                name="gstin"
                value={vendorDetails.gstin}
                readOnly
                placeholder="Auto-filled"
                onChange={() => {}}
                onBlur={() => {}}
              />

              <FormInput
                label="Place"
                name="place"
                value={vendorDetails.place}
                readOnly
                placeholder="Auto-filled"
                onChange={() => {}}
                onBlur={() => {}}
              />

              <FormInput
                label="State"
                name="state"
                value={vendorDetails.state}
                readOnly
                placeholder="Auto-filled"
                onChange={() => {}}
                onBlur={() => {}}
              />

              <FormInput
                label="State Code"
                name="stateCode"
                value={vendorDetails.stateCode}
                readOnly
                placeholder="Auto-filled"
                onChange={() => {}}
                onBlur={() => {}}
              />

              <FormInput
                label="Address"
                name="address"
                value={vendorDetails.address}
                readOnly
                placeholder="Auto-filled"
                onChange={() => {}}
                onBlur={() => {}}
              />
            </div>
          </div>

          {/* ── Items Table — FieldArray ───────────────────── */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                Items
              </h3>
            </div>

            <FieldArray name="items">
              {({ remove }) => {
                pushRowRef.current = () => {
                  const { nextItems, merged } = appendMergedInvoiceRow(
                    values.items,
                    emptyRow,
                    calcRow
                  );
                  setFieldValue("items", nextItems);
                  if (merged) {
                    toast.success("Duplicate products merged");
                  }
                  setTimeout(() => focusLastItemRow(formRef.current), 60);
                };

                return (
                <>
                  <div className="px-2 pb-1">
                  <table className={invoiceItemsTableClass}>
                      <thead className="bg-gray-50 text-gray-600 text-xs">
                        <tr>
                          <th className="px-3 py-3 text-left w-10">#</th>
                          <th className="px-3 py-3 text-left min-w-[200px]">
                            Item
                          </th>
                          <th className="px-3 py-3 text-left w-24">HSN</th>
                          <th className="px-3 py-3 text-left w-28">UOM</th>
                          <th className="px-3 py-3 text-right w-28">Rate</th>
                          <th className="px-3 py-3 text-right w-24">Qty</th>
                          <th className="px-3 py-3 text-right w-24">Disc %</th>
                          <th className="px-3 py-3 text-right w-32">
                            Taxable Value
                          </th>
                          {/* <th className="px-3 py-3 text-right w-16">Tax%</th> */}
                          <th className="px-3 py-3 text-right w-24">SGST</th>
                          <th className="px-3 py-3 text-right w-24">CGST</th>
                          <th className="px-3 py-3 text-right w-28">Total</th>
                          <th className="px-3 py-3 w-10"></th>
                        </tr>
                      </thead>

                      <tbody>
                        {values.items.map((row, index) => {
                          const rowTouched = getIn(touched, `items[${index}]`);
                          const rowErrors = getIn(errors, `items[${index}]`);

                          return (
                            <tr
                              key={index}
                              className="border-t hover:bg-gray-50"
                            >
                              {/* Sl No */}
                              <td className="px-3 py-2 text-gray-400 text-xs text-center">
                                {index + 1}
                              </td>

                              {/* Item */}
                              <td className="px-3 py-2">
                                <ItemSelectWithAdd
                                  instanceId={`purchase-item-${index}`}
                                  enterNav
                                  value={row.itemId}
                                  selectedOption={
                                    row.itemId
                                      ? {
                                          value: row.itemId,
                                          label: row.itemName || "Selected",
                                        }
                                      : null
                                  }
                                  loadOptions={loadItems}
                                  hasError={
                                    !!(rowTouched?.itemId && rowErrors?.itemId)
                                  }
                                  error={rowErrors?.itemId}
                                  onChange={(id, opt) =>
                                    handleItemSelect(index, id, opt?.data)
                                  }
                                  addLabel="Add Product"
                                  onAddClick={() => openProductAdd(index)}
                                />
                              </td>

                              {/* HSN — auto filled, readonly */}
                              <td className="px-3 py-2">
                                <input
                                  value={row.hsn}
                                  readOnly
                                  placeholder="—"
                                  className="w-full border-b border-gray-200 bg-transparent py-1 text-sm text-gray-500 cursor-not-allowed"
                                />
                              </td>

                              {/* UOM — auto filled, disabled */}
                              <td className="px-3 py-2">
                                <input
                                  value={row.uomName}
                                  readOnly
                                  className="w-full border-b border-gray-200 bg-transparent py-1 text-sm text-gray-500 cursor-not-allowed"
                                />
                              </td>

                              {/* Rate — auto filled, readonly */}
                              <td className="px-3 py-2">
                                <input
                                  type="number"
                                  value={row.rate}
                                  readOnly
                                  placeholder="0.00"
                                  className="w-full border-b border-gray-200 bg-transparent py-1 text-sm text-right text-gray-500 cursor-not-allowed"
                                />
                                {rowTouched?.rate && rowErrors?.rate && (
                                  <p className="text-red-500 text-xs mt-0.5">
                                    {rowErrors.rate}
                                  </p>
                                )}
                              </td>

                              {/* Qty */}
                              <td className="px-3 py-2">
                                <input
                                  type="number"
                                  data-enter-nav="field"
                                  value={row.qty}
                                  onChange={(e) =>
                                    handleRowNumChange(
                                      index,
                                      "qty",
                                      e.target.value
                                    )
                                  }
                                  onKeyDown={(e) => {
                                    if (["-", "e", "E", "+"].includes(e.key))
                                      e.preventDefault();
                                  }}
                                  min="0"
                                  step="0.01"
                                  placeholder="0"
                                  className={`w-full border-b bg-transparent py-1 text-sm text-right outline-none focus:border-blue-600
                                    ${
                                      rowTouched?.qty && rowErrors?.qty
                                        ? "border-red-500"
                                        : "border-gray-300"
                                    }`}
                                />
                                {rowTouched?.qty && rowErrors?.qty && (
                                  <p className="text-red-500 text-xs mt-0.5">
                                    {rowErrors.qty}
                                  </p>
                                )}
                              </td>

                              {/* Discount % */}
                              <td className="px-3 py-2">
                                <input
                                  type="number"
                                  data-enter-nav="field"
                                  value={row.discount}
                                  onChange={(e) =>
                                    handleRowNumChange(
                                      index,
                                      "discount",
                                      e.target.value
                                    )
                                  }
                                  onKeyDown={(e) => {
                                    if (["-", "e", "E", "+"].includes(e.key))
                                      e.preventDefault();
                                  }}
                                  min="0"
                                  max="100"
                                  step="0.01"
                                  placeholder="0"
                                  className={`w-full border-b bg-transparent py-1 text-sm text-right outline-none focus:border-blue-600
                                    ${
                                      rowTouched?.discount &&
                                      rowErrors?.discount
                                        ? "border-red-500"
                                        : "border-gray-300"
                                    }`}
                                />
                                {rowTouched?.discount &&
                                  rowErrors?.discount && (
                                    <p className="text-red-500 text-xs mt-0.5">
                                      {rowErrors.discount}
                                    </p>
                                  )}
                              </td>

                              {/* Taxable Value — auto */}
                              <td className="px-3 py-2 text-right text-gray-700">
                                {row.taxableValue.toFixed(2)}
                              </td>

                              {/* Tax% — auto */}
                              {/* <td className="px-3 py-2 text-right text-gray-500 text-xs">
                                {row.taxPercent}%
                              </td> */}

                              {/* SGST — auto */}
                              <td className="px-3 py-2 text-right text-gray-700">
                                {row.sgst.toFixed(2)}
                              </td>

                              {/* CGST — auto */}
                              <td className="px-3 py-2 text-right text-gray-700">
                                {row.cgst.toFixed(2)}
                              </td>

                              {/* Total — auto */}
                              <td className="px-3 py-2 text-right font-medium text-gray-800">
                                {row.total.toFixed(2)}
                              </td>

                              {/* Remove */}
                              <td className="px-3 py-2">
                                <button
                                  type="button"
                                  onClick={() => remove(index)}
                                  disabled={values.items.length === 1}
                                  className="text-red-400 hover:text-red-600 disabled:opacity-20"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Add Row Button */}
                  <div className="px-4 py-3 border-t">
                    <button
                      type="button"
                      onClick={() => pushRowRef.current?.()}
                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      <Plus size={13} /> Add Row
                    </button>
                  </div>
                </>
                );
              }}
            </FieldArray>

            {/* ── Summary ───────────────────────────────────── */}
            <div className="flex justify-end border-t bg-gray-50 p-6">
              <div className={invoiceSummaryPanelClass}>
                <div className="flex justify-between text-gray-600">
                  <span>Net Amount</span>
                  <span>₹ {netAmount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Total SGST</span>
                  <span>₹ {totalSGST.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Total CGST</span>
                  <span>₹ {totalCGST.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Total Tax</span>
                  <span>₹ {totalTax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between font-medium text-gray-800 border-t pt-2">
                  <span>Total</span>
                  <span>₹ {total.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-500">
                  <span>Round Off</span>
                  <span>
                    {roundOff >= 0 ? "+" : ""}
                    {roundOff.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between font-semibold text-gray-800">
                  <span>Bill Total</span>
                  <span>₹ {billTotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center gap-3 text-gray-600">
                  <span>Discount ₹</span>
                  <input
                    type="number"
                    name="cashDiscountAmt"
                    value={values.cashDiscountAmt}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={blockNeg}
                    min="0"
                    step="0.01"
                    className="w-24 border-b border-gray-300 bg-transparent py-0.5 text-sm text-right outline-none focus:border-blue-600"
                  />
                </div>

                {cashDiscountAmt > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Discount Applied</span>
                    <span>- ₹ {cashDiscountAmt.toFixed(2)}</span>
                  </div>
                )}

                <div className={invoiceSummaryGrandTotalClass}>
                  <span>Grand Total</span>
                  <span>₹ {grandTotal.toFixed(2)}</span>
                </div>

                <p className="text-gray-400 text-xs italic pt-1">
                  {amountInWords(grandTotal)}
                </p>
              </div>
            </div>
          </div>

          <DocumentAttachmentsField
            attachments={attachments}
            onChange={setAttachments}
          />

          {/* ── Notes ────────────────────────────────────────── */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <FormTextarea
              label="Notes"
              name="notes"
              value={values.notes}
              placeholder="Any remarks..."
              rows={2}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
        </form>

        <InvoiceQuickAddModals
          active={quickAdd}
          mode="purchase"
          onClose={() => {
            setQuickAdd(null);
            setProductRowIndex(null);
          }}
          onPartySuccess={(data) => {
            const id = getEntityId(data);
            const v = data as { name?: string };
            setFieldValue("vendorId", id);
            setVendorOption(toOption(id, v.name ?? "Vendor", data));
            fillVendorDetails(id, data);
          }}
          onWarehouseSuccess={(data) => {
            setFieldValue("warehouseId", getEntityId(data));
          }}
          onProductSuccess={(data) => {
            if (productRowIndex !== null) {
              handleItemSelect(productRowIndex, getEntityId(data), data);
            }
          }}
        />
      </div>
    </FormikProvider>
  );
}
