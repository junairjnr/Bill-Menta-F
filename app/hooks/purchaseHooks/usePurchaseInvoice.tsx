import { purchaseService } from "@/app/services/purchaseServices/purchaseInvoice.service";
import { CreatePurchasePayload } from "@/app/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";

export const usePurchaseInvoices = (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) =>
  useQuery({
    queryKey: ["purchase-invoices", params],
    queryFn: () => purchaseService.getAll(params),
  });

export const usePurchaseInvoice = (id: string) =>
  useQuery({
    queryKey: ["purchase-invoices", id],
    queryFn: () => purchaseService.getOne(id),
    enabled: !!id,
  });

export const useCreatePurchaseInvoice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePurchasePayload) =>
      purchaseService.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["purchase-invoices"] });
      qc.invalidateQueries({ queryKey: ["warehouse-stock"] });
      qc.invalidateQueries({ queryKey: ["stock-ledger"] });
      toast.success("Purchase invoice created successfully");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to create purchase invoice"
      );
    },
  });
};
