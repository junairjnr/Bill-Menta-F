import {
  receiptService,
  vendorPaymentService,
} from "@/app/services/receiptPayment/receiptPayment.service";
import { CreateReceiptPaymentPayload, VoucherType } from "@/app/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const serviceFor = (type: VoucherType) =>
  type === "receipt" ? receiptService : vendorPaymentService;

export const useOutstandingInvoices = (
  partyId: string,
  voucherType: VoucherType = "receipt"
) =>
  useQuery({
    queryKey: ["outstanding-invoices", voucherType, partyId],
    queryFn: () => serviceFor(voucherType).getOutstanding(partyId),
    enabled: !!partyId,
    staleTime: 0,
  });

export const useVouchers = (
  voucherType: VoucherType,
  params?: Record<string, unknown>
) =>
  useQuery({
    queryKey: [voucherType === "receipt" ? "receipts" : "vendor-payments", params],
    queryFn: () => serviceFor(voucherType).getAll(params),
  });

export const useVoucher = (id: string, voucherType: VoucherType = "receipt") =>
  useQuery({
    queryKey: [voucherType === "receipt" ? "receipts" : "vendor-payments", id],
    queryFn: () => serviceFor(voucherType).getOne(id),
    enabled: !!id,
  });

export const useCreateVoucher = (voucherType: VoucherType) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateReceiptPaymentPayload) =>
      serviceFor(voucherType).create(payload),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["receipts"] });
      qc.invalidateQueries({ queryKey: ["vendor-payments"] });
      qc.invalidateQueries({ queryKey: ["payments"] });
      qc.invalidateQueries({ queryKey: ["sales-invoices"] });
      qc.invalidateQueries({ queryKey: ["purchase-invoices"] });
      qc.invalidateQueries({ queryKey: ["outstanding-invoices"] });
      variables.allocations.forEach((a) => {
        qc.invalidateQueries({ queryKey: ["sales-invoices", a.invoiceId] });
        qc.invalidateQueries({ queryKey: ["payments", "invoice", a.invoiceId] });
      });
      toast.success(
        voucherType === "receipt"
          ? "Receipt saved successfully"
          : "Payment saved successfully"
      );
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to save voucher");
    },
  });
};

export const useDeleteVoucher = (voucherType: VoucherType) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => serviceFor(voucherType).delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["receipts"] });
      qc.invalidateQueries({ queryKey: ["vendor-payments"] });
      qc.invalidateQueries({ queryKey: ["sales-invoices"] });
      qc.invalidateQueries({ queryKey: ["purchase-invoices"] });
      toast.success("Voucher cancelled");
    },
  });
};

// Legacy aliases
export const usePayments = (params?: Record<string, unknown>) =>
  useVouchers("receipt", params);
export const usePayment = (id: string) => useVoucher(id, "receipt");
export const useVendorPayment = (id: string) => useVoucher(id, "payment");
export const useCreatePayment = () => useCreateVoucher("receipt");
export const useInvoicePayments = (invoiceId: string, customerId: string) =>
  useQuery({
    queryKey: ["receipts", "invoice", invoiceId],
    queryFn: () => receiptService.getByInvoice(invoiceId),
    enabled: !!invoiceId && !!customerId,
  });

export const usePurchaseInvoicePayments = (invoiceId: string, vendorId: string) =>
  useQuery({
    queryKey: ["vendor-payments", "invoice", invoiceId],
    queryFn: () => vendorPaymentService.getByInvoice(invoiceId),
    enabled: !!invoiceId && !!vendorId,
  });
