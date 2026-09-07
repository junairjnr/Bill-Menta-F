"use client";

import { useEffect, useMemo, useState } from "react";
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
import { usePurchaseInvoices, usePurchaseInvoice } from "@/app/hooks/purchaseHooks/usePurchaseInvoice";
import { LOOKUP_LIMIT, FORM_LOOKUP_LIMIT } from "@/app/config/pagination";
import {
  useCreatePurchaseReturn,
  usePurchaseReturnableItems,
} from "@/app/hooks/purchaseHooks/usePurchaseReturn";
import { useWarehouses } from "@/app/hooks/warehouseHooks/useWarehouse";
import { PURCHASE_RETURN_FORM_ID } from "@/app/utilsComponents/form-footer";
import {
  loadVendors,
  loadItems,
  mapStaticOptions,
} from "@/app/formComponents/masterLoadOptions";
import { useInvoiceFormShortcuts } from "@/app/hooks/useInvoiceFormShortcuts";
import InvoiceFormKeyboardHints from "@/app/utilsComponents/InvoiceFormKeyboardHints";
import { invoiceItemsTableClass } from "@/app/utilsComponents/report-ui";
import InvoiceQuickAddModals, {
  getEntityId,
  type QuickAddModal,
} from "@/app/utilsComponents/InvoiceQuickAddModals";
import type { SelectOption } from "@/app/formComponents/selectTypes";
import toast from "react-hot-toast";
import NextDocumentNumberField from "@/app/formComponents/NextDocumentNumberField";
import DocumentAttachmentsField from "@/app/utilsComponents/DocumentAttachments";
import type { DocumentAttachment } from "@/app/types";
import { itemPurchaseRate } from "@/app/utils/itemRates";

interface PurchaseReturnFormProps {
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
  qty: string;
  rate: string;
  taxPercent: string;
};

const blockNeg = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (["-", "e", "E", "+"].includes(e.key)) e.preventDefault();
};

const newManualLine = (): ManualLine => ({
  key: `${Date.now()}-${Math.random()}`,
  itemId: "",
  itemName: "",
  qty: "",
  rate: "",
  taxPercent: "18",
});

export default function PurchaseReturnForm({ onPendingChange }: PurchaseReturnFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const presetInvoiceId = searchParams.get("invoiceId") ?? "";

  const [returnMode, setReturnMode] = useState<ReturnMode>("invoice");
  const [invoiceId, setInvoiceId] = useState(presetInvoiceId);
  const [returnDate, setReturnDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  const [returnQtys, setReturnQtys] = useState<Record<string, string>>({});

  const [vendorId, setVendorId] = useState("");
  const [vendorOption, setVendorOption] = useState<SelectOption | null>(null);
  const [warehouseId, setWarehouseId] = useState("");
  const [referenceInvoiceNo, setReferenceInvoiceNo] = useState("");
  const [vendorInvoiceNo, setVendorInvoiceNo] = useState("");
  const [manualLines, setManualLines] = useState<ManualLine[]>([newManualLine()]);
  const [attachments, setAttachments] = useState<DocumentAttachment[]>([]);
  const [quickAdd, setQuickAdd] = useState<QuickAddModal>(null);
  const [productRowKey, setProductRowKey] = useState<string | null>(null);

  const { formRef, allowPastDates, today, minDate, maxDate, handleFormKeyDown, dateHint } =
    useInvoiceFormShortcuts();

  const { data: invoiceList } = usePurchaseInvoices({ limit: LOOKUP_LIMIT });
  const { data: sourceInvoice } = usePurchaseInvoice(invoiceId);
  const { data: warehouseData } = useWarehouses({ limit: FORM_LOOKUP_LIMIT, isActive: true });

  const confirmedInvoices = useMemo(
    () => (invoiceList?.data ?? []).filter((inv) => inv.status === "confirmed"),
    [invoiceList]
  );
  const warehouseOptions = useMemo(
    () => mapStaticOptions(warehouseData?.data ?? []),
    [warehouseData]
  );
  const invoiceOptions = useMemo(
    () =>
      confirmedInvoices.map((inv) => ({
        value: inv._id,
        label: `${inv.invoiceNo}${inv.vendorInvoiceNo ? ` / ${inv.vendorInvoiceNo}` : ""} — ${
          typeof inv.vendorId === "object" ? inv.vendorId.name : "—"
        }`,
      })),
    [confirmedInvoices]
  );

  const {
    data: returnable,
    isLoading: loadingReturnable,
    isError: returnableError,
  } = usePurchaseReturnableItems(returnMode === "invoice" ? invoiceId : "");

  const { mutate: createReturn, isPending } = useCreatePurchaseReturn();

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (returnMode === "manual") {
      if (!vendorId) return toast.error("Select a vendor");
      if (!warehouseId) return toast.error("Select a warehouse");

      const items = manualLines
        .map((line) => ({
          itemId: line.itemId,
          qty: Number(line.qty),
          rate: Number(line.rate),
          taxPercent: Number(line.taxPercent) || 18,
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
          vendorId,
          warehouseId,
          referenceInvoiceNo: referenceInvoiceNo.trim() || undefined,
          vendorInvoiceNo: vendorInvoiceNo.trim() || undefined,
          items,
          notes: notes.trim() || undefined,
          attachments,
        },
        { onSuccess: (data) => router.push(`/purchase/purchaseReturn/${data._id}`) }
      );
      return;
    }

    if (!invoiceId) {
      toast.error("Select a purchase invoice");
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
        purchaseInvoiceId: invoiceId,
        returnDate,
        items,
        notes: notes.trim() || undefined,
        attachments,
      },
      { onSuccess: (data) => router.push(`/purchase/purchaseReturn/${data._id}`) }
    );
  };

  const openProductAdd = (key: string) => {
    setProductRowKey(key);
    setQuickAdd("product");
  };

  return (
    <div className="w-full mx-auto p-5">
      <PageHeader
        title="New Purchase Return"
        description="Return against a purchase invoice or record a manual return when invoice data is missing"
      />

      <InvoiceFormKeyboardHints allowPastDates={allowPastDates} />

      <form
        ref={formRef}
        id={PURCHASE_RETURN_FORM_ID}
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
                  label="Purchase Invoice"
                  name="purchaseInvoiceId"
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
                <FormInput
                  label="Our Invoice No"
                  name="referenceInvoiceNo"
                  value={referenceInvoiceNo}
                  placeholder="Reference purchase invoice no"
                  enterNav
                  onChange={(e) => setReferenceInvoiceNo(e.target.value)}
                  onBlur={() => {}}
                />
                <FormInput
                  label="Vendor Invoice No"
                  name="vendorInvoiceNo"
                  value={vendorInvoiceNo}
                  placeholder="Vendor bill reference"
                  enterNav
                  onChange={(e) => setVendorInvoiceNo(e.target.value)}
                  onBlur={() => {}}
                />
              </>
            )}

            <NextDocumentNumberField
              documentType="purchase_return"
              label="Return No"
              enabled={returnMode === "manual" || !!invoiceId}
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
                <span className="text-gray-500">Vendor Bill</span>
                <p className="font-medium">{returnable.vendorInvoiceNo || "—"}</p>
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

        {/* Vendor Details — manual mode */}
        {returnMode === "manual" && (
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">
              Vendor Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-6">
              <FormSelectWithAdd
                label="Vendor"
                instanceId="purchase-return-vendor"
                value={vendorId}
                selectedOption={vendorOption}
                required
                enterNav
                placeholder="Search vendor..."
                loadOptions={loadVendors}
                onValueChange={(id, opt) => {
                  setVendorId(id);
                  setVendorOption(opt);
                }}
                onBlur={() => {}}
                addLabel="Add Vendor"
                onAddClick={() => setQuickAdd("party")}
              />
              <FormSelectWithAdd
                label="Warehouse"
                instanceId="purchase-return-warehouse"
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
                  <th className="px-3 py-3 text-left min-w-[200px]">Item</th>
                  <th className="px-3 py-3 text-right w-24">Qty</th>
                  <th className="px-3 py-3 text-right w-28">Rate</th>
                  <th className="px-3 py-3 text-right w-24">GST %</th>
                  <th className="px-3 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {manualLines.map((line) => (
                  <tr key={line.key} className="border-t hover:bg-gray-50">
                    <td className="px-3 py-2">
                      <ItemSelectWithAdd
                        instanceId={`purchase-return-item-${line.key}`}
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
                            name?: string;
                            taxPercent?: number;
                          };
                          setManualLines((prev) =>
                            prev.map((l) =>
                              l.key === line.key
                                ? {
                                    ...l,
                                    itemId,
                                    itemName: opt?.label ?? "",
                                    rate: l.rate || String(itemPurchaseRate(itemData) || ""),
                                    taxPercent:
                                      itemData?.taxPercent != null
                                        ? String(itemData.taxPercent)
                                        : l.taxPercent,
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
                        step="any"
                        value={line.taxPercent}
                        onKeyDown={blockNeg}
                        onChange={(e) =>
                          handleManualItemChange(line.key, "taxPercent", e.target.value)
                        }
                        className="w-full border-b border-gray-300 bg-transparent py-1 text-sm text-right outline-none focus:border-blue-600"
                      />
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
                ))}
              </tbody>
            </table>
          </div>
        )}

        <DocumentAttachmentsField attachments={attachments} onChange={setAttachments} />

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
        mode="purchase"
        onClose={() => {
          setQuickAdd(null);
          setProductRowKey(null);
        }}
        onPartySuccess={(data) => {
          const id = getEntityId(data);
          setVendorId(id);
          setVendorOption({
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
          const item = data as {
            name?: string;
            purchaseRate?: number;
            price?: number;
            taxPercent?: number;
          };
          setManualLines((prev) =>
            prev.map((l) =>
              l.key === productRowKey
                ? {
                    ...l,
                    itemId: id,
                    itemName: item.name ?? "",
                    rate: String(itemPurchaseRate(item) || l.rate),
                    taxPercent:
                      item.taxPercent != null ? String(item.taxPercent) : l.taxPercent,
                  }
                : l
            )
          );
        }}
      />
    </div>
  );
}
