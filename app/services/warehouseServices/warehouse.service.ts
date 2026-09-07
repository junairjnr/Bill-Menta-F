// services/warehouse.service.ts
import axiosInstance from "../../api/axios";
import {
  ApiResponse,
  Warehouse,
  CreateWarehousePayload,
  Stock,
  StockLedger,
  PaginatedData,
  QueryParams,
} from "../../types/index.js";

export const warehouseService = {
  getAll: async (params?: QueryParams): Promise<PaginatedData<Warehouse>> => {
    const res = await axiosInstance.get<ApiResponse<PaginatedData<Warehouse>>>(
      "/warehouses",
      { params }
    );
    return res.data.data;
  },

  getOne: async (id: string): Promise<Warehouse> => {
    const res = await axiosInstance.get<ApiResponse<Warehouse>>(
      `/warehouses/${id}`
    );
    return res.data.data;
  },

  create: async (payload: CreateWarehousePayload): Promise<Warehouse> => {
    const res = await axiosInstance.post<ApiResponse<Warehouse>>(
      "/warehouses/add",
      payload
    );
    return res.data.data;
  },

  update: async (
    id: string,
    payload: Partial<CreateWarehousePayload>
  ): Promise<Warehouse> => {
    const res = await axiosInstance.put<ApiResponse<Warehouse>>(
      `/warehouses/${id}`,
      payload
    );
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/warehouses/${id}`);
  },

  getStock: async (id: string): Promise<Stock[]> => {
    const res = await axiosInstance.get<ApiResponse<Stock[]>>(
      `/warehouses/${id}/stock`
    );
    return res.data.data;
  },

  getLedger: async (
    id: string,
    params?: { itemId?: string; page?: number }
  ): Promise<PaginatedData<StockLedger>> => {
    const res = await axiosInstance.get<
      ApiResponse<PaginatedData<StockLedger>>
    >(`/warehouses/${id}/ledger`, { params });
    return res.data.data;
  },
};
