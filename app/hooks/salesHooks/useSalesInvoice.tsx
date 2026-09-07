import { salesService } from "@/app/services/salesInvoiceServices/salesInvoice.service";
import { CreateSalesPayload } from "@/app/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useSalesInvoices = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  salesType?: string;
}) =>
  useQuery({
    queryKey: ["sales-invoices", params],
    queryFn: () => salesService.getAll(params),
  });

export const useSalesInvoice = (id: string) =>
  useQuery({
    queryKey: ["sales-invoices", id],
    queryFn: () => salesService.getOne(id),
    enabled: !!id,
  });

export const useCreateSalesInvoice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSalesPayload) => salesService.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sales-invoices"] });
      qc.invalidateQueries({ queryKey: ["warehouse-stock"] });
      qc.invalidateQueries({ queryKey: ["stock-ledger"] });
      toast.success("Sales invoice created successfully");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to create sales invoice"
      );
    },
  });
};
