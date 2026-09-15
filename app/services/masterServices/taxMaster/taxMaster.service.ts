import axiosInstance from "../../../api/axios";
import {
  ApiResponse,
  PaginatedData,
  QueryParams,
  TaxMaster,
  CreateTaxMasterPayload,
} from "../../../types";

export const taxMasterService = {
  getAll: async (params?: QueryParams): Promise<PaginatedData<TaxMaster>> => {
    const res = await axiosInstance.get<ApiResponse<PaginatedData<TaxMaster>>>(
      "/masters/tax-master",
      { params }
    );
    return res.data.data;
  },

  getOne: async (id: string): Promise<TaxMaster> => {
    const res = await axiosInstance.get<ApiResponse<TaxMaster>>(
      `/masters/tax-master/${id}`
    );
    return res.data.data;
  },

  create: async (payload: CreateTaxMasterPayload): Promise<TaxMaster> => {
    const res = await axiosInstance.post<ApiResponse<TaxMaster>>(
      "/masters/tax-master/add",
      payload
    );
    return res.data.data;
  },

  update: async (
    id: string,
    payload: Partial<CreateTaxMasterPayload>
  ): Promise<TaxMaster> => {
    const res = await axiosInstance.put<ApiResponse<TaxMaster>>(
      `/masters/tax-master/${id}`,
      payload
    );
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/masters/tax-master/${id}`);
  },
};
