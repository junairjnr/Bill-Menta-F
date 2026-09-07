import axiosInstance from "../../../api/axios";
import {
  ApiResponse,
  PaginatedData,
  QueryParams,
  CreateUomPayload,
  PriceLevel,
  CreatePriceLevelPayload,
} from "../../../types";

export const priceLevelService = {
  getAll: async (params?: QueryParams): Promise<PaginatedData<PriceLevel>> => {
    const res = await axiosInstance.get<ApiResponse<PaginatedData<PriceLevel>>>(
      "/masters/price-level",
      { params }
    );
    return res.data.data;
  },

  getOne: async (id: string): Promise<PriceLevel> => {
    const res = await axiosInstance.get<ApiResponse<PriceLevel>>(
      `/masters/price-level/${id}`
    );
    return res.data.data;
  },

  create: async (payload: CreatePriceLevelPayload): Promise<PriceLevel> => {
    const res = await axiosInstance.post<ApiResponse<PriceLevel>>(
      "/masters/price-level/add",
      payload
    );
    return res.data.data;
  },

  update: async (
    id: string,
    payload: Partial<CreatePriceLevelPayload>
  ): Promise<PriceLevel> => {
    const res = await axiosInstance.put<ApiResponse<PriceLevel>>(
      `/masters/price-level/${id}`,
      payload
    );
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/masters/price-level/${id}`);
  },
};
