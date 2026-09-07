// hooks/useWarehouse.ts
import { warehouseService } from "@/app/services/warehouseServices/warehouse.service";
import { CreateWarehousePayload, QueryParams } from "@/app/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";

export const useWarehouses = (params?: QueryParams) =>
  useQuery({
    queryKey: ["warehouses", params],
    queryFn: () => warehouseService.getAll(params),
  });

export const useWarehouse = (id: string) =>
  useQuery({
    queryKey: ["warehouses", id],
    queryFn: () => warehouseService.getOne(id),
    enabled: !!id,
  });

export const useCreateWarehouse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateWarehousePayload) =>
      warehouseService.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["warehouses"] });
      toast.success("Warehouse created successfully");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to create warehouse"
      );
    },
  });
};

export const useUpdateWarehouse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<CreateWarehousePayload>;
    }) => warehouseService.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["warehouses"] });
      toast.success("Warehouse updated successfully");
    },
  });
};

export const useDeleteWarehouse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => warehouseService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["warehouses"] });
      toast.success("Warehouse deleted");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete warehouse"
      );
    },
  });
};

export const useWarehouseStock = (warehouseId: string) =>
  useQuery({
    queryKey: ["warehouse-stock", warehouseId],
    queryFn: () => warehouseService.getStock(warehouseId),
    enabled: !!warehouseId,
  });

export const useStockLedger = (
  warehouseId: string,
  params?: { itemId?: string; page?: number }
) =>
  useQuery({
    queryKey: ["stock-ledger", warehouseId, params],
    queryFn: () => warehouseService.getLedger(warehouseId, params),
    enabled: !!warehouseId,
  });
