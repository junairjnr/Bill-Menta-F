"use client";

import { useFormik, FieldArray, FormikProvider } from "formik";
import * as Yup from "yup";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import PageHeader from "@/app/utilsComponents/PageHeader";
import { useCustomers } from "@/app/hooks/masterHooks/customerHook/useCustomer";
import { AllocationRow, VoucherType } from "@/app/types";
import { DROPDOWN_LIMIT } from "@/app/config/pagination";
import {
  useCreateVoucher,
  useOutstandingInvoices,
} from "@/app/hooks/masterHooks/paymentHook/usePayment";
import { useSalesInvoice } from "@/app/hooks/salesHooks/useSalesInvoice";
import { usePurchaseInvoice } from "@/app/hooks/purchaseHooks/usePurchaseInvoice";
import { useBankAccounts } from "@/app/hooks/masterHooks/bankHook/useBank";
import toast from "react-hot-toast";
import FormSelect from "@/app/formComponents/FormSelect";
import { Button } from "@/components/ui/button";
import FormTextArea from "@/app/formComponents/FormTextArea";
import FormText from "@/app/formComponents/FormText";
import FormNumber from "@/app/formComponents/FormNumber";
import FormDate from "@/app/formComponents/FormDate";
import {
  PAYMENT_MODES,
  needsBankAccount,
  resolveBalance,
} from "@/app/utilsComponents/paymentConstants";
import { VOUCHER_FORM_ID } from "@/app/utilsComponents/form-footer";
import NextDocumentNumberField from "@/app/formComponents/NextDocumentNumberField";

const blockNeg = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (["-", "e", "E", "+"].includes(e.key)) e.preventDefault();
};

interface ReceiptPaymentFormProps {
  voucherType?: VoucherType;
  onPendingChange?: (pending: boolean) => void;
}

export default function ReceiptPaymentForm({
  voucherType = "receipt",
  onPendingChange,
}: ReceiptPaymentFormProps) {
  const isReceipt = voucherType === "receipt";
  const router = useRouter();
  const searchParams = useSearchParams();
  const presetPartyId = searchParams.get(isReceipt ? "customerId" : "vendorId") ?? "";
  const presetInvoiceId = searchParams.get("invoiceId") ?? "";
  const invoiceMode = !!presetInvoiceId;

  const { mutate: create, isPending } = useCreateVoucher(voucherType);
  const { data: presetSalesInvoice } = useSalesInvoice(isReceipt ? presetInvoiceId : "");
  const { data: presetPurchaseInvoice } = usePurchaseInvoice(
    !isReceipt ? presetInvoiceId : ""
  );
  const presetInvoice = isReceipt ? presetSalesInvoice : presetPurchaseInvoice;

  const { data: customerData } = useCustomers({ limit: DROPDOWN_LIMIT, isActive: true });
  const parties = (customerData?.data ?? []).filter((c: any) =>
    isReceipt ? c.type === "sales" : c.type === "purchase"
  );
  const { data: bankData } = useBankAccounts();
  const bankAccounts = bankData?.data ?? [];

  useEffect(() => {
    onPendingChange?.(isPending);
  }, [isPending, onPendingChange]);

  const presetBalance = useMemo(() => {
    if (!presetInvoice) return 0;
    return resolveBalance(
      presetInvoice.grandTotal,
      presetInvoice.paidAmount ?? 0,
      presetInvoice.balanceAmount
    );
  }, [presetInvoice]);

  const formik = useFormik({
    initialValues: {
      date: new Date().toISOString().split("T")[0],
      partyId: presetPartyId,
      totalAmount: invoiceMode && presetBalance > 0 ? String(presetBalance) : "",
      paymentMode: "cash",
      bankAccountId: "",
      referenceNo: "",
      notes: "",
      allocations: [] as AllocationRow[],
    },
    enableReinitialize: false,
    validationSchema: Yup.object({
      date: Yup.string().required("Date is required"),
      partyId: Yup.string().required(`${isReceipt ? "Customer" : "Vendor"} is required`),
      totalAmount: Yup.number().required("Amount is required").min(0.01, "Must be > 0"),
      paymentMode: Yup.string().required("Payment mode is required"),
      bankAccountId: Yup.string().when("paymentMode", {
        is: (mode: string) => needsBankAccount(mode),
        then: (s) => s.required("Bank account is required for this payment mode"),
        otherwise: (s) => s.notRequired(),
      }),
    }),
    onSubmit: (values) => {
      const validAllocations = values.allocations
        .filter((a) => Number(a.allocated) > 0)
        .map((a) => ({
          invoiceId: a.invoiceId,
          amountAdjusted: Number(a.allocated),
        }));

      if (validAllocations.length === 0) {
        if (values.allocations.length === 0) {
          toast.error(
            loadingOutstanding
              ? "Loading outstanding invoices..."
              : "No outstanding invoices found for this party. Confirm the invoice is posted and has balance due."
          );
        } else {
          toast.error(
            "Enter an adjust amount for at least one invoice, or click Auto Allocate"
          );
        }
        return;
      }

      const totalAdjusted = validAllocations.reduce((s, a) => s + a.amountAdjusted, 0);
      if (Math.abs(totalAdjusted - Number(values.totalAmount)) > 0.01) {
        toast.error(
          `Adjusted ₹${totalAdjusted.toFixed(2)} must equal voucher amount ₹${Number(values.totalAmount).toFixed(2)}`
        );
        return;
      }

      create(
        {
          date: values.date,
          ...(isReceipt
            ? { customerId: values.partyId }
            : { vendorId: values.partyId }),
          paymentMode: values.paymentMode as any,
          bankAccountId: values.bankAccountId || undefined,
          referenceNo: values.referenceNo,
          totalAmount: Number(values.totalAmount),
          notes: values.notes,
          allocations: validAllocations,
        },
        {
          onSuccess: () =>
            router.push(
              invoiceMode && isReceipt
                ? `/sales/salesInvoice/${presetInvoiceId}`
                : invoiceMode && !isReceipt
                  ? `/purchase/purchaseInvoice/${presetInvoiceId}`
                  : isReceipt
                    ? "/reciept/payments"
                    : "/payment/vendor-payments"
            ),
        }
      );
    },
  });

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue } =
    formik;

  const { data: outstandingData, isLoading: loadingOutstanding, isError: outstandingError } =
    useOutstandingInvoices(values.partyId, voucherType);
  const outstanding = outstandingData?.invoices;
  const invoiceSummary = outstandingData?.summary;
  const appliedPreset = useRef(false);
  const allocationsRef = useRef<AllocationRow[]>([]);
  allocationsRef.current = values.allocations;

  const sortAllocationsOldestFirst = (rows: AllocationRow[]) =>
    [...rows].sort((a, b) => {
      const dateDiff =
        new Date(a.invoiceDate).getTime() - new Date(b.invoiceDate).getTime();
      if (dateDiff !== 0) return dateDiff;
      const createdDiff =
        new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime();
      if (createdDiff !== 0) return createdDiff;
      return a.invoiceId.localeCompare(b.invoiceId);
    });

  const distributeVoucherAmount = (
    rows: AllocationRow[],
    voucherAmount: number
  ): AllocationRow[] => {
    const sorted = sortAllocationsOldestFirst(rows);
    if (voucherAmount <= 0) {
      return sorted.map((row) => ({ ...row, allocated: "0" }));
    }

    let remaining = voucherAmount;
    return sorted.map((row) => {
      const balance = resolveBalance(row.invoiceTotal, row.paidBefore, row.balance);
      if (remaining <= 0) return { ...row, balance, allocated: "0" };
      const canAllocate = Math.min(remaining, balance);
      remaining = Number((remaining - canAllocate).toFixed(2));
      return { ...row, balance, allocated: String(canAllocate) };
    });
  };

  useEffect(() => {
    if (!values.partyId || outstanding === undefined) return;

    const previousAllocated = new Map(
      allocationsRef.current.map((row) => [row.invoiceId, row.allocated])
    );

    let rows: AllocationRow[] = sortAllocationsOldestFirst(
      (outstanding ?? []).map((inv) => ({
        invoiceId: inv._id,
        invoiceNo: inv.invoiceNo,
        invoiceDate: inv.invoiceDate,
        createdAt: inv.createdAt,
        invoiceTotal:
          inv.effectiveTotal ??
          Math.max(0, inv.grandTotal - (inv.returnedAmount ?? 0)),
        paidBefore: inv.paidAmount ?? 0,
        balance: inv.balanceAmount,
        allocated: previousAllocated.get(inv._id) ?? "0",
      }))
    );

    if (invoiceMode && presetInvoiceId) {
      rows = rows.filter((r) => r.invoiceId === presetInvoiceId);
    }

    const voucherAmount = Number(values.totalAmount) || 0;

    if (invoiceMode && presetInvoiceId && !appliedPreset.current && rows.length > 0) {
      const balance = rows[0].balance;
      const amount = voucherAmount > 0 ? voucherAmount : balance;
      rows[0] = {
        ...rows[0],
        allocated: String(Math.min(amount, balance)),
      };
      if (!values.totalAmount) {
        setFieldValue("totalAmount", String(Math.min(amount, balance)));
      }
      appliedPreset.current = true;
    } else if (voucherAmount > 0) {
      rows = distributeVoucherAmount(rows, voucherAmount);
    }

    setFieldValue("allocations", rows);
  }, [outstanding, values.partyId, values.totalAmount, invoiceMode, presetInvoiceId, setFieldValue]);

  useEffect(() => {
    if (presetPartyId) setFieldValue("partyId", presetPartyId);
  }, [presetPartyId, setFieldValue]);

  useEffect(() => {
    if (invoiceMode && presetBalance > 0) {
      setFieldValue("totalAmount", String(presetBalance));
    }
  }, [invoiceMode, presetBalance, setFieldValue]);

  const handleAutoAllocate = () => {
    const voucherAmount = Number(values.totalAmount) || 0;
    if (voucherAmount <= 0) {
      toast.error("Enter voucher amount first");
      return;
    }
    setFieldValue("allocations", distributeVoucherAmount(values.allocations, voucherAmount));
  };

  const totalAllocated = values.allocations.reduce(
    (s, r) => s + (Number(r.allocated) || 0),
    0
  );
  const unallocated = Number((Number(values.totalAmount || 0) - totalAllocated).toFixed(2));

  const rowBalance = (row: AllocationRow) =>
    resolveBalance(row.invoiceTotal, row.paidBefore, row.balance);

  const outstandingBalanceTotal = values.allocations.reduce(
    (s, r) => s + rowBalance(r),
    0
  );
  const outstandingAfterPayment = Math.max(
    0,
    Number((outstandingBalanceTotal - totalAllocated).toFixed(2))
  );
  const summaryOutstandingAfter = invoiceSummary
    ? Math.max(0, Number((invoiceSummary.totalOutstanding - totalAllocated).toFixed(2)))
    : outstandingAfterPayment;
  const summaryPaidAfter = invoiceSummary
    ? Number((invoiceSummary.totalPaid + totalAllocated).toFixed(2))
    : totalAllocated;

  return (
    <FormikProvider value={formik}>
      <div className="w-full mx-auto p-5">
        <PageHeader
          title={isReceipt ? "Receipt Voucher" : "Payment Voucher"}
          description={
            invoiceMode && presetInvoice
              ? `${isReceipt ? "Receipt" : "Payment"} against invoice ${presetInvoice.invoiceNo}`
              : `Record ${isReceipt ? "customer receipt" : "vendor payment"} with invoice allocation`
          }
        />

        <form id={VOUCHER_FORM_ID} onSubmit={handleSubmit} className="space-y-8">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-widest text-gray-400">
              Voucher Information
            </h3>
            <div className="grid grid-cols-1 gap-x-16 gap-y-6 md:grid-cols-2 lg:grid-cols-3">
              <NextDocumentNumberField
                documentType={isReceipt ? "receipt" : "payment"}
                label={isReceipt ? "Receipt No" : "Payment No"}
              />

              <FormDate
                label="Date"
                name="date"
                value={values.date}
                required
                onChange={handleChange}
                onBlur={handleBlur}
                touched={touched.date}
                error={errors.date}
              />
              <FormSelect
                label={isReceipt ? "Customer" : "Vendor"}
                name="partyId"
                value={values.partyId}
                required
                disabled={invoiceMode}
                placeholder={`Select ${isReceipt ? "customer" : "vendor"}`}
                options={parties.map((c: any) => ({ label: c.name, value: c._id }))}
                onChange={(e) => {
                  setFieldValue("partyId", e.target.value);
                  setFieldValue("allocations", []);
                  appliedPreset.current = false;
                }}
                onBlur={handleBlur}
                touched={touched.partyId}
                error={errors.partyId}
              />
              <FormNumber
                label="Voucher Amount (₹)"
                name="totalAmount"
                value={values.totalAmount}
                required
                min={0}
                step={0.01}
                onChange={handleChange}
                onBlur={handleBlur}
                touched={touched.totalAmount}
                error={errors.totalAmount}
              />
              <FormSelect
                label="Payment Mode"
                name="paymentMode"
                value={values.paymentMode}
                required
                options={PAYMENT_MODES}
                onChange={(e) => {
                  handleChange(e);
                  if (!needsBankAccount(e.target.value)) {
                    setFieldValue("bankAccountId", "");
                  }
                }}
                onBlur={handleBlur}
                touched={touched.paymentMode}
                error={errors.paymentMode}
              />
              {needsBankAccount(values.paymentMode) && (
                <FormSelect
                  label="Bank Account"
                  name="bankAccountId"
                  value={values.bankAccountId}
                  required
                  placeholder="Select bank account"
                  options={bankAccounts.map((b: any) => ({
                    label: `${b.accountName} — ${b.bankName} (${String(b.accountNumber).slice(-4)})`,
                    value: b._id,
                  }))}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  touched={touched.bankAccountId}
                  error={errors.bankAccountId}
                />
              )}
              {values.paymentMode !== "cash" && (
                <FormText
                  label="Reference No"
                  name="referenceNo"
                  value={values.referenceNo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              )}
            </div>
          </div>

          {values.partyId && (
            <div className="overflow-hidden rounded-xl bg-white shadow-sm">
              <div className="flex items-center justify-between border-b p-4">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                  Outstanding Invoices
                </h3>
                {values.allocations.length > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAutoAllocate}
                    className="rounded-lg px-4 py-2 text-sm font-semibold"
                  >
                    Auto Allocate
                  </Button>
                )}
              </div>

              {loadingOutstanding ? (
                <p className="p-8 text-center text-sm text-gray-400">
                  Loading outstanding invoices...
                </p>
              ) : outstandingError ? (
                <p className="p-8 text-center text-sm text-red-500">
                  Failed to load outstanding invoices. Check your connection and financial year.
                </p>
              ) : values.allocations.length === 0 ? (
                <>
                  <p className="p-8 text-center text-sm text-gray-400">
                    No outstanding invoices for this {isReceipt ? "customer" : "vendor"}.
                    {outstanding?.length === 0 && values.partyId ? (
                      <>
                        {" "}
                        All confirmed invoices may already be fully paid, or restart the backend
                        after updating if invoices were created before payment tracking was added.
                      </>
                    ) : null}
                  </p>
                  {invoiceSummary && invoiceSummary.invoiceCount > 0 && (
                    <div className="border-t bg-blue-50 px-5 py-4 text-sm">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-700">
                        All {isReceipt ? "Customer" : "Vendor"} Invoices
                      </p>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <div>
                          <p className="text-xs text-gray-500">Invoices</p>
                          <p className="font-semibold">{invoiceSummary.invoiceCount}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Total Amount</p>
                          <p className="font-semibold">
                            ₹ {invoiceSummary.totalAmount.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Total Paid</p>
                          <p className="font-semibold text-green-700">
                            ₹ {summaryPaidAfter.toFixed(2)}
                            {totalAllocated > 0 && invoiceSummary ? (
                              <span className="ml-1 text-xs font-normal text-gray-500">
                                (+₹{totalAllocated.toFixed(2)})
                              </span>
                            ) : null}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Total Outstanding</p>
                          <p className="font-semibold text-orange-600">
                            ₹ {summaryOutstandingAfter.toFixed(2)}
                            {totalAllocated > 0 && invoiceSummary ? (
                              <span className="ml-1 text-xs font-normal text-gray-500 line-through">
                                ₹{invoiceSummary.totalOutstanding.toFixed(2)}
                              </span>
                            ) : null}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-xs text-gray-600">
                        <tr>
                          <th className="px-5 py-3 text-left">Invoice No</th>
                          <th className="px-5 py-3 text-left">Date</th>
                          <th className="px-5 py-3 text-right">Total</th>
                          <th className="px-5 py-3 text-right">Paid</th>
                          <th className="px-5 py-3 text-right">Balance</th>
                          <th className="px-5 py-3 text-right">Adjust (₹)</th>
                          <th className="px-5 py-3 text-right">Balance After</th>
                        </tr>
                      </thead>
                      <tbody>
                        {values.allocations.map((row, index) => {
                          const allocated = Number(row.allocated) || 0;
                          const balance = rowBalance(row);
                          const balanceAfter = Math.max(
                            0,
                            Number((balance - allocated).toFixed(2))
                          );
                          return (
                            <tr key={row.invoiceId} className="border-t">
                              <td className="px-5 py-3 font-medium text-blue-600">
                                {row.invoiceNo}
                              </td>
                              <td className="px-5 py-3">
                                {new Date(row.invoiceDate).toLocaleDateString("en-IN")}
                              </td>
                              <td className="px-5 py-3 text-right">
                                ₹ {row.invoiceTotal.toFixed(2)}
                              </td>
                              <td className="px-5 py-3 text-right text-gray-500">
                                ₹ {row.paidBefore.toFixed(2)}
                              </td>
                              <td className="px-5 py-3 text-right text-orange-600">
                                ₹ {balance.toFixed(2)}
                              </td>
                              <td className="px-5 py-3 text-right">
                                <input
                                  type="number"
                                  value={row.allocated}
                                  onChange={(e) =>
                                    setFieldValue(
                                      `allocations[${index}].allocated`,
                                      e.target.value
                                    )
                                  }
                                  onKeyDown={blockNeg}
                                  min="0"
                                  max={balance}
                                  step="0.01"
                                  className="w-28 rounded-md border px-2 py-1 text-right text-sm"
                                />
                              </td>
                              <td className="px-5 py-3 text-right">
                                ₹ {balanceAfter.toFixed(2)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      {values.allocations.length > 0 && (
                        <tfoot className="border-t bg-gray-50 text-sm font-semibold">
                          <tr>
                            <td className="px-5 py-3" colSpan={2}>
                              Total ({values.allocations.length} outstanding)
                            </td>
                            <td className="px-5 py-3 text-right">
                              ₹{" "}
                              {values.allocations
                                .reduce((s, r) => s + r.invoiceTotal, 0)
                                .toFixed(2)}
                            </td>
                            <td className="px-5 py-3 text-right text-gray-600">
                              ₹{" "}
                              {values.allocations
                                .reduce((s, r) => s + r.paidBefore, 0)
                                .toFixed(2)}
                            </td>
                            <td className="px-5 py-3 text-right text-orange-600">
                              ₹ {outstandingAfterPayment.toFixed(2)}
                            </td>
                            <td className="px-5 py-3 text-right">
                              ₹ {totalAllocated.toFixed(2)}
                            </td>
                            <td className="px-5 py-3" />
                          </tr>
                        </tfoot>
                      )}
                    </table>
                  </div>
                  {invoiceSummary && invoiceSummary.invoiceCount > 0 && (
                    <div className="border-t bg-blue-50 px-5 py-4 text-sm">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-700">
                        All {isReceipt ? "Customer" : "Vendor"} Invoices
                      </p>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <div>
                          <p className="text-xs text-gray-500">Invoices</p>
                          <p className="font-semibold">{invoiceSummary.invoiceCount}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Total Amount</p>
                          <p className="font-semibold">
                            ₹ {invoiceSummary.totalAmount.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Total Paid</p>
                          <p className="font-semibold text-green-700">
                            ₹ {summaryPaidAfter.toFixed(2)}
                            {totalAllocated > 0 && invoiceSummary ? (
                              <span className="ml-1 text-xs font-normal text-gray-500">
                                (+₹{totalAllocated.toFixed(2)})
                              </span>
                            ) : null}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Total Outstanding</p>
                          <p className="font-semibold text-orange-600">
                            ₹ {summaryOutstandingAfter.toFixed(2)}
                            {totalAllocated > 0 && invoiceSummary ? (
                              <span className="ml-1 text-xs font-normal text-gray-500 line-through">
                                ₹{invoiceSummary.totalOutstanding.toFixed(2)}
                              </span>
                            ) : null}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex justify-end border-t bg-gray-50 p-4 text-sm">
                    <div className="space-y-1">
                      <div className="flex justify-between gap-8">
                        <span>Voucher Amount</span>
                        <span>₹ {Number(values.totalAmount || 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between gap-8">
                        <span>Total Adjusted</span>
                        <span>₹ {totalAllocated.toFixed(2)}</span>
                      </div>
                      <div
                        className={`flex justify-between gap-8 font-semibold ${
                          Math.abs(unallocated) < 0.01 ? "text-green-600" : "text-orange-500"
                        }`}
                      >
                        <span>Unallocated</span>
                        <span>₹ {unallocated.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <FormTextArea
              label="Notes"
              name="notes"
              value={values.notes}
              rows={2}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>

        </form>
      </div>
    </FormikProvider>
  );
}
