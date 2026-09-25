import { quotationService } from "@/app/services/salesInvoiceServices/quotation.service";
import { CreateQuotationPayload } from "@/app/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useQuotations = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  salesType?: string;
}) =>
  useQuery({
    queryKey: ["quotations", params],
    queryFn: () => quotationService.getAll(params),
  });

export const useQuotation = (id: string) =>
  useQuery({
    queryKey: ["quotations", id],
    queryFn: () => quotationService.getOne(id),
    enabled: !!id,
  });

export const useCreateQuotation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateQuotationPayload) =>
      quotationService.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["quotations"] });
      toast.success("Quotation created successfully");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to create quotation"
      );
    },
  });
};
