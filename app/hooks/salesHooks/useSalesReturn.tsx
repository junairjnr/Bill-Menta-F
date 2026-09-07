import { salesReturnService } from "@/app/services/salesInvoiceServices/salesReturn.service";
import { CreateSalesReturnPayload } from "@/app/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useSalesReturns = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  salesType?: string;
  salesInvoiceId?: string;
}) =>
  useQuery({
    queryKey: ["sales-returns", params],
    queryFn: () => salesReturnService.getAll(params),
  });

export const useSalesReturn = (id: string) =>
  useQuery({
    queryKey: ["sales-returns", id],
    queryFn: () => salesReturnService.getOne(id),
    enabled: !!id,
  });

export const useSalesReturnableItems = (invoiceId: string) =>
  useQuery({
    queryKey: ["sales-returns", "returnable", invoiceId],
    queryFn: () => salesReturnService.getReturnableItems(invoiceId),
    enabled: !!invoiceId,
  });

export const useCreateSalesReturn = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSalesReturnPayload) =>
      salesReturnService.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sales-returns"] });
      qc.invalidateQueries({ queryKey: ["sales-invoices"] });
      qc.invalidateQueries({ queryKey: ["warehouse-stock"] });
      qc.invalidateQueries({ queryKey: ["stock-ledger"] });
      toast.success("Sales return created successfully");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to create sales return"
      );
    },
  });
};
