import { priceLevelService } from "@/app/services/masterServices/priceLevel/priceLevel.service";
import { CreatePriceLevelPayload, QueryParams } from "@/app/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const usePriceLevels = (params?: QueryParams) =>
  useQuery({
    queryKey: ["price-levels", params],
    queryFn: () => priceLevelService.getAll(params),
  });

export const usePriceLevel = (id: string) =>
  useQuery({
    queryKey: ["price-levels", id],
    queryFn: () => priceLevelService.getOne(id),
    enabled: !!id,
  });

export const useCreatePriceLevel = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePriceLevelPayload) =>
      priceLevelService.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["price-levels"] });
      toast.success("Price Level created successfully");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to create Price Level"
      );
    },
  });
};

export const useUpdatePriceLevel = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<CreatePriceLevelPayload>;
    }) => priceLevelService.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["price-levels"] });
      toast.success("Price Level updated successfully");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to update Price Level"
      );
    },
  });
};

export const useDeletePriceLevel = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => priceLevelService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["price-levels"] });
      toast.success("Price Level deleted successfully");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete Price Level"
      );
    },
  });
};
