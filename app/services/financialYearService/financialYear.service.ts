import axiosInstance from "@/app/api/axios";

import { ApiResponse, FY, PaginatedData, QueryParams } from "@/app/types";

export const fyService = {
  getAll: async (params?: QueryParams): Promise<PaginatedData<FY>> => {
    const res = await axiosInstance.get<ApiResponse<PaginatedData<FY>>>(
      "/financial-years",
      { params }
    );

    return res.data.data;
  },

  getOne: async (id: string): Promise<FY> => {
    const res = await axiosInstance.get<ApiResponse<FY>>(
      `/financial-years/${id}`
    );

    return res.data.data;
  },

  getActive: async (): Promise<FY> => {
    const res = await axiosInstance.get<ApiResponse<FY>>(
      "/financial-years/active"
    );

    return res.data.data;
  },

  create: async (payload: { startYear: number }): Promise<FY> => {
    const res = await axiosInstance.post<ApiResponse<FY>>(
      "/financial-years/add",
      payload
    );

    return res.data.data;
  },

  switchFY: async (id: string): Promise<FY> => {
    const res = await axiosInstance.patch<ApiResponse<FY>>(
      `/financial-years/${id}/switch`
    );

    return res.data.data;
  },
  closeFY: async (id: string): Promise<FY> => {
    const res = await axiosInstance.patch<ApiResponse<FY>>(
      `/financial-years/${id}/close`
    );

    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/financial-years/${id}`);
  },
};
