// hooks/useBranch.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { branchService } from "@/app/services/branchService/branch.service";

import {
  CreateBranchPayload,
  QueryParams,
} from "@/app/types";

export const useBranches = (params?: QueryParams) =>
  useQuery({
    queryKey: ["branches", params],
    queryFn: () => branchService.getAll(params),
  });

export const useBranch = (id: string) =>
  useQuery({
    queryKey: ["branch", id],
    queryFn: () => branchService.getOne(id),
    enabled: !!id,
  });

export const useCreateBranch = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBranchPayload) =>
      branchService.create(payload),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["branches"] });
      toast.success("Branch created successfully");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to create branch"
      );
    },
  });
};

export const useUpdateBranch = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<CreateBranchPayload>;
    }) => branchService.update(id, payload),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["branches"] });
      toast.success("Branch updated successfully");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to update branch"
      );
    },
  });
};

export const useDeleteBranch = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => branchService.delete(id),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["branches"] });
      toast.success("Branch deleted successfully");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to delete branch"
      );
    },
  });
};