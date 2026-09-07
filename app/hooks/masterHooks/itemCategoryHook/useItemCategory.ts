import { KEYS } from "@/app/queryKeys/keys";
import { itemCategoryService } from "@/app/services/masterServices/itemCategory/itemCategory.service";
import { CreateItemCategoryPayload, QueryParams } from "@/app/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// ── Item Categories ───────────────────────────────────────────

//get all categories with optional query params
export const useItemCategories = (params?: QueryParams) =>
  useQuery({
    queryKey: KEYS.categories(params),
    queryFn: () => itemCategoryService.getAll(params),
  });

//get single category by id
export const useItemCategory = (id: string) =>
  useQuery({
    queryKey: KEYS.category(id),
    queryFn: () => itemCategoryService.getOne(id),
    enabled: !!id,
  });

//create new category
export const useCreateItemCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateItemCategoryPayload) =>
      itemCategoryService.create(payload),
    // onSuccess: () => qc.invalidateQueries({ queryKey: ["item-categories"] }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["item-categories"] });
      toast.success("Category Created Successfully");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to create category"
      );
    },
  });
};

//update existing category

export const useUpdateItemCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<CreateItemCategoryPayload>;
    }) => itemCategoryService.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["item-categories"] });
      toast.success("Category Updated Successfully");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to update category"
      );
    },
  });
};

//delete category by id

export const useDeleteItemCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => itemCategoryService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["item-categories"] });
      toast.success("Category Deleted Successfully");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete category"
      );
    },
  });
};
