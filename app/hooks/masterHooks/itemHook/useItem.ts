import { KEYS } from "@/app/queryKeys/keys";
import { itemService } from "@/app/services/masterServices/item/item.service";
import { CreateItemPayload, QueryParams } from "@/app/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// ── Items ─────────────────────────────────────────────────────
export const useItems = (params?: QueryParams) =>
  useQuery({
    queryKey: KEYS.items(params),
    queryFn: () => itemService.getAll(params),
  });

export const useItem = (id: string) =>
  useQuery({
    queryKey: KEYS.item(id),
    queryFn: () => itemService.getOne(id),
    enabled: !!id,
  });

export const useCreateItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateItemPayload) => itemService.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["items"] });
      toast.success("Item Created Successfully..!");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to create item"
      );
    },
  });
};

export const useUpdateItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<CreateItemPayload>;
    }) => itemService.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["items"] });
      toast.success("Item Updated Successfully..!");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to update item"
      );
    },
  });
};

export const useDeleteItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => itemService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["items"] });
      toast.success("Item Deleted Successfully..!");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete item"
      );
    },
  });
};
