import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";

import { QueryParams, FY as FinancialYear } from "@/app/types";
import { fyService } from "@/app/services/financialYearService/financialYear.service";
import { useFYStore } from "@/app/store/financialYear/financialYear.store";

export const useFinancialYears = (params?: QueryParams) =>
  useQuery({
    queryKey: ["financial-years", params],
    queryFn: () => fyService.getAll(params),
  });

export const useFinancialYear = (id: string) =>
  useQuery({
    queryKey: ["financial-year", id],
    queryFn: () => fyService.getOne(id),
    enabled: !!id,
  });

export const useActiveFY = () => {
  const setActiveFY = useFYStore((s) => s.setActiveFY);

  return useQuery({
    queryKey: ["financial-years", "active"],

    queryFn: async (): Promise<FinancialYear> => {
      const fy = await fyService.getActive();

      setActiveFY(fy);

      return fy;
    },
  });
};

export const useCreateFY = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: { startYear: number }) => fyService.create(payload),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["financial-years"],
      });

      toast.success("Financial year created");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to create financial year"
      );
    },
  });
};

export const useSwitchFY = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => fyService.switchFY(id),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["financial-years"],
      });

      qc.invalidateQueries({
        queryKey: ["financial-years", "active"],
      });

      toast.success("Financial year switched");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to switch financial year"
      );
    },
  });
};

export const useDeleteFY = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => fyService.delete(id),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["financial-years"],
      });

      toast.success("Financial year deleted");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete financial year"
      );
    },
  });
};
