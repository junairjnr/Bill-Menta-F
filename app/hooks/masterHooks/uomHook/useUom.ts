import { KEYS } from "@/app/queryKeys/keys";
import { itemCategoryService } from "@/app/services/masterServices/itemCategory/itemCategory.service";
import { uomService } from "@/app/services/masterServices/uom/uom.service";
import { CreateUomPayload, QueryParams } from "@/app/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// export const useUoms = (params?: QueryParams) =>
//   useQuery({
//     queryKey: KEYS.uoms(params),
//     queryFn:  () => uomService.getAll(params),
//   });

// export const useUom = (id: string) =>
//   useQuery({
//     queryKey: KEYS.uom(id),
//     queryFn:  () => uomService.getOne(id),
//     enabled:  !!id,
//   });

// export const useCreateUom = () => {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: (payload: CreateUomPayload) => uomService.create(payload),
//     onSuccess:  () => qc.invalidateQueries({ queryKey: ["uoms"] }),
//     onError: (error) => {
//       console.error("Error creating UOM:", error);
//     }
//   });
// };

// export const useUpdateUom = () => {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateUomPayload> }) =>
//       uomService.update(id, payload),
//     onSuccess: () => qc.invalidateQueries({ queryKey: ["uoms"] }),
//   });
// };

// export const useDeleteUom = () => {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: (id: string) => uomService.delete(id),
//     onSuccess:  () => qc.invalidateQueries({ queryKey: ["uoms"] }),
//   });
// };

export const useUoms = (params?: QueryParams) =>
  useQuery({
    queryKey: ["uoms", params],
    queryFn: () => uomService.getAll(params),
  });

export const useUom = (id: string) =>
  useQuery({
    queryKey: ["uoms", id],
    queryFn: () => uomService.getOne(id),
    enabled: !!id,
  });

export const useCreateUom = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateUomPayload) => uomService.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["uoms"] });
      toast.success("UOM created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create UOM");
    },
  });
};

export const useUpdateUom = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<CreateUomPayload>;
    }) => uomService.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["uoms"] });
      toast.success("UOM updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update UOM");
    },
  });
};

export const useDeleteUom = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => uomService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["uoms"] });
      toast.success("UOM deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete UOM");
    },
  });
};
