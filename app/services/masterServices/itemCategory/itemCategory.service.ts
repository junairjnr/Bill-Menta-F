import axiosInstance from "../../../api/axios";
import {
  ApiResponse,
  PaginatedData,
  QueryParams,
  ItemCategory,
  CreateItemCategoryPayload,
} from "../../../types";

// ── Item Categories ───────────────────────────────────────────
export const itemCategoryService = {
  getAll: async (
    params?: QueryParams
  ): Promise<PaginatedData<ItemCategory>> => {
    const res = await axiosInstance.get<
      ApiResponse<PaginatedData<ItemCategory>>
    >("/masters/item-categories", { params });
    return res.data.data;
  },

  getOne: async (id: string): Promise<ItemCategory> => {
    const res = await axiosInstance.get<ApiResponse<ItemCategory>>(
      `/masters/item-categories/${id}`
    );
    return res.data.data;
  },

  create: async (payload: CreateItemCategoryPayload): Promise<ItemCategory> => {
    const res = await axiosInstance.post<ApiResponse<ItemCategory>>(
      "/masters/item-categories/add",
      payload
    );
    return res.data.data;
  },

  update: async (
    id: string,
    payload: Partial<CreateItemCategoryPayload>
  ): Promise<ItemCategory> => {
    const res = await axiosInstance.put<ApiResponse<ItemCategory>>(
      `/masters/item-categories/${id}`,
      payload
    );
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/masters/item-categories/${id}`);
  },
};
