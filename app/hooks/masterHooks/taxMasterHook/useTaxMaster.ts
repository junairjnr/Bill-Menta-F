import { taxMasterService } from "@/app/services/masterServices/taxMaster/taxMaster.service";
import { CreateTaxMasterPayload, QueryParams } from "@/app/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useTaxMasters = (params?: QueryParams) =>
  useQuery({
    queryKey: ["tax-masters", params],
    queryFn: () => taxMasterService.getAll(params),
  });

export const useTaxMaster = (id: string) =>
  useQuery({
    queryKey: ["tax-masters", id],
    queryFn: () => taxMasterService.getOne(id),
    enabled: !!id,
  });

export const useCreateTaxMaster = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTaxMasterPayload) => taxMasterService.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tax-masters"] });
      toast.success("Tax master created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create tax master");
    },
  });
};

export const useUpdateTaxMaster = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<CreateTaxMasterPayload>;
    }) => taxMasterService.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tax-masters"] });
      toast.success("Tax master updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update tax master");
    },
  });
};

export const useDeleteTaxMaster = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => taxMasterService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tax-masters"] });
      toast.success("Tax master deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete tax master");
    },
  });
};
