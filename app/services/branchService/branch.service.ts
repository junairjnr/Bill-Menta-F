import axiosInstance from "../../../app/api/axios";
import {
  ApiResponse,
  PaginatedData,
  QueryParams,
  Branch,
  CreateBranchPayload,
} from "../../types/index";

export const branchService = {
  getAll: async (params?: QueryParams): Promise<PaginatedData<Branch>> => {
    const res = await axiosInstance.get<ApiResponse<PaginatedData<Branch>>>(
      "/branches",
      { params }
    );

    return res.data.data;
  },

  getOne: async (id: string): Promise<Branch> => {
    const res = await axiosInstance.get<ApiResponse<Branch>>(
      `/branches/${id}`
    );

    return res.data.data;
  },

  create: async (payload: CreateBranchPayload): Promise<Branch> => {
    const res = await axiosInstance.post<ApiResponse<Branch>>(
      "/branches/add",
      payload
    );

    return res.data.data;
  },

  update: async (
    id: string,
    payload: Partial<CreateBranchPayload>
  ): Promise<Branch> => {
    const res = await axiosInstance.put<ApiResponse<Branch>>(
      `/branches/${id}`,
      payload
    );

    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/branches/${id}`);
  },
};
