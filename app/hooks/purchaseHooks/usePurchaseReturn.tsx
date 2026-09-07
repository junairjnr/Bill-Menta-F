import { purchaseReturnService } from "@/app/services/purchaseServices/purchaseReturn.service";
import { CreatePurchaseReturnPayload } from "@/app/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const usePurchaseReturns = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  purchaseInvoiceId?: string;
}) =>
  useQuery({
    queryKey: ["purchase-returns", params],
    queryFn: () => purchaseReturnService.getAll(params),
  });

export const usePurchaseReturn = (id: string) =>
  useQuery({
    queryKey: ["purchase-returns", id],
    queryFn: () => purchaseReturnService.getOne(id),
    enabled: !!id,
  });

export const usePurchaseReturnableItems = (invoiceId: string) =>
  useQuery({
    queryKey: ["purchase-returns", "returnable", invoiceId],
    queryFn: () => purchaseReturnService.getReturnableItems(invoiceId),
    enabled: !!invoiceId,
  });

export const useCreatePurchaseReturn = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePurchaseReturnPayload) =>
      purchaseReturnService.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["purchase-returns"] });
      qc.invalidateQueries({ queryKey: ["purchase-invoices"] });
      qc.invalidateQueries({ queryKey: ["warehouse-stock"] });
      qc.invalidateQueries({ queryKey: ["stock-ledger"] });
      toast.success("Purchase return created successfully");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to create purchase return"
      );
    },
  });
};
