"use client";

import { useFormik, FieldArray, FormikProvider, getIn } from "formik";
import * as Yup from "yup";
import { useRouter, useSearchParams } from "next/navigation";
import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/app/utilsComponents/PageHeader";
import { useCreateSalesInvoice } from "@/app/hooks/salesHooks/useSalesInvoice";
import {
  useQuotation,
  useQuotations,
} from "@/app/hooks/salesHooks/useQuotation";
import {
  useWarehouses,
  useWarehouseStock,
} from "@/app/hooks/warehouseHooks/useWarehouse";
import { usePriceLevels } from "@/app/hooks/masterHooks/priceLevelHook/usePriceLevel";
import { useTaxMasters } from "@/app/hooks/masterHooks/taxMasterHook/useTaxMaster";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { FORM_LOOKUP_LIMIT } from "@/app/config/pagination";
import {
  loadSalesCustomers,
  loadItems,
  mapStaticOptions,
} from "@/app/formComponents/masterLoadOptions";
import { itemService } from "@/app/services/masterServices/item/item.service";
import { toOption, type SelectOption } from "@/app/formComponents/selectTypes";
import { Quotation, SalesItemRow } from "@/app/types";
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
import {
  invoiceItemsTableClass,
  invoiceSummaryPanelClass,
  invoiceSummaryGrandTotalClass,
} from "@/app/utilsComponents/report-ui";
import {
  appendMergedInvoiceRow,
  clearInvoiceRowCalculated,
  clearInvoiceRowQtyDependents,
  computeInvoiceTotalsFromItems,
  focusLastItemRow,
} from "@/app/utilsComponents/invoiceFormUtils";
import NextDocumentNumberField from "@/app/formComponents/NextDocumentNumberField";
import {
  calculateLineGst,
  gstSupplyTypeLabel,
  normalizeStateCode,
  resolveGstSupplyType,
  stateCodeFromGstin,
} from "@/app/utils/gstTax";
import { itemSalesRate } from "@/app/utils/itemRates";
import { useCompanySettings } from "@/app/hooks/settingsHook/useSettings";
import toast from "react-hot-toast";
import InvoicePaymentDetailsForm, {
  emptyInvoicePaymentRow,
  resolvePaymentsForSubmit,
  resolveReceivedPaidAmount,
  sumInvoicePayments,
  type InvoicePaymentFormRow,
} from "@/app/utilsComponents/InvoicePaymentDetailsForm";
import {
  InvoicePaymentAccountSelect,
  InvoicePaymentMethodSelect,
} from "@/app/utilsComponents/invoicePaymentFields";
import {
  DEFAULT_INVOICE_PAYMENT_MODE,
  needsBankAccount,
  resolveCustomerName,
} from "@/app/utilsComponents/paymentConstants";

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
  rateManual: false,
  taxManual: false,
  taxMasterId: "",
  defaultTaxPercent: 0,
  defaultTaxMasterId: "",
});

const resolveItemTax = (item: any) => {
  const taxMaster =
    typeof item?.taxMasterId === "object" && item.taxMasterId
      ? item.taxMasterId
      : null;
  const taxPercent = Number(taxMaster?.taxPercent ?? item?.taxPercent) || 0;
  const taxMasterId =
    taxMaster?._id ??
    (typeof item?.taxMasterId === "string" ? item.taxMasterId : "");
  return { taxPercent, taxMasterId };
};

const calcRow = (
  row: SalesItemRow,
  priceLevelPct: number,
  supplierStateCode: string,
  placeOfSupplyStateCode: string
): SalesItemRow => {
  const baseRate = row.baseRate;
  const rate = row.rateManual
    ? Number(row.rate) || 0
    : Number((baseRate + (baseRate * priceLevelPct) / 100).toFixed(2));
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
  const total = Number(
    (taxableValue + gst.sgst + gst.cgst + gst.igst).toFixed(2)
  );
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

export default function SalesInvoiceForm({
  onPendingChange,
}: {
  onPendingChange?: (pending: boolean) => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const presetQuotationId = searchParams.get("quotationId") ?? "";
  const [selectedQuotationId, setSelectedQuotationId] =
    useState(presetQuotationId);
  const lastAppliedQuotationIdRef = useRef("");
  const prevSalesTypeRef = useRef<string | null>(null);
  const { mutate: create, isPending } = useCreateSalesInvoice();

  useEffect(() => {
    onPendingChange?.(isPending);
  }, [isPending, onPendingChange]);
  const activeBranch = useBranchStore((s) => s.activeBranch);

  // ── API Data ──────────────────────────────────────────────
  const { data: priceLevelData } = usePriceLevels();
  const { data: taxMasterData } = useTaxMasters({
    isActive: true,
    limit: FORM_LOOKUP_LIMIT,
  });
  const { data: warehouseData } = useWarehouses({ limit: FORM_LOOKUP_LIMIT });
  const { data: companySettings } = useCompanySettings();
  const { data: quotationsListData } = useQuotations({
    page: 1,
    limit: FORM_LOOKUP_LIMIT,
  });
  const { data: selectedQuotation } = useQuotation(selectedQuotationId);

  const priceLevels = priceLevelData?.data ?? [];
  const taxMasterOptions = useMemo(
    () =>
      (taxMasterData?.data ?? []).map((t) => ({
        value: t._id,
        label: `${t.name} (${t.taxPercent}%)`,
        taxPercent: t.taxPercent,
      })),
    [taxMasterData]
  );
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
  const valuesRef = useRef<{ items: SalesItemRow[]; warehouseId?: string }>({
    items: [emptyRow()],
  });
  const activePriceLevelPctRef = useRef(0);
  const [payments, setPayments] = useState<InvoicePaymentFormRow[]>([
    emptyInvoicePaymentRow(DEFAULT_INVOICE_PAYMENT_MODE),
  ]);

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
              return this.createError({
                message: "Future dates are not allowed",
              });
            }
            if (!allowPastDates && value !== today) {
              return this.createError({
                message: keyboard.pastDatesValidationMessage,
              });
            }
            return true;
          }),
        salesType: Yup.string().required("Sales type is required"),
        customerId: Yup.string().required("Customer is required"),
        warehouseId: Yup.string().required("Warehouse is required"),
        cashDiscountAmt: Yup.number().min(0),
        receivedAmount: Yup.number()
          .transform((_v, orig) =>
            orig === "" || orig == null ? 0 : Number(orig)
          )
          .min(0, "Cannot be negative")
          .test(
            "max-collect",
            "Cannot exceed amount to collect",
            function (value) {
              const items = this.parent?.items;
              if (!Array.isArray(items)) return true;
              const grand = computeInvoiceTotalsFromItems(
                items,
                this.parent?.cashDiscountAmt ?? 0
              ).grandTotal;
              return (Number(value) || 0) <= grand + 0.009;
            }
          ),
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
    [allowPastDates, today, keyboard.pastDatesValidationMessage]
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
      paymentMethod: DEFAULT_INVOICE_PAYMENT_MODE,
      paymentBankAccountId: "",
      items: [emptyRow()],
    },

    validationSchema,
    enableReinitialize: false,

    onSubmit: (values) => {
      const invoiceTotals = computeInvoiceTotalsFromItems(
        values.items,
        values.cashDiscountAmt
      );
      const paidAmount = resolveReceivedPaidAmount(
        invoiceTotals.grandTotal,
        values.receivedAmount,
        values.saleMode
      );
      const splitTotal = sumInvoicePayments(payments);
      const effectivePaidAmount =
        splitTotal > 0
          ? Math.min(splitTotal, invoiceTotals.grandTotal)
          : paidAmount;
      const paymentLines = resolvePaymentsForSubmit(
        payments,
        effectivePaidAmount,
        values.paymentMethod,
        values.paymentBankAccountId
      );

      if (splitTotal > effectivePaidAmount + 0.009) {
        toast.error("Payment split cannot exceed received amount");
        return;
      }
      if (splitTotal > 0 && splitTotal < effectivePaidAmount - 0.009) {
        toast.error("Payment split must equal received amount");
        return;
      }

      for (const line of paymentLines) {
        if (needsBankAccount(line.paymentMode) && !line.bankAccountId) {
          toast.error("Select a bank account for bank/UPI payments");
          return;
        }
      }

      const payload = {
        invoiceDate: values.invoiceDate,
        salesType: values.salesType,
        ...(values.priceLevelId ? { priceLevelId: values.priceLevelId } : {}),
        customerId: values.customerId,
        warehouseId: values.warehouseId,
        notes: values.notes,
        saleMode: values.saleMode,
        cashDiscountPercent: 0,
        cashDiscountAmt: Number(values.cashDiscountAmt) || 0,
        paidAmount: effectivePaidAmount,
        ...(effectivePaidAmount > 0 && paymentLines.length
          ? { payments: paymentLines }
          : {}),
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
          taxPercent: r.taxPercent,
          sgst: r.sgst,
          cgst: r.cgst,
          igst: r.igst ?? 0,
          total: r.total,
        })),
        ...(selectedQuotationId ? { quotationId: selectedQuotationId } : {}),
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

  const { data: warehouseStock } = useWarehouseStock(values.warehouseId);

  valuesRef.current = values;
  activePriceLevelPctRef.current = activePriceLevelPct;

  const stockByItemId = useMemo(() => {
    const map = new Map<string, number>();
    for (const row of warehouseStock ?? []) {
      const id =
        typeof row.itemId === "object"
          ? row.itemId._id
          : String(row.itemId ?? "");
      if (id) map.set(String(id), Number(row.qty) || 0);
    }
    return map;
  }, [warehouseStock]);

  const getAvailableQty = useCallback(
    (itemId: string) => {
      if (!values.warehouseId || !itemId) return null;
      return stockByItemId.get(String(itemId)) ?? 0;
    },
    [stockByItemId, values.warehouseId]
  );

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

  const resetPaymentInputs = () => {
    setFieldValue("receivedAmount", "");
    setFieldValue("paymentMethod", DEFAULT_INVOICE_PAYMENT_MODE);
    setFieldValue("paymentBankAccountId", "");
    setPayments([emptyInvoicePaymentRow(DEFAULT_INVOICE_PAYMENT_MODE)]);
  };

  const loadCustomerOptions = useCallback(
    (search: string) => loadSalesCustomers(search, values.salesType),
    [values.salesType]
  );

  const quotationSelectOptions = useMemo(() => {
    return (quotationsListData?.data ?? [])
      .filter((q) => q.status !== "converted" && q.status !== "cancelled")
      .map((q) => ({
        value: q._id,
        label: `${q.quotationNo} · ${resolveCustomerName(
          q
        )} · ₹ ${q.grandTotal.toFixed(2)}`,
      }));
  }, [quotationsListData]);

  const applyQuotationToForm = useCallback(
    (quotation: Quotation) => {
      prevSalesTypeRef.current = quotation.salesType;
      setFieldValue("salesType", quotation.salesType);

      const priceLevelId =
        typeof quotation.priceLevelId === "object"
          ? quotation.priceLevelId?._id
          : quotation.priceLevelId ?? "";
      if (priceLevelId) {
        setFieldValue("priceLevelId", priceLevelId);
        setActivePriceLevelPct(quotation.priceLevelSnapshot?.taxPercent ?? 0);
      }

      const customerId =
        typeof quotation.customerId === "object"
          ? quotation.customerId._id
          : quotation.customerId;
      if (customerId) {
        setFieldValue("customerId", customerId);
        const snap = quotation.customerSnapshot;
        const custName =
          snap?.name ||
          (typeof quotation.customerId === "object"
            ? quotation.customerId.name
            : "");
        setCustomerOption(toOption(customerId, custName, quotation.customerId));
        setCustomerDetails({
          gstin: snap?.gstin || "",
          place: snap?.place || "",
          state: snap?.state || "",
          stateCode: snap?.stateCode || "",
          address: snap?.address || "",
        });
      }

      const warehouseId =
        typeof quotation.warehouseId === "object"
          ? quotation.warehouseId?._id
          : quotation.warehouseId ?? "";
      if (warehouseId) {
        setFieldValue("warehouseId", warehouseId);
      }

      setFieldValue("notes", quotation.notes || "");

      setFieldValue("cashDiscountAmt", String(quotation.cashDiscountAmt ?? 0));

      const posState =
        normalizeStateCode(quotation.customerSnapshot?.stateCode) ||
        stateCodeFromGstin(quotation.customerSnapshot?.gstin) ||
        placeOfSupplyStateCode;

      const mappedItems = quotation.items.map((item, index) => {
        const row: SalesItemRow = {
          slNo: item.slNo ?? index + 1,
          itemId:
            typeof item.itemId === "object" ? item.itemId._id : item.itemId,
          itemName: typeof item.itemId === "object" ? item.itemId.name : "",
          hsn: item.hsn || "",
          uomId: typeof item.uomId === "object" ? item.uomId._id : item.uomId,
          uomName:
            typeof item.uomId === "object"
              ? `${item.uomId.name} (${item.uomId.shortCode})`
              : "",
          baseRate: item.baseRate,
          priceLevelPct: item.priceLevelPct ?? 0,
          rate: item.rate,
          qty: String(item.qty),
          discount: String(item.discount ?? 0),
          discountAmt: item.discountAmt ?? 0,
          taxableValue: item.taxableValue,
          taxPercent: item.taxPercent,
          sgst: item.sgst,
          cgst: item.cgst,
          igst: item.igst ?? 0,
          total: item.total,
          rateManual: false,
          taxManual: false,
          taxMasterId: "",
          defaultTaxPercent: item.taxPercent,
          defaultTaxMasterId: "",
        };
        return calcRow(
          row,
          quotation.priceLevelSnapshot?.taxPercent ?? 0,
          supplierStateCode,
          posState
        );
      });
      if (mappedItems.length) {
        setFieldValue("items", mappedItems);
      }
    },
    [setFieldValue, supplierStateCode, placeOfSupplyStateCode]
  );

  useEffect(() => {
    if (presetQuotationId) {
      setSelectedQuotationId(presetQuotationId);
      lastAppliedQuotationIdRef.current = "";
    }
  }, [presetQuotationId]);

  useEffect(() => {
    if (!allowPastDates && values.invoiceDate !== today) {
      setFieldValue("invoiceDate", today);
    }
  }, [allowPastDates, today, values.invoiceDate, setFieldValue]);

  useEffect(() => {
    if (selectedQuotationId) return;
    const defaultType = companySettings?.defaultSalesType;
    if (!defaultType) return;
    setFieldValue("salesType", defaultType);
  }, [
    selectedQuotationId,
    companySettings?._id,
    companySettings?.defaultSalesType,
    setFieldValue,
  ]);

  useEffect(() => {
    if (!selectedQuotation || !selectedQuotationId) return;
    if (lastAppliedQuotationIdRef.current === selectedQuotationId) return;
    lastAppliedQuotationIdRef.current = selectedQuotationId;
    applyQuotationToForm(selectedQuotation);
  }, [selectedQuotation, selectedQuotationId, applyQuotationToForm]);

  // ── When salesType changes → reset customer ───────────────
  useEffect(() => {
    if (prevSalesTypeRef.current === null) {
      prevSalesTypeRef.current = values.salesType;
      return;
    }
    if (prevSalesTypeRef.current === values.salesType) return;
    prevSalesTypeRef.current = values.salesType;
    setFieldValue("customerId", "");
    setCustomerOption(null);
    setCustomerDetails({
      gstin: "",
      place: "",
      state: "",
      stateCode: "",
      address: "",
    });
  }, [values.salesType, setFieldValue]);

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
      calcRow(
        { ...row, rateManual: false },
        pct,
        supplierStateCode,
        placeOfSupplyStateCode
      )
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
    const { taxPercent, taxMasterId } = resolveItemTax(item);
    const updated: SalesItemRow = clearInvoiceRowQtyDependents({
      ...emptyRow(),
      slNo: current.slNo || index + 1,
      itemId: String(item?._id ?? item?.id ?? ""),
      itemName: item?.name || "",
      hsn: item?.hsnCode || item?.hsn || "",
      uomId:
        typeof item?.uomId === "object" ? item.uomId._id : item?.uomId || "",
      uomName:
        typeof item?.uomId === "object"
          ? `${item.uomId.name} (${item.uomId.shortCode})`
          : "",
      baseRate: itemSalesRate(item),
      priceLevelPct,
      rateManual: false,
      taxManual: false,
      taxPercent,
      taxMasterId,
      defaultTaxPercent: taxPercent,
      defaultTaxMasterId: taxMasterId,
    });
    updateRow(
      index,
      calcRow(updated, priceLevelPct, supplierStateCode, placeOfSupplyStateCode)
    );

    const available = getAvailableQty(String(item?._id ?? item?.id ?? ""));
    if (available !== null && available <= 0) {
      toast.error(
        `No stock available for ${
          item?.name || "this item"
        }. Quantity cannot be added.`
      );
    }
  };

  const handleItemSelect = async (
    index: number,
    itemId: string,
    itemData?: any
  ) => {
    if (!itemId) {
      updateRow(index, { ...emptyRow(), slNo: index + 1 });
      return;
    }

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
  const handleQtyChange = (index: number, value: string) => {
    const current = valuesRef.current.items[index] ?? emptyRow();
    const qtyNum = Number(value) || 0;

    if (qtyNum > 0 && current.itemId) {
      if (!valuesRef.current.warehouseId) {
        toast.error("Select a warehouse before entering quantity");
        return;
      }
      const available = getAvailableQty(current.itemId);
      if (available !== null && available <= 0) {
        toast.error(
          `No stock available for ${
            current.itemName || "this item"
          }. Quantity cannot be added.`
        );
        return;
      }
    }

    const updated = clearInvoiceRowCalculated({
      ...current,
      qty: value,
      discount: "0",
    });
    updateRow(
      index,
      calcRow(
        updated,
        activePriceLevelPctRef.current,
        supplierStateCode,
        placeOfSupplyStateCode
      )
    );
    resetPaymentInputs();
  };

  const handleRowChange = (index: number, field: "discount", value: string) => {
    const current = valuesRef.current.items[index] ?? emptyRow();
    const updated = clearInvoiceRowCalculated({ ...current, [field]: value });
    updateRow(
      index,
      calcRow(
        updated,
        activePriceLevelPctRef.current,
        supplierStateCode,
        placeOfSupplyStateCode
      )
    );
  };

  const toggleRateEdit = (index: number) => {
    const row = valuesRef.current.items[index] ?? emptyRow();
    if (row.rateManual) {
      updateRow(
        index,
        calcRow(
          { ...row, rateManual: false },
          activePriceLevelPctRef.current,
          supplierStateCode,
          placeOfSupplyStateCode
        )
      );
      toast.success("Rate reset to product sales rate");
      return;
    }
    updateRow(index, { ...row, rateManual: true });
    toast.success(keyboard.rateEditableToast);
  };

  const handleRateChange = (index: number, value: string) => {
    const current = valuesRef.current.items[index] ?? emptyRow();
    const rate = Number(value) || 0;
    updateRow(
      index,
      calcRow(
        clearInvoiceRowCalculated({ ...current, rate, rateManual: true }),
        activePriceLevelPctRef.current,
        supplierStateCode,
        placeOfSupplyStateCode
      )
    );
  };

  const handleRateKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "F2") {
      e.preventDefault();
      toggleRateEdit(index);
      return;
    }
    blockNeg(e);
  };

  const toggleTaxEdit = (index: number) => {
    const row = valuesRef.current.items[index] ?? emptyRow();
    if (row.taxManual) {
      updateRow(
        index,
        calcRow(
          {
            ...row,
            taxManual: false,
            taxPercent: row.defaultTaxPercent ?? row.taxPercent,
            taxMasterId: row.defaultTaxMasterId ?? row.taxMasterId,
          },
          activePriceLevelPctRef.current,
          supplierStateCode,
          placeOfSupplyStateCode
        )
      );
      toast.success("GST reset to product default");
      return;
    }
    const match =
      !row.taxMasterId && taxMasterOptions.length
        ? taxMasterOptions.find((t) => t.taxPercent === row.taxPercent) ??
          taxMasterOptions[0]
        : null;
    updateRow(
      index,
      match
        ? calcRow(
            {
              ...row,
              taxManual: true,
              taxMasterId: match.value,
              taxPercent: match.taxPercent,
            },
            activePriceLevelPctRef.current,
            supplierStateCode,
            placeOfSupplyStateCode
          )
        : { ...row, taxManual: true }
    );
    toast.success(keyboard.gstEditableToast);
  };

  const handleTaxMasterChange = (index: number, taxMasterId: string) => {
    const current = valuesRef.current.items[index] ?? emptyRow();
    const selected = taxMasterOptions.find((t) => t.value === taxMasterId);
    const taxPercent = selected?.taxPercent ?? 0;
    updateRow(
      index,
      calcRow(
        clearInvoiceRowCalculated({
          ...current,
          taxMasterId,
          taxPercent,
          taxManual: true,
        }),
        activePriceLevelPctRef.current,
        supplierStateCode,
        placeOfSupplyStateCode
      )
    );
  };

  const handleTaxKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (e.key === "F3") {
      e.preventDefault();
      toggleTaxEdit(index);
    }
  };

  const taxMasterLabel = (row: SalesItemRow) => {
    if (row.taxMasterId) {
      const match = taxMasterOptions.find((t) => t.value === row.taxMasterId);
      if (match) return match.label;
    }
    return `${row.taxPercent}%`;
  };

  const totals = computeInvoiceTotalsFromItems(
    values.items,
    values.cashDiscountAmt
  );
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

  const paidAmount = resolveReceivedPaidAmount(
    grandTotal,
    values.receivedAmount,
    values.saleMode
  );
  const balanceDue = Number((grandTotal - paidAmount).toFixed(2));

  return (
    <FormikProvider value={formik}>
      <div className="w-full mx-auto p-5">
        <PageHeader
          title="New Sales Invoice"
          description="Create a sales invoice"
        />

        <InvoiceFormKeyboardHints
          allowPastDates={allowPastDates}
          keyboard={keyboard}
        />

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
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  <span className="text-red-500">* </span>
                  Sales Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {(["retail", "wholesale"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFieldValue("salesType", type)}
                      className={`rounded-md border px-4 py-2 text-sm font-medium transition ${
                        values.salesType === type
                          ? "border-[#1E2235] bg-[#1E2235] text-white"
                          : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {type === "retail" ? "Retail" : "Wholesale"}
                    </button>
                  ))}
                </div>
                {touched.salesType && errors.salesType && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.salesType}
                  </p>
                )}
              </div>

              {/* Price Level */}
              <FormSelect
                label="Price Level"
                name="priceLevelId"
                value={values.priceLevelId}
                enterNav
                placeholder="Select price level (optional)"
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

              <FormSelect
                label="Quotation"
                name="selectedQuotationId"
                value={selectedQuotationId}
                enterNav
                disabled={!!presetQuotationId}
                placeholder="Load from quotation (optional)"
                options={quotationSelectOptions}
                onChange={(e) => {
                  lastAppliedQuotationIdRef.current = "";
                  setSelectedQuotationId(e.target.value);
                }}
                onBlur={() => {}}
              />

              <div className="md:col-span-2 lg:col-span-3 flex flex-col gap-6 sm:flex-row sm:flex-wrap sm:items-end sm:gap-x-16">
                <div>
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
                            setFieldValue(
                              "paymentMethod",
                              DEFAULT_INVOICE_PAYMENT_MODE
                            );
                            setFieldValue("paymentBankAccountId", "");
                            setPayments([
                              emptyInvoicePaymentRow(
                                DEFAULT_INVOICE_PAYMENT_MODE
                              ),
                            ]);
                          } else {
                            const nextTotals = computeInvoiceTotalsFromItems(
                              values.items,
                              values.cashDiscountAmt
                            );
                            setFieldValue(
                              "receivedAmount",
                              nextTotals.grandTotal > 0
                                ? String(nextTotals.grandTotal)
                                : ""
                            );
                            setFieldValue(
                              "paymentMethod",
                              DEFAULT_INVOICE_PAYMENT_MODE
                            );
                            setFieldValue("paymentBankAccountId", "");
                            setPayments([
                              emptyInvoicePaymentRow(
                                DEFAULT_INVOICE_PAYMENT_MODE
                              ),
                            ]);
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

                <div className="min-w-[200px] flex-1 sm:max-w-xs">
                  <InvoicePaymentMethodSelect
                    name="paymentMethod"
                    value={values.paymentMethod}
                    onChange={(e) => {
                      handleChange(e);
                      if (!needsBankAccount(e.target.value)) {
                        setFieldValue("paymentBankAccountId", "");
                      }
                    }}
                    onBlur={handleBlur}
                  />
                </div>

                {needsBankAccount(values.paymentMethod) && (
                  <div className="min-w-[200px] flex-1 sm:max-w-xs">
                    <InvoicePaymentAccountSelect
                      paymentMode={values.paymentMethod}
                      name="paymentBankAccountId"
                      value={values.paymentBankAccountId}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                )}
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
              {({ remove, replace }) => {
                replaceRowRef.current = (index, row) => replace(index, row);
                pushRowRef.current = () => {
                  const { nextItems, merged } = appendMergedInvoiceRow(
                    valuesRef.current.items,
                    emptyRow,
                    (row) =>
                      calcRow(
                        row,
                        activePriceLevelPctRef.current,
                        supplierStateCode,
                        placeOfSupplyStateCode
                      )
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
                            <th className="px-3 py-3 text-left w-8">#</th>
                            <th className="px-3 py-3 text-left min-w-[200px]">
                              Item
                            </th>
                            <th className="px-3 py-3 text-left w-20">HSN</th>
                            <th className="px-3 py-3 text-left w-24">UOM</th>
                            <th className="px-3 py-3 text-right w-24">Rate</th>
                            <th className="px-3 py-3 text-right w-20">Qty</th>
                            <th className="px-3 py-3 text-right w-20">Disc%</th>
                            <th className="px-3 py-3 text-right w-24">GST %</th>
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
                            const rowTouched = getIn(
                              touched,
                              `items[${index}]`
                            );
                            const rowErrors = getIn(errors, `items[${index}]`);
                            const availableQty =
                              row.itemId && values.warehouseId
                                ? stockByItemId.get(String(row.itemId)) ?? 0
                                : null;
                            const outOfStock =
                              availableQty !== null && availableQty <= 0;

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
                                      !!(
                                        rowTouched?.itemId && rowErrors?.itemId
                                      )
                                    }
                                    error={rowErrors?.itemId}
                                    onChange={(id, opt) =>
                                      handleItemSelect(index, id, opt?.data)
                                    }
                                    addLabel="Add Product"
                                    onAddClick={() => openProductAdd(index)}
                                  />
                                </td>

                                {/* HSN — auto from product, readonly */}
                                <td className="px-3 py-2">
                                  <input
                                    value={row.hsn}
                                    readOnly
                                    disabled
                                    tabIndex={-1}
                                    placeholder="HSN"
                                    className="w-full border-b border-gray-200 bg-transparent py-1 text-sm text-gray-500 cursor-not-allowed"
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

                                {/* Rate — product sales rate; F2 to edit for this line */}
                                <td className="px-3 py-2">
                                  {row.rateManual ? (
                                    <input
                                      type="number"
                                      data-enter-nav="field"
                                      value={row.rate}
                                      onChange={(e) =>
                                        handleRateChange(index, e.target.value)
                                      }
                                      onKeyDown={(e) =>
                                        handleRateKeyDown(index, e)
                                      }
                                      min="0"
                                      step="0.01"
                                      placeholder="0.00"
                                      className="w-full border-b border-amber-400 bg-amber-50/50 py-1 text-sm text-right outline-none focus:border-blue-600"
                                    />
                                  ) : (
                                    <input
                                      value={row.rate.toFixed(2)}
                                      readOnly
                                      tabIndex={0}
                                      onKeyDown={(e) =>
                                        handleRateKeyDown(index, e)
                                      }
                                      title={keyboard.editRateTitle}
                                      className={`w-full border-b bg-transparent py-1 text-sm text-right outline-none focus:border-blue-600 ${
                                        row.itemId
                                          ? "border-gray-300 text-gray-800 cursor-pointer"
                                          : "border-gray-200 text-gray-600 cursor-not-allowed"
                                      }`}
                                    />
                                  )}
                                </td>

                                {/* Qty */}
                                <td className="px-3 py-2">
                                  <input
                                    type="number"
                                    data-enter-nav="field"
                                    value={row.qty}
                                    onChange={(e) =>
                                      handleQtyChange(index, e.target.value)
                                    }
                                    onKeyDown={blockNeg}
                                    min="0"
                                    step="0.01"
                                    placeholder="0"
                                    disabled={outOfStock}
                                    title={
                                      outOfStock
                                        ? "No stock available for this item"
                                        : undefined
                                    }
                                    className={`w-full border-b bg-transparent py-1 text-sm text-right outline-none focus:border-blue-600
                                    ${
                                      outOfStock
                                        ? "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400"
                                        : rowTouched?.qty && rowErrors?.qty
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

                                {/* GST % — product default; F3 to pick tax master slab */}
                                <td className="px-3 py-2">
                                  {row.taxManual ? (
                                    <select
                                      data-enter-nav="field"
                                      value={row.taxMasterId || ""}
                                      onChange={(e) =>
                                        handleTaxMasterChange(
                                          index,
                                          e.target.value
                                        )
                                      }
                                      onKeyDown={(e) =>
                                        handleTaxKeyDown(index, e)
                                      }
                                      className="w-full border-b border-amber-400 bg-amber-50/50 py-1 text-sm text-right outline-none focus:border-blue-600"
                                    >
                                      <option value="" disabled>
                                        Select GST
                                      </option>
                                      {taxMasterOptions.map((tm) => (
                                        <option key={tm.value} value={tm.value}>
                                          {tm.label}
                                        </option>
                                      ))}
                                    </select>
                                  ) : (
                                    <input
                                      value={
                                        row.itemId ? taxMasterLabel(row) : "—"
                                      }
                                      readOnly
                                      tabIndex={0}
                                      onKeyDown={(e) =>
                                        handleTaxKeyDown(index, e)
                                      }
                                      title={keyboard.editGstTitle}
                                      className={`w-full border-b bg-transparent py-1 text-sm text-right outline-none focus:border-blue-600 ${
                                        row.itemId
                                          ? "border-gray-300 text-gray-800 cursor-pointer"
                                          : "border-gray-200 text-gray-600 cursor-not-allowed"
                                      }`}
                                    />
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
                                        {row.sgst > 0
                                          ? row.sgst.toFixed(2)
                                          : "—"}
                                      </td>
                                      <td className="px-3 py-2 text-right text-gray-700">
                                        {row.cgst > 0
                                          ? row.cgst.toFixed(2)
                                          : "—"}
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

            {/* ── Summary ──────────────────────────────────── */}
            <div className="flex flex-col gap-6 border-t bg-gray-50 p-6 lg:flex-row lg:items-start lg:justify-between">
              <InvoicePaymentDetailsForm
                grandTotal={grandTotal}
                receivedAmount={paidAmount}
                payments={payments}
                onPaymentsChange={setPayments}
                saleMode={values.saleMode}
              />
              <div className={invoiceSummaryPanelClass}>
                <div className="flex justify-between text-gray-600 border-t pt-2">
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
                <div className="flex justify-between text-red-600">
                  <span>Discount Amount</span>
                  <span>- ₹ {cashDiscountAmt.toFixed(2)}</span>
                </div>

                <div className={invoiceSummaryGrandTotalClass}>
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
                      placeholder="0"
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
