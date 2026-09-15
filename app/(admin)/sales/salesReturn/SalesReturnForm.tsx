"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/app/utilsComponents/PageHeader";
import FormTextArea from "@/app/formComponents/FormTextArea";
import FormInput from "@/app/formComponents/FormText";
import FormDateInput from "@/app/formComponents/FormDate";
import FormSelect from "@/app/formComponents/FormSelect";
import FormSelectWithAdd from "@/app/formComponents/FormSelectWithAdd";
import ItemSelectWithAdd from "@/app/formComponents/ItemSelectWithAdd";
import { useSalesInvoices, useSalesInvoice } from "@/app/hooks/salesHooks/useSalesInvoice";
import { LOOKUP_LIMIT, FORM_LOOKUP_LIMIT } from "@/app/config/pagination";
import {
  useCreateSalesReturn,
  useSalesReturnableItems,
} from "@/app/hooks/salesHooks/useSalesReturn";
import { useWarehouses } from "@/app/hooks/warehouseHooks/useWarehouse";
import { usePriceLevels } from "@/app/hooks/masterHooks/priceLevelHook/usePriceLevel";
import { SALES_RETURN_FORM_ID } from "@/app/utilsComponents/form-footer";
import {
  loadSalesCustomers,
  loadItems,
  mapStaticOptions,
} from "@/app/formComponents/masterLoadOptions";
import { useInvoiceFormShortcuts } from "@/app/hooks/useInvoiceFormShortcuts";
import InvoiceFormKeyboardHints from "@/app/utilsComponents/InvoiceFormKeyboardHints";
import { invoiceItemsTableClass, invoiceSummaryPanelClass, invoiceSummaryGrandTotalClass } from "@/app/utilsComponents/report-ui";
import InvoiceQuickAddModals, {
  getEntityId,
  type QuickAddModal,
} from "@/app/utilsComponents/InvoiceQuickAddModals";
import type { SelectOption } from "@/app/formComponents/selectTypes";
import toast from "react-hot-toast";
import NextDocumentNumberField from "@/app/formComponents/NextDocumentNumberField";
import { itemSalesRate } from "@/app/utils/itemRates";
import { useCompanySettings } from "@/app/hooks/settingsHook/useSettings";

interface SalesReturnFormProps {
  onPendingChange?: (pending: boolean) => void;
}

type ReturnMode = "invoice" | "manual";

type ReturnQtyRow = {
  invoiceItemId: string;
  slNo: number;
  itemName: string;
  hsn: string;
  rate: number;
  originalQty: number;
  returnedQty: number;
  returnableQty: number;
  returnQty: string;
};

type ManualLine = {
  key: string;
  itemId: string;
  itemName: string;
  baseRate: number;
  taxPercent: number;
  qty: string;
  rate: string;
  discount: string;
};

const calcManualLineTotals = (line: ManualLine) => {
  const rate = Number(line.rate) || 0;
  const qty = Number(line.qty) || 0;
  const discount = Number(line.discount) || 0;
  const grossAmt = Number((rate * qty).toFixed(2));
  const discountAmt = Number(((grossAmt * discount) / 100).toFixed(2));
  const taxableValue = Number((grossAmt - discountAmt).toFixed(2));
  const sgst = Number(((taxableValue * 9) / 100).toFixed(2));
  const cgst = Number(((taxableValue * 9) / 100).toFixed(2));
  const total = Number((taxableValue + sgst + cgst).toFixed(2));
  return { taxableValue, sgst, cgst, total };
};

const applyPriceLevelRate = (baseRate: number, priceLevelPct: number) =>
  Number((baseRate + (baseRate * priceLevelPct) / 100).toFixed(2));

const blockNeg = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (["-", "e", "E", "+"].includes(e.key)) e.preventDefault();
};

const newManualLine = (): ManualLine => ({
  key: `${Date.now()}-${Math.random()}`,
  itemId: "",
  itemName: "",
  baseRate: 0,
  taxPercent: 0,
  qty: "",
  rate: "",
  discount: "0",
});

export default function SalesReturnForm({ onPendingChange }: SalesReturnFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const presetInvoiceId = searchParams.get("invoiceId") ?? "";

  const [returnMode, setReturnMode] = useState<ReturnMode>("invoice");
  const [invoiceId, setInvoiceId] = useState(presetInvoiceId);
  const [returnDate, setReturnDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  const [returnQtys, setReturnQtys] = useState<Record<string, string>>({});

  const [customerId, setCustomerId] = useState("");
  const [customerOption, setCustomerOption] = useState<SelectOption | null>(null);
  const [warehouseId, setWarehouseId] = useState("");
  const [salesType, setSalesType] = useState<"retail" | "wholesale">("retail");
  const [priceLevelId, setPriceLevelId] = useState("");
  const [activePriceLevelPct, setActivePriceLevelPct] = useState(0);
  const prevSalesTypeRef = useRef<"retail" | "wholesale" | null>(null);
  const [referenceInvoiceNo, setReferenceInvoiceNo] = useState("");
  const [manualLines, setManualLines] = useState<ManualLine[]>([newManualLine()]);
  const [quickAdd, setQuickAdd] = useState<QuickAddModal>(null);
  const [productRowKey, setProductRowKey] = useState<string | null>(null);

  const { formRef, allowPastDates, today, minDate, maxDate, handleFormKeyDown, dateHint } =
    useInvoiceFormShortcuts();

  const { data: invoiceList } = useSalesInvoices({ limit: LOOKUP_LIMIT });
  const { data: sourceInvoice } = useSalesInvoice(invoiceId);
  const { data: warehouseData } = useWarehouses({ limit: FORM_LOOKUP_LIMIT, isActive: true });
  const { data: priceLevelData } = usePriceLevels({ isActive: true });
  const { data: companySettings } = useCompanySettings();

  useEffect(() => {
    const defaultType = companySettings?.defaultSalesType;
    if (defaultType) setSalesType(defaultType);
  }, [companySettings?._id, companySettings?.defaultSalesType]);

  useEffect(() => {
    if (prevSalesTypeRef.current === null) {
      prevSalesTypeRef.current = salesType;
      return;
    }
    if (prevSalesTypeRef.current === salesType) return;
    prevSalesTypeRef.current = salesType;
    setCustomerId("");
    setCustomerOption(null);
  }, [salesType]);

  const manualTotals = useMemo(() => {
    return manualLines.reduce(
      (acc, line) => {
        if (!line.itemId || !Number(line.qty)) return acc;
        const row = calcManualLineTotals(line);
        acc.netAmount += row.taxableValue;
        acc.totalSGST += row.sgst;
        acc.totalCGST += row.cgst;
        acc.grandTotal += row.total;
        return acc;
      },
      { netAmount: 0, totalSGST: 0, totalCGST: 0, grandTotal: 0 }
    );
  }, [manualLines]);

  const confirmedInvoices = useMemo(
    () => (invoiceList?.data ?? []).filter((inv) => inv.status === "confirmed"),
    [invoiceList]
  );
  const warehouseOptions = useMemo(
    () => mapStaticOptions(warehouseData?.data ?? []),
    [warehouseData]
  );
  const priceLevelOptions = useMemo(
    () =>
      (priceLevelData?.data ?? []).map((pl) => ({
        label: `${pl.name} (${pl.taxPercent}%)`,
        value: pl._id,
      })),
    [priceLevelData]
  );
  const invoiceOptions = useMemo(
    () =>
      confirmedInvoices.map((inv) => ({
        value: inv._id,
        label: `${inv.invoiceNo} (${inv.salesType}) — ${
          typeof inv.customerId === "object" ? inv.customerId.name : "—"
        }`,
      })),
    [confirmedInvoices]
  );

  const {
    data: returnable,
    isLoading: loadingReturnable,
    isError: returnableError,
  } = useSalesReturnableItems(returnMode === "invoice" ? invoiceId : "");

  const { mutate: createReturn, isPending } = useCreateSalesReturn();

  useEffect(() => {
    onPendingChange?.(isPending);
  }, [isPending, onPendingChange]);

  useEffect(() => {
    if (!allowPastDates && returnDate !== today) {
      setReturnDate(today);
    }
  }, [allowPastDates, today, returnDate]);

  useEffect(() => {
    if (!returnable?.items) {
      setReturnQtys({});
      return;
    }
    const next: Record<string, string> = {};
    for (const row of returnable.items) {
      next[row.invoiceItemId] = "";
    }
    setReturnQtys(next);
  }, [returnable]);

  const rows: ReturnQtyRow[] = useMemo(() => {
    if (!returnable?.items) return [];
    return returnable.items.map((row) => {
      const invLine = sourceInvoice?.items.find(
        (item) => String((item as { _id?: string })._id) === String(row.invoiceItemId)
      ) as { itemId?: { name?: string; hsn?: string } | string; hsn?: string } | undefined;
      const rawItemId = invLine?.itemId;
      const itemName =
        rawItemId && typeof rawItemId === "object"
          ? rawItemId.name ?? `Line ${row.slNo}`
          : `Line ${row.slNo}`;
      const hsn =
        row.hsn ||
        invLine?.hsn ||
        (typeof rawItemId === "object" ? rawItemId?.hsn : undefined) ||
        "—";
      return {
        invoiceItemId: row.invoiceItemId,
        slNo: row.slNo,
        itemName,
        hsn,
        rate: row.rate,
        originalQty: row.originalQty,
        returnedQty: row.returnedQty,
        returnableQty: row.returnableQty,
        returnQty: returnQtys[row.invoiceItemId] ?? "",
      };
    });
  }, [returnable, returnQtys, sourceInvoice]);

  const handleManualItemChange = (key: string, field: keyof ManualLine, value: string) => {
    setManualLines((prev) =>
      prev.map((line) => (line.key === key ? { ...line, [field]: value } : line))
    );
  };

  const handlePriceLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setPriceLevelId(id);
    const pl = (priceLevelData?.data ?? []).find((p) => p._id === id);
    const pct = Number(pl?.taxPercent ?? 0);
    setActivePriceLevelPct(pct);
    setManualLines((prev) =>
      prev.map((line) => {
        if (!line.baseRate) return line;
        const rate = applyPriceLevelRate(line.baseRate, pct);
        return { ...line, rate: String(rate) };
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (returnMode === "manual") {
      if (!customerId) return toast.error("Select a customer");
      if (!warehouseId) return toast.error("Select a warehouse");
      if (!priceLevelId) return toast.error("Select a price level");

      const items = manualLines
        .map((line) => ({
          itemId: line.itemId,
          qty: Number(line.qty),
          rate: Number(line.rate),
          discount: Number(line.discount) || 0,
        }))
        .filter((line) => line.itemId && line.qty > 0);

      if (items.length === 0) {
        toast.error("Add at least one item with quantity");
        return;
      }
      if (items.some((line) => !line.rate || line.rate <= 0)) {
        toast.error("Enter rate for each return line");
        return;
      }

      createReturn(
        {
          returnMode: "manual",
          returnDate,
          customerId,
          warehouseId,
          salesType,
          priceLevelId,
          referenceInvoiceNo: referenceInvoiceNo.trim() || undefined,
          items,
          notes: notes.trim() || undefined,
        },
        { onSuccess: (data) => router.push(`/sales/salesReturn/${data._id}`) }
      );
      return;
    }

    if (!invoiceId) {
      toast.error("Select a sales invoice");
      return;
    }

    const items = rows
      .map((row) => ({
        invoiceItemId: row.invoiceItemId,
        qty: Number(row.returnQty),
      }))
      .filter((row) => row.qty > 0);

    if (items.length === 0) {
      toast.error("Enter return quantity for at least one item");
      return;
    }

    for (const row of rows) {
      const qty = Number(row.returnQty);
      if (qty > 0 && qty > row.returnableQty + 0.0001) {
        toast.error(
          `Return qty exceeds returnable qty (${row.returnableQty}) for line ${row.slNo}`
        );
        return;
      }
    }

    createReturn(
      {
        returnMode: "invoice",
        salesInvoiceId: invoiceId,
        returnDate,
        items,
        notes: notes.trim() || undefined,
      },
      { onSuccess: (data) => router.push(`/sales/salesReturn/${data._id}`) }
    );
  };

  const docNumberEnabled = returnMode === "invoice" ? !!invoiceId : !!salesType;

  const openProductAdd = (key: string) => {
    setProductRowKey(key);
    setQuickAdd("product");
  };

  return (
    <div className="w-full mx-auto p-5">
      <PageHeader
        title="New Sales Return"
        description="Return against an invoice or record a manual return when invoice data is missing"
      />

      <InvoiceFormKeyboardHints allowPastDates={allowPastDates} />

      <form
        ref={formRef}
        id={SALES_RETURN_FORM_ID}
        onSubmit={handleSubmit}
        onKeyDown={handleFormKeyDown}
        className="space-y-8"
      >
        {/* Return Details */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">
            Return Details
          </h3>

          <div className="flex flex-wrap gap-2 mb-6">
            {(["invoice", "manual"] as ReturnMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                disabled={!!presetInvoiceId && mode === "manual"}
                onClick={() => setReturnMode(mode)}
                className={`rounded-md border px-4 py-2 text-sm font-medium transition ${
                  returnMode === mode
                    ? "border-black bg-black text-white"
                    : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                }`}
              >
                {mode === "invoice" ? "Against Invoice" : "Manual Return"}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-6">
            {returnMode === "invoice" && (
              <div className="md:col-span-2 lg:col-span-3">
                <FormSelect
                  label="Sales Invoice"
                  name="salesInvoiceId"
                  value={invoiceId}
                  required
                  enterNav
                  disabled={!!presetInvoiceId}
                  options={invoiceOptions}
                  placeholder="Select invoice..."
                  onChange={(e) => setInvoiceId(e.target.value)}
                  onBlur={() => {}}
                />
              </div>
            )}

            {returnMode === "manual" && (
              <>
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
                        onClick={() => setSalesType(type)}
                        className={`rounded-md border px-4 py-2 text-sm font-medium transition ${
                          salesType === type
                            ? "border-[#1E2235] bg-[#1E2235] text-white"
                            : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {type === "retail" ? "Retail" : "Wholesale"}
                      </button>
                    ))}
                  </div>
                </div>
                <FormInput
                  label="Original Invoice No"
                  name="referenceInvoiceNo"
                  value={referenceInvoiceNo}
                  placeholder="Reference if invoice exists outside system"
                  enterNav
                  onChange={(e) => setReferenceInvoiceNo(e.target.value)}
                  onBlur={() => {}}
                />
              </>
            )}

            <NextDocumentNumberField
              documentType="sales_return"
              label="Return No"
              params={
                returnMode === "invoice"
                  ? { salesInvoiceId: invoiceId || undefined }
                  : { salesType }
              }
              enabled={docNumberEnabled}
            />

            <FormDateInput
              label="Return Date"
              name="returnDate"
              value={returnDate}
              required
              enterNav
              min={minDate}
              max={maxDate}
              hint={dateHint}
              onChange={(e) => setReturnDate(e.target.value)}
              onBlur={() => {}}
            />
          </div>

          {returnMode === "invoice" && invoiceId && returnable && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm border rounded-lg p-4 bg-gray-50">
              <div>
                <span className="text-gray-500">Invoice No</span>
                <p className="font-medium">{returnable.invoiceNo}</p>
              </div>
              <div>
                <span className="text-gray-500">Type</span>
                <p className="font-medium capitalize">{returnable.salesType}</p>
              </div>
              <div>
                <span className="text-gray-500">Invoice Total</span>
                <p className="font-medium">₹ {returnable.grandTotal.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-gray-500">Already Returned</span>
                <p className="font-medium">₹ {returnable.returnedAmount.toFixed(2)}</p>
              </div>
            </div>
          )}

          {returnMode === "invoice" && invoiceId && loadingReturnable && (
            <p className="mt-4 text-sm text-gray-400">Loading returnable items...</p>
          )}

          {returnMode === "invoice" && invoiceId && returnableError && (
            <p className="mt-4 text-sm text-red-500">
              Could not load returnable items. Invoice must be confirmed.
            </p>
          )}
        </div>

        {/* Customer Details — manual mode */}
        {returnMode === "manual" && (
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">
              Customer Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-6">
              <FormSelectWithAdd
                label="Customer"
                instanceId={`sales-return-customer-${salesType}`}
                reloadKey={salesType}
                value={customerId}
                selectedOption={customerOption}
                required
                enterNav
                placeholder="Search customer..."
                loadOptions={(search) => loadSalesCustomers(search, salesType)}
                onValueChange={(id, opt) => {
                  setCustomerId(id);
                  setCustomerOption(opt);
                }}
                onBlur={() => {}}
                addLabel="Add Customer"
                onAddClick={() => setQuickAdd("party")}
              />
              <FormSelectWithAdd
                label="Warehouse"
                instanceId="sales-return-warehouse"
                value={warehouseId}
                required
                enterNav
                placeholder="Search warehouse..."
                options={warehouseOptions}
                onValueChange={(id) => setWarehouseId(id)}
                onBlur={() => {}}
                addLabel="Add Warehouse"
                onAddClick={() => setQuickAdd("warehouse")}
              />
              <FormSelect
                label="Price Level"
                name="priceLevelId"
                value={priceLevelId}
                required
                enterNav
                options={priceLevelOptions}
                placeholder="Select price level..."
                onChange={handlePriceLevelChange}
                onBlur={() => {}}
              />
            </div>
          </div>
        )}

        {/* Items */}
        {returnMode === "invoice" && rows.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                Items
              </h3>
            </div>
            <table className={invoiceItemsTableClass}>
              <thead className="bg-gray-50 text-gray-600 text-xs">
                <tr>
                  <th className="px-3 py-3 text-left w-10">#</th>
                  <th className="px-3 py-3 text-left min-w-[180px]">Item</th>
                  <th className="px-3 py-3 text-left w-24">HSN</th>
                  <th className="px-3 py-3 text-right w-28">Rate</th>
                  <th className="px-3 py-3 text-right w-24">Original</th>
                  <th className="px-3 py-3 text-right w-24">Returned</th>
                  <th className="px-3 py-3 text-right w-24">Returnable</th>
                  <th className="px-3 py-3 text-right w-28">Return Qty</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.invoiceItemId} className="border-t hover:bg-gray-50">
                    <td className="px-3 py-2 text-gray-400 text-xs text-center">{row.slNo}</td>
                    <td className="px-3 py-2 font-medium text-gray-800">{row.itemName}</td>
                    <td className="px-3 py-2 text-gray-500">{row.hsn}</td>
                    <td className="px-3 py-2 text-right">₹{row.rate.toFixed(2)}</td>
                    <td className="px-3 py-2 text-right">{row.originalQty}</td>
                    <td className="px-3 py-2 text-right text-orange-600">{row.returnedQty}</td>
                    <td className="px-3 py-2 text-right font-medium">{row.returnableQty}</td>
                    <td className="px-3 py-2 text-right">
                      <input
                        type="number"
                        data-enter-nav="field"
                        min={0}
                        max={row.returnableQty}
                        step="any"
                        disabled={row.returnableQty <= 0}
                        value={row.returnQty}
                        onKeyDown={blockNeg}
                        onChange={(e) =>
                          setReturnQtys((prev) => ({
                            ...prev,
                            [row.invoiceItemId]: e.target.value,
                          }))
                        }
                        className="w-full border-b bg-transparent py-1 text-sm text-right outline-none focus:border-blue-600 border-gray-300 disabled:bg-gray-100"
                        placeholder="0"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {returnMode === "manual" && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                Items
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setManualLines((prev) => [...prev, newManualLine()])}
                className="flex items-center gap-1"
              >
                <Plus size={14} /> Add Row
              </Button>
            </div>
            <table className={invoiceItemsTableClass}>
              <thead className="bg-gray-50 text-gray-600 text-xs">
                <tr>
                  <th className="px-3 py-3 text-left w-10">#</th>
                  <th className="px-3 py-3 text-left min-w-[200px]">Item</th>
                  <th className="px-3 py-3 text-right w-24">Qty</th>
                  <th className="px-3 py-3 text-right w-28">Rate</th>
                  <th className="px-3 py-3 text-right w-24">Disc %</th>
                  <th className="px-3 py-3 text-right w-28">Taxable</th>
                  <th className="px-3 py-3 text-right w-24">SGST</th>
                  <th className="px-3 py-3 text-right w-24">CGST</th>
                  <th className="px-3 py-3 text-right w-28">Total</th>
                  <th className="px-3 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {manualLines.map((line, index) => {
                  const rowTotals = calcManualLineTotals(line);
                  return (
                  <tr key={line.key} className="border-t hover:bg-gray-50">
                    <td className="px-3 py-2 text-gray-400 text-xs text-center">{index + 1}</td>
                    <td className="px-3 py-2">
                      <ItemSelectWithAdd
                        instanceId={`sales-return-item-${line.key}`}
                        enterNav
                        value={line.itemId}
                        selectedOption={
                          line.itemId
                            ? { value: line.itemId, label: line.itemName || "Selected" }
                            : null
                        }
                        loadOptions={loadItems}
                        onChange={(itemId, opt) => {
                          const itemData = opt?.data as {
                            price?: number;
                            salesRate?: number;
                            name?: string;
                            taxPercent?: number;
                          } | undefined;
                          const baseRate = itemSalesRate(itemData);
                          const rate = applyPriceLevelRate(baseRate, activePriceLevelPct);
                          setManualLines((prev) =>
                            prev.map((l) =>
                              l.key === line.key
                                ? {
                                    ...l,
                                    itemId,
                                    itemName: opt?.label ?? "",
                                    baseRate,
                                    taxPercent: Number(itemData?.taxPercent) || 0,
                                    rate: String(rate || ""),
                                  }
                                : l
                            )
                          );
                        }}
                        onAddClick={() => openProductAdd(line.key)}
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        data-enter-nav="field"
                        min={0}
                        step="any"
                        value={line.qty}
                        onKeyDown={blockNeg}
                        onChange={(e) =>
                          handleManualItemChange(line.key, "qty", e.target.value)
                        }
                        className="w-full border-b border-gray-300 bg-transparent py-1 text-sm text-right outline-none focus:border-blue-600"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        data-enter-nav="field"
                        min={0}
                        step="any"
                        value={line.rate}
                        onKeyDown={blockNeg}
                        onChange={(e) =>
                          handleManualItemChange(line.key, "rate", e.target.value)
                        }
                        className="w-full border-b border-gray-300 bg-transparent py-1 text-sm text-right outline-none focus:border-blue-600"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        data-enter-nav="field"
                        min={0}
                        max={100}
                        step="any"
                        value={line.discount}
                        onKeyDown={blockNeg}
                        onChange={(e) =>
                          handleManualItemChange(line.key, "discount", e.target.value)
                        }
                        className="w-full border-b border-gray-300 bg-transparent py-1 text-sm text-right outline-none focus:border-blue-600"
                      />
                    </td>
                    <td className="px-3 py-2 text-right text-gray-600">
                      ₹ {rowTotals.taxableValue.toFixed(2)}
                    </td>
                    <td className="px-3 py-2 text-right text-gray-600">
                      ₹ {rowTotals.sgst.toFixed(2)}
                    </td>
                    <td className="px-3 py-2 text-right text-gray-600">
                      ₹ {rowTotals.cgst.toFixed(2)}
                    </td>
                    <td className="px-3 py-2 text-right font-medium">
                      ₹ {rowTotals.total.toFixed(2)}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <button
                        type="button"
                        disabled={manualLines.length === 1}
                        onClick={() =>
                          setManualLines((prev) => prev.filter((l) => l.key !== line.key))
                        }
                        className="rounded-md border p-2 text-red-500 hover:bg-red-50 disabled:opacity-40"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
            {manualTotals.grandTotal > 0 && (
              <div className="border-t bg-gray-50 p-6 flex justify-end">
                <div className={invoiceSummaryPanelClass}>
                  <div className="flex justify-between text-gray-600">
                    <span>Net Amount (Taxable Value)</span>
                    <span>₹ {manualTotals.netAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Total SGST</span>
                    <span>₹ {manualTotals.totalSGST.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Total CGST</span>
                    <span>₹ {manualTotals.totalCGST.toFixed(2)}</span>
                  </div>
                  <div className={invoiceSummaryGrandTotalClass}>
                    <span>Grand Total</span>
                    <span>₹ {manualTotals.grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Notes */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">
            Notes
          </h3>
          <FormTextArea
            label="Notes"
            name="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={() => {}}
            rows={3}
          />
        </div>
      </form>

      <InvoiceQuickAddModals
        active={quickAdd}
        mode="sales"
        salesType={salesType}
        onClose={() => {
          setQuickAdd(null);
          setProductRowKey(null);
        }}
        onPartySuccess={(data) => {
          const id = getEntityId(data);
          setCustomerId(id);
          setCustomerOption({
            value: id,
            label: (data as { name?: string }).name ?? "",
            data,
          });
        }}
        onWarehouseSuccess={(data) => {
          setWarehouseId(getEntityId(data));
        }}
        onProductSuccess={(data) => {
          if (!productRowKey) return;
          const id = getEntityId(data);
          const item = data as { name?: string; salesRate?: number; price?: number };
          setManualLines((prev) =>
            prev.map((l) =>
              l.key === productRowKey
                ? {
                    ...l,
                    itemId: id,
                    itemName: item.name ?? "",
                    rate: String(itemSalesRate(item) || l.rate),
                  }
                : l
            )
          );
        }}
      />
    </div>
  );
}
