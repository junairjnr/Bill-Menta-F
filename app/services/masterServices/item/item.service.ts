import axiosInstance from "../../../api/axios";
import {
  ApiResponse,
  PaginatedData,
  QueryParams,
  Item,
  CreateItemPayload,
} from "../../../types";

// ── Items ─────────────────────────────────────────────────────
export const itemService = {
  getAll: async (params?: QueryParams): Promise<PaginatedData<Item>> => {
    const res = await axiosInstance.get<ApiResponse<PaginatedData<Item>>>(
      "/masters/items",
      { params }
    );
    return res.data.data;
  },

  search: async (params?: { q?: string }): Promise<Item[]> => {
    const res = await axiosInstance.get<ApiResponse<Item[]>>(
      "/masters/items/search",
      { params }
    );
    return res.data.data;
  },

  getOne: async (id: string): Promise<Item> => {
    const res = await axiosInstance.get<ApiResponse<Item>>(
      `/masters/items/${id}`
    );
    return res.data.data;
  },

  create: async (payload: CreateItemPayload): Promise<Item> => {
    const res = await axiosInstance.post<ApiResponse<Item>>(
      "/masters/items/add",
      payload
    );
    return res.data.data;
  },

  update: async (
    id: string,
    payload: Partial<CreateItemPayload>
  ): Promise<Item> => {
    const res = await axiosInstance.put<ApiResponse<Item>>(
      `/masters/items/${id}`,
      payload
    );
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/masters/items/${id}`);
  },
};
