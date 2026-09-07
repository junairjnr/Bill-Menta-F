"use client";

import { useFormik, FieldArray, FormikProvider, getIn } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/app/utilsComponents/PageHeader";
import { useCreateSalesInvoice } from "@/app/hooks/salesHooks/useSalesInvoice";
import { useWarehouses } from "@/app/hooks/warehouseHooks/useWarehouse";
import { usePriceLevels } from "@/app/hooks/masterHooks/priceLevelHook/usePriceLevel";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { FORM_LOOKUP_LIMIT } from "@/app/config/pagination";
import {
  loadSalesCustomers,
  loadItems,
  mapStaticOptions,
} from "@/app/formComponents/masterLoadOptions";
import { itemService } from "@/app/services/masterServices/item/item.service";
import { toOption, type SelectOption } from "@/app/formComponents/selectTypes";
import { SalesItemRow } from "@/app/types";
import { useBranchStore } from "@/app/store/branch/branch.store";
import { SALES_INVOICE_FORM_ID } from "@/app/utilsComponents/form-footer";
import FormSelect from "@/app/formComponents/FormSelect";
import FormSelectWithAdd from "@/app/formComponents/FormSelectWithAdd";
import ItemSelectWithAdd from "@/app/formComponents/ItemSelectWithAdd";
import InvoiceQuickAddModals, {
  getEntityId,
  type QuickAddModal,
} from "@/app/utilsComponents/InvoiceQuickAddModals";
import { amountInWords } from "@/app/utilsComponents/AmountInWords";
import FormTextArea from "@/app/formComponents/FormTextArea";
import FormInput from "../../../formComponents/FormText";
import FormDateInput from "../../../formComponents/FormDate";
import { useInvoiceFormShortcuts } from "@/app/hooks/useInvoiceFormShortcuts";
import InvoiceFormKeyboardHints from "@/app/utilsComponents/InvoiceFormKeyboardHints";
import { invoiceItemsTableClass } from "@/app/utilsComponents/report-ui";
import { focusEnterNavField } from "@/app/utilsComponents/invoiceFormUtils";
import NextDocumentNumberField from "@/app/formComponents/NextDocumentNumberField";
import {
  calculateLineGst,
  gstSupplyTypeLabel,
  normalizeStateCode,
  resolveGstSupplyType,
  stateCodeFromGstin,
} from "@/app/utils/gstTax";
import { itemSalesRate } from "@/app/utils/itemRates";

// ── Block negative keys ───────────────────────────────────────
const blockNeg = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (["-", "e", "E", "+"].includes(e.key)) e.preventDefault();
};

// ── Empty sales row ───────────────────────────────────────────
const emptyRow = (): SalesItemRow => ({
  slNo: 0,
  itemId: "",
  itemName: "",
  hsn: "",
  uomId: "",
  uomName: "",
  baseRate: 0,
  priceLevelPct: 0,
  rate: 0,
  qty: "",
  discount: "0",
  discountAmt: 0,
  taxableValue: 0,
  taxPercent: 0,
  sgst: 0,
  cgst: 0,
  igst: 0,
  total: 0,
});

const calcRow = (
  row: SalesItemRow,
  priceLevelPct: number,
  supplierStateCode: string,
  placeOfSupplyStateCode: string
): SalesItemRow => {
  const baseRate = row.baseRate;
  const rate = Number((baseRate + (baseRate * priceLevelPct) / 100).toFixed(2));
  const qty = Number(row.qty) || 0;
  const discount = Number(row.discount) || 0;
  const grossAmt = Number((rate * qty).toFixed(2));
  const discountAmt = Number(((grossAmt * discount) / 100).toFixed(2));
  const taxableValue = Number((grossAmt - discountAmt).toFixed(2));
  const taxPercent = Number(row.taxPercent) || 0;
  const gst = calculateLineGst({
    taxableValue,
    taxPercent,
    supplierStateCode,
    placeOfSupplyStateCode,
  });
  const total = Number((taxableValue + gst.sgst + gst.cgst + gst.igst).toFixed(2));
  return {
    ...row,
    priceLevelPct,
    rate,
    discountAmt,
    taxableValue,
    sgst: gst.sgst,
    cgst: gst.cgst,
    igst: gst.igst,
    total,
  };
};

const computeInvoiceTotals = (
  items: SalesItemRow[],
  cashDiscountAmtInput: string | number
) => {
  const lineNetAmount = items.reduce((s, r) => s + r.taxableValue, 0);
  const totalSGST = items.reduce((s, r) => s + r.sgst, 0);
  const totalCGST = items.reduce((s, r) => s + r.cgst, 0);
  const totalIGST = items.reduce((s, r) => s + (r.igst ?? 0), 0);
  const totalTax = totalSGST + totalCGST + totalIGST;
  const total = Number((lineNetAmount + totalTax).toFixed(2));
  const billTotal = Math.round(total);
  const roundOff = Number((billTotal - total).toFixed(2));

  let cashDiscountAmt = Number(Number(cashDiscountAmtInput || 0).toFixed(2));
  if (cashDiscountAmt > billTotal) cashDiscountAmt = billTotal;

  const grandTotal = Number((billTotal - cashDiscountAmt).toFixed(2));

  return {
    lineNetAmount,
    netAmount: lineNetAmount,
    totalSGST,
    totalCGST,
    totalIGST,
    totalTax,
    total,
    billTotal,
    roundOff,
    cashDiscountAmt,
    grandTotal,
    hasTax: totalTax > 0,
  };
};

export default function SalesInvoiceForm({
  onPendingChange,
}: {
  onPendingChange?: (pending: boolean) => void;
}) {
  const router = useRouter();
  const { mutate: create, isPending } = useCreateSalesInvoice();

  useEffect(() => {
    onPendingChange?.(isPending);
  }, [isPending, onPendingChange]);
  const activeBranch = useBranchStore((s) => s.activeBranch);

  // ── API Data ──────────────────────────────────────────────
  const { data: priceLevelData } = usePriceLevels();
  const { data: warehouseData } = useWarehouses({ limit: FORM_LOOKUP_LIMIT });

  const priceLevels = priceLevelData?.data ?? [];
  const warehouseOptions = useMemo(
    () => mapStaticOptions(warehouseData?.data ?? []),
    [warehouseData]
  );

  // ── Customer auto-fill state ──────────────────────────────
  const [customerDetails, setCustomerDetails] = useState({
    gstin: "",
    place: "",
    state: "",
    stateCode: "",
    address: "",
  });

  // ── Active price level ────────────────────────────────────
  const [activePriceLevelPct, setActivePriceLevelPct] = useState<number>(0);
  const [quickAdd, setQuickAdd] = useState<QuickAddModal>(null);
  const [productRowIndex, setProductRowIndex] = useState<number | null>(null);
  const [customerOption, setCustomerOption] = useState<SelectOption | null>(
    null
  );
  const pushRowRef = useRef<(() => void) | null>(null);
  const replaceRowRef = useRef<
    ((index: number, row: SalesItemRow) => void) | null
  >(null);
  const valuesRef = useRef<{ items: SalesItemRow[] }>({ items: [emptyRow()] });
  const activePriceLevelPctRef = useRef(0);

  const {
    formRef,
    allowPastDates,
    today,
    minDate,
    maxDate,
    handleFormKeyDown,
    dateHint,
  } = useInvoiceFormShortcuts({
    onEnterAtLastField: () => pushRowRef.current?.(),
  });

  const redirectToSalesList = () => {
    router.push("/sales/salesInvoice");
  };

  // ── Formik ────────────────────────────────────────────────
  const validationSchema = useMemo(
    () =>
      Yup.object({
        invoiceDate: Yup.string()
          .required("Invoice date is required")
          .test("date-range", "Invalid date", function (value) {
            if (!value) return false;
            if (value > today) {
              return this.createError({ message: "Future dates are not allowed" });
            }
            if (!allowPastDates && value !== today) {
              return this.createError({
                message:
                  "Only today's date is allowed. Press Ctrl+Shift+D to enable past dates.",
              });
            }
            return true;
          }),
        salesType: Yup.string().required("Sales type is required"),
        priceLevelId: Yup.string().required("Price level is required"),
        customerId: Yup.string().required("Customer is required"),
        warehouseId: Yup.string().required("Warehouse is required"),
        cashDiscountAmt: Yup.number().min(0),
        receivedAmount: Yup.number()
          .transform((_v, orig) =>
            orig === "" || orig == null ? 0 : Number(orig)
          )
          .min(0, "Cannot be negative")
          .test("max-collect", "Cannot exceed amount to collect", function (value) {
            const items = this.parent?.items;
            if (!Array.isArray(items)) return true;
            const grand = computeInvoiceTotals(
              items,
              this.parent?.cashDiscountAmt ?? 0
            ).grandTotal;
            return (Number(value) || 0) <= grand + 0.009;
          }),
        items: Yup.array()
          .of(
            Yup.object({
              itemId: Yup.string().required("Item required"),
              qty: Yup.number()
                .transform((_v, orig) =>
                  orig === "" || orig == null ? undefined : Number(orig)
                )
                .required("Qty required")
                .min(0.01, "Must be > 0"),
              discount: Yup.number()
                .transform((_v, orig) =>
                  orig === "" || orig == null ? 0 : Number(orig)
                )
                .min(0)
                .max(100),
            })
          )
          .min(1, "Add at least one item"),
      }),
    [allowPastDates, today]
  );

  const formik = useFormik({
    initialValues: {
      invoiceDate: today,
      salesType: "retail" as "retail" | "wholesale",
      priceLevelId: "",
      customerId: "",
      warehouseId: "",
      notes: "",
      saleMode: "cash" as "credit" | "cash",
      cashDiscountAmt: "0",
      receivedAmount: "",
      items: [emptyRow()],
    },

    validationSchema,
    enableReinitialize: false,

    onSubmit: (values) => {
      const invoiceTotals = computeInvoiceTotals(
        values.items,
        values.cashDiscountAmt
      );
      const received = Number(values.receivedAmount) || 0;
      const paidAmount =
        values.saleMode === "credit"
          ? received
          : received > 0
            ? received
            : invoiceTotals.grandTotal;

      const payload = {
        invoiceDate: values.invoiceDate,
        salesType: values.salesType,
        priceLevelId: values.priceLevelId,
        customerId: values.customerId,
        warehouseId: values.warehouseId,
        notes: values.notes,
        saleMode: values.saleMode,
        cashDiscountPercent: 0,
        cashDiscountAmt: Number(values.cashDiscountAmt) || 0,
        paidAmount,
        items: values.items.map((r, i) => ({
          slNo: i + 1,
          itemId: r.itemId,
          hsn: r.hsn,
          uomId: r.uomId,
          baseRate: r.baseRate,
          priceLevelPct: r.priceLevelPct,
          rate: r.rate,
          qty: Number(r.qty),
          discount: Number(r.discount),
          discountAmt: r.discountAmt,
          taxableValue: r.taxableValue,
          sgst: r.sgst,
          cgst: r.cgst,
          total: r.total,
        })),
      };
      create(payload, { onSuccess: redirectToSalesList });
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

  valuesRef.current = values;
  activePriceLevelPctRef.current = activePriceLevelPct;

  const supplierStateCode = useMemo(
    () =>
      normalizeStateCode(activeBranch?.address?.stateCode) ||
      stateCodeFromGstin(activeBranch?.gstin) ||
      "",
    [activeBranch]
  );

  const placeOfSupplyStateCode = useMemo(
    () =>
      normalizeStateCode(customerDetails.stateCode) ||
      stateCodeFromGstin(customerDetails.gstin) ||
      "",
    [customerDetails.stateCode, customerDetails.gstin]
  );

  const gstSupplyType = useMemo(
    () => resolveGstSupplyType(supplierStateCode, placeOfSupplyStateCode),
    [supplierStateCode, placeOfSupplyStateCode]
  );
  const isInterState = gstSupplyType === "inter";

  const updateRow = (index: number, row: SalesItemRow) => {
    replaceRowRef.current?.(index, row);
  };

  const loadCustomerOptions = useCallback(
    (search: string) => loadSalesCustomers(search, values.salesType),
    [values.salesType]
  );

  useEffect(() => {
    if (!allowPastDates && values.invoiceDate !== today) {
      setFieldValue("invoiceDate", today);
    }
  }, [allowPastDates, today, values.invoiceDate, setFieldValue]);

  // ── When salesType changes → reset customer ───────────────
  useEffect(() => {
    setFieldValue("customerId", "");
    setCustomerOption(null);
    setCustomerDetails({
      gstin: "",
      place: "",
      state: "",
      stateCode: "",
      address: "",
    });
  }, [values.salesType]);

  useEffect(() => {
    if (!values.items.length) return;
    const updatedItems = values.items.map((row) =>
      calcRow(
        row,
        activePriceLevelPctRef.current,
        supplierStateCode,
        placeOfSupplyStateCode
      )
    );
    setFieldValue("items", updatedItems);
  }, [supplierStateCode, placeOfSupplyStateCode, setFieldValue]);

  // ── When priceLevel changes → recalc all rows ────────────
  const handlePriceLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setFieldValue("priceLevelId", id);
    const pl = priceLevels.find((p: any) => p._id === id);
    const pct = Number(pl?.taxPercent ?? 0);
    setActivePriceLevelPct(pct);
    const updatedItems = values.items.map((row) =>
      calcRow(row, pct, supplierStateCode, placeOfSupplyStateCode)
    );
    setFieldValue("items", updatedItems);
  };

  const fillCustomerDetails = (customerId: string, customerData?: any) => {
    const customer = customerData;
    if (customer) {
      setCustomerDetails({
        gstin: customer.gstin || "",
        place: customer.address?.place || "",
        state: customer.address?.state || "",
        stateCode: customer.address?.stateCode || "",
        address: [
          customer.address?.line1,
          customer.address?.place,
          customer.address?.city,
        ]
          .filter(Boolean)
          .join(", "),
      });
    } else {
      setCustomerDetails({
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

  // ── Item select ───────────────────────────────────────────
  const applyItemToRow = (index: number, item: any) => {
    const current = valuesRef.current.items[index] ?? emptyRow();
    const priceLevelPct = activePriceLevelPctRef.current;
    const updated: SalesItemRow = {
      ...emptyRow(),
      ...current,
      itemId: String(item?._id ?? item?.id ?? current.itemId),
      itemName: item?.name || "",
      hsn: item?.hsnCode || item?.hsn || "",
      uomId:
        typeof item?.uomId === "object"
          ? item.uomId._id
          : item?.uomId || current.uomId || "",
      uomName:
        typeof item?.uomId === "object"
          ? `${item.uomId.name} (${item.uomId.shortCode})`
          : current.uomName,
      baseRate: itemSalesRate(item),
      priceLevelPct,
      taxPercent: Number(item?.taxPercent) || 0,
    };
    updateRow(index, calcRow(updated, priceLevelPct, supplierStateCode, placeOfSupplyStateCode));
  };

  const handleItemSelect = async (
    index: number,
    itemId: string,
    itemData?: any
  ) => {
    if (!itemId) return;

    let item = itemData;
    if (!item) {
      try {
        item = await itemService.getOne(itemId);
      } catch {
        return;
      }
    }

    applyItemToRow(index, item);
  };

  // ── Row field change ──────────────────────────────────────
  const handleRowChange = (
    index: number,
    field: "qty" | "discount" | "hsn",
    value: string
  ) => {
    const current = valuesRef.current.items[index] ?? emptyRow();
    const updated = { ...current, [field]: value };
    if (field === "qty" || field === "discount") {
      updateRow(index, calcRow(updated, activePriceLevelPctRef.current, supplierStateCode, placeOfSupplyStateCode));
    } else {
      updateRow(index, updated);
    }
  };

  const totals = computeInvoiceTotals(values.items, values.cashDiscountAmt);
  const {
    lineNetAmount,
    netAmount,
    totalSGST,
    totalCGST,
    totalIGST,
    totalTax,
    total,
    billTotal,
    roundOff,
    cashDiscountAmt,
    grandTotal,
    hasTax,
  } = totals;

  const receivedAmount = Number(values.receivedAmount) || 0;
  const paidAmount =
    receivedAmount > grandTotal ? grandTotal : receivedAmount;
  const balanceDue = Number((grandTotal - paidAmount).toFixed(2));

  return (
    <FormikProvider value={formik}>
      <div className="w-full mx-auto p-5">
        <PageHeader
          title="New Sales Invoice"
          description="Create a sales invoice"
        />

        <InvoiceFormKeyboardHints allowPastDates={allowPastDates} />

        <form
          ref={formRef}
          id={SALES_INVOICE_FORM_ID}
          onSubmit={handleSubmit}
          onKeyDown={handleFormKeyDown}
          className="space-y-8"
        >
          {/* ── Invoice Details ─────────────────────────── */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">
              Invoice Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-6">
              <NextDocumentNumberField
                documentType="sales_invoice"
                label="Invoice No"
                params={{ salesType: values.salesType }}
              />

              <FormDateInput
                label="Invoice Date"
                name="invoiceDate"
                value={values.invoiceDate}
                required
                min={minDate}
                max={maxDate}
                hint={dateHint}
                enterNav
                onChange={handleChange}
                onBlur={handleBlur}
                touched={touched.invoiceDate}
                error={errors.invoiceDate}
              />

              {/* Sales Type */}
              <FormSelect
                label="Sales Type"
                name="salesType"
                value={values.salesType}
                required
                enterNav
                options={[
                  { label: "Retail", value: "retail" },
                  { label: "Wholesale", value: "wholesale" },
                ]}
                onChange={handleChange}
                onBlur={handleBlur}
                touched={touched.salesType}
                error={errors.salesType}
              />

              {/* Price Level */}
              <FormSelect
                label="Price Level"
                name="priceLevelId"
                value={values.priceLevelId}
                required
                enterNav
                placeholder="Select price level"
                options={priceLevels.map((pl: any) => ({
                  label: `${pl.name} (${pl.taxPercent}%)`,
                  value: pl._id,
                }))}
                onChange={handlePriceLevelChange}
                onBlur={handleBlur}
                touched={touched.priceLevelId}
                error={errors.priceLevelId}
              />

              {/* Warehouse */}
              <FormSelectWithAdd
                label="Warehouse"
                instanceId="sales-warehouse"
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

              <div className="md:col-span-2 lg:col-span-3">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Sale Mode
                </label>
                <div className="flex flex-wrap gap-2">
                  {(["cash", "credit"] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => {
                        setFieldValue("saleMode", mode);
                        if (mode === "credit") {
                          setFieldValue("receivedAmount", "");
                        } else {
                          const nextTotals = computeInvoiceTotals(
                            values.items,
                            values.cashDiscountAmt
                          );
                          setFieldValue(
                            "receivedAmount",
                            nextTotals.grandTotal > 0
                              ? String(nextTotals.grandTotal)
                              : ""
                          );
                        }
                      }}
                      className={`rounded-md border px-4 py-2 text-sm font-medium transition ${
                        values.saleMode === mode
                          ? "border-black bg-black text-white"
                          : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {mode === "cash" ? "Cash Sale" : "Credit Sale"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Customer Details ─────────────────────────── */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">
              Customer Details
              <span className="ml-2 normal-case font-normal text-blue-500">
                (
                {values.salesType === "retail"
                  ? "Retail Customers"
                  : "Wholesale Customers"}
                )
              </span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6 max-w-3xl">
              <div className="md:col-span-2">
                <FormSelectWithAdd
                  label="Customer"
                  instanceId={`sales-customer-${values.salesType}`}
                  reloadKey={values.salesType}
                  value={values.customerId}
                  selectedOption={customerOption}
                  required
                  enterNav
                  placeholder="Search customer..."
                  loadOptions={loadCustomerOptions}
                  onValueChange={(id, opt) => {
                    setFieldValue("customerId", id);
                    setCustomerOption(opt);
                    fillCustomerDetails(id, opt?.data);
                  }}
                  onBlur={() => setFieldTouched("customerId", true)}
                  touched={touched.customerId}
                  error={errors.customerId}
                  addLabel="Add Customer"
                  onAddClick={() => setQuickAdd("party")}
                />
              </div>

              <FormInput
                label="GSTIN"
                name="gstin"
                value={customerDetails.gstin || "—"}
                readOnly
                onChange={() => {}}
                onBlur={() => {}}
              />
              <FormInput
                label="Supplier State Code"
                name="supplierStateCode"
                value={supplierStateCode || "—"}
                readOnly
                onChange={() => {}}
                onBlur={() => {}}
              />
              <FormInput
                label="Place of Supply"
                name="place"
                value={customerDetails.place}
                readOnly
                onChange={() => {}}
                onBlur={() => {}}
              />
              <FormInput
                label="Place of Supply State"
                name="state"
                value={customerDetails.state}
                readOnly
                onChange={() => {}}
                onBlur={() => {}}
              />
              <FormInput
                label="Place of Supply State Code"
                name="stateCode"
                value={customerDetails.stateCode || "—"}
                readOnly
                onChange={() => {}}
                onBlur={() => {}}
              />
              {values.customerId && (
                <div className="md:col-span-2 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
                  <p className="text-sm font-medium text-blue-900">
                    {gstSupplyTypeLabel(gstSupplyType)}
                  </p>
                  <p className="mt-1 text-xs text-blue-700">
                    {customerDetails.gstin
                      ? "B2B — GST registered customer"
                      : "B2C — Bill without customer GSTIN"}
                  </p>
                </div>
              )}
              <FormInput
                label="Address"
                name="address"
                value={customerDetails.address}
                readOnly
                onChange={() => {}}
                onBlur={() => {}}
              />
            </div>
          </div>

          {/* ── Items Table ──────────────────────────────── */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                Items
                {activePriceLevelPct > 0 && (
                  <span className="ml-2 normal-case font-normal text-green-600">
                    Price Level: +{activePriceLevelPct}% on base rate
                  </span>
                )}
              </h3>
            </div>

            <FieldArray name="items">
              {({ push, remove, replace }) => {
                replaceRowRef.current = (index, row) => replace(index, row);
                pushRowRef.current = () => {
                  push(emptyRow());
                  setTimeout(() => {
                    const form = formRef.current;
                    if (!form) return;
                    const selects = form.querySelectorAll('[data-enter-nav="item-select"]');
                    const last = selects[selects.length - 1] as HTMLElement | undefined;
                    if (last) focusEnterNavField(last);
                  }, 60);
                };

                return (
                <>
                  <div className="px-2 pb-1">
                  <table className={invoiceItemsTableClass}>
                      <thead className="bg-gray-50 text-gray-600 text-xs">
                        <tr>
                          <th className="px-3 py-3 text-left w-8">#</th>
                          <th className="px-3 py-3 text-left min-w-[200px]">
                            Item
                          </th>
                          <th className="px-3 py-3 text-left w-20">HSN</th>
                          <th className="px-3 py-3 text-left w-24">UOM</th>
                          <th className="px-3 py-3 text-right w-24">Rate</th>
                          <th className="px-3 py-3 text-right w-20">Qty</th>
                          <th className="px-3 py-3 text-right w-20">Disc%</th>
                          <th className="px-3 py-3 text-right w-28">
                            Taxable Value
                          </th>
                          {hasTax &&
                            (isInterState ? (
                              <th className="px-3 py-3 text-right w-24">
                                IGST
                              </th>
                            ) : (
                              <>
                                <th className="px-3 py-3 text-right w-24">
                                  SGST
                                </th>
                                <th className="px-3 py-3 text-right w-24">
                                  CGST
                                </th>
                              </>
                            ))}
                          <th className="px-3 py-3 text-right w-28">Total</th>
                          <th className="px-3 py-3 w-8"></th>
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
                                  instanceId={`sales-item-${index}`}
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

                              {/* HSN */}
                              <td className="px-3 py-2">
                                <input
                                  data-enter-nav="field"
                                  value={row.hsn}
                                  onChange={(e) =>
                                    handleRowChange(
                                      index,
                                      "hsn",
                                      e.target.value
                                    )
                                  }
                                  placeholder="HSN"
                                  className="w-full border-b border-gray-300 bg-transparent py-1 text-sm outline-none focus:border-blue-600"
                                />
                              </td>

                              {/* UOM — auto, readonly */}
                              <td className="px-3 py-2">
                                <input
                                  value={row.uomName}
                                  readOnly
                                  className="w-full border-b border-gray-200 bg-transparent py-1 text-sm text-gray-500 cursor-not-allowed"
                                />
                              </td>

                              {/* Rate — auto calculated, readonly */}
                              <td className="px-3 py-2">
                                <input
                                  value={row.rate.toFixed(2)}
                                  readOnly
                                  className="w-full border-b border-gray-200 bg-transparent py-1 text-sm text-right text-gray-600 cursor-not-allowed"
                                />
                              </td>

                              {/* Qty */}
                              <td className="px-3 py-2">
                                <input
                                  type="number"
                                  data-enter-nav="field"
                                  value={row.qty}
                                  onChange={(e) =>
                                    handleRowChange(
                                      index,
                                      "qty",
                                      e.target.value
                                    )
                                  }
                                  onKeyDown={blockNeg}
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
                                    handleRowChange(
                                      index,
                                      "discount",
                                      e.target.value
                                    )
                                  }
                                  onKeyDown={blockNeg}
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

                              {hasTax &&
                                (isInterState ? (
                                  <td className="px-3 py-2 text-right text-gray-700">
                                    {(row.igst ?? 0) > 0
                                      ? row.igst!.toFixed(2)
                                      : "—"}
                                  </td>
                                ) : (
                                  <>
                                    <td className="px-3 py-2 text-right text-gray-700">
                                      {row.sgst > 0 ? row.sgst.toFixed(2) : "—"}
                                    </td>
                                    <td className="px-3 py-2 text-right text-gray-700">
                                      {row.cgst > 0 ? row.cgst.toFixed(2) : "—"}
                                    </td>
                                  </>
                                ))}

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

                  {/* Add Row */}
                  <div className="px-4 py-3 border-t">
                    <button
                      type="button"
                      onClick={() => push(emptyRow())}
                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      <Plus size={13} /> Add Row
                    </button>
                  </div>
                </>
                );
              }}
            </FieldArray>

            {/* ── Summary ──────────────────────────────────── */}
            <div className="flex justify-end p-6 border-t bg-gray-50">
              <div className="w-full max-w-xs space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal (Taxable Value)</span>
                  <span>₹ {lineNetAmount.toFixed(2)}</span>
                </div>

                {hasTax && (
                  <>
                    {isInterState ? (
                      <div className="flex justify-between text-gray-600">
                        <span>Total IGST</span>
                        <span>₹ {totalIGST.toFixed(2)}</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between text-gray-600">
                          <span>Total SGST</span>
                          <span>₹ {totalSGST.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>Total CGST</span>
                          <span>₹ {totalCGST.toFixed(2)}</span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between text-gray-600">
                      <span>Total Tax Amount</span>
                      <span>₹ {totalTax.toFixed(2)}</span>
                    </div>
                  </>
                )}

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

                <div className="flex justify-between font-bold text-gray-900 text-base border-t pt-2">
                  <span>Amount to Collect</span>
                  <span>₹ {grandTotal.toFixed(2)}</span>
                </div>

                <div className="rounded-lg border border-emerald-200 bg-emerald-50/80 px-3 py-2.5">
                  <div className="flex justify-between items-center gap-3">
                    <span className="text-sm font-semibold text-emerald-900">
                      {values.saleMode === "credit"
                        ? "Advance Received"
                        : "Received Amount"}
                    </span>
                    <input
                      type="number"
                      name="receivedAmount"
                      value={values.receivedAmount}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onKeyDown={blockNeg}
                      min="0"
                      step="0.01"
                      placeholder={values.saleMode === "credit" ? "0" : "0"}
                      className="w-32 rounded-md border border-emerald-300 bg-white px-2 py-1.5 text-sm font-semibold text-right text-emerald-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    />
                  </div>
                  {values.saleMode === "credit" && (
                    <p className="mt-1 text-xs text-emerald-800">
                      Leave empty to bill the full amount on credit.
                    </p>
                  )}
                </div>

                {(values.saleMode === "credit" || balanceDue > 0) && (
                  <div className="flex justify-between text-orange-600 font-medium">
                    <span>Balance Due</span>
                    <span>₹ {balanceDue.toFixed(2)}</span>
                  </div>
                )}

                <p className="text-gray-400 text-xs italic pt-1">
                  {amountInWords(grandTotal)}
                </p>
              </div>
            </div>
          </div>

          {/* ── Notes ────────────────────────────────────── */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <FormTextArea
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
          mode="sales"
          salesType={values.salesType}
          onClose={() => {
            setQuickAdd(null);
            setProductRowIndex(null);
          }}
          onPartySuccess={(data) => {
            const id = getEntityId(data);
            const c = data as { name?: string };
            const opt = toOption(id, c.name ?? "Customer", data);
            setFieldValue("customerId", id);
            setCustomerOption(opt);
            fillCustomerDetails(id, data);
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
