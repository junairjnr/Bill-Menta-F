import axiosInstance from "../../../api/axios";
import {
  ApiResponse,
  PaginatedData,
  QueryParams,
  Uom,
  CreateUomPayload,
} from "../../../types";

export const uomService = {
  getAll: async (params?: QueryParams): Promise<PaginatedData<Uom>> => {
    const res = await axiosInstance.get<ApiResponse<PaginatedData<Uom>>>(
      "/masters/uom",
      { params }
    );
    return res.data.data;
  },

  getOne: async (id: string): Promise<Uom> => {
    const res = await axiosInstance.get<ApiResponse<Uom>>(`/masters/uom/${id}`);
    return res.data.data;
  },

  create: async (payload: CreateUomPayload): Promise<Uom> => {
    const res = await axiosInstance.post<ApiResponse<Uom>>(
      "/masters/uom/add",
      payload
    );
    return res.data.data;
  },

  update: async (
    id: string,
    payload: Partial<CreateUomPayload>
  ): Promise<Uom> => {
    const res = await axiosInstance.put<ApiResponse<Uom>>(
      `/masters/uom/${id}`,
      payload
    );
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/masters/uom/${id}`);
  },
};
