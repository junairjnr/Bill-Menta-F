import axiosInstance from "@/app/api/axios";
import { ApiResponse, CreatePurchasePayload, PaginatedData, PurchaseInvoice } from "@/app/types";



export const purchaseService = {
  getAll: async (params?: { page?: number; limit?: number; search?: string }) => {
    const res = await axiosInstance.get<ApiResponse<PaginatedData<PurchaseInvoice>>>(
      "/purchase", { params }
    );
    return res.data.data;
  },

  getOne: async (id: string) => {
    const res = await axiosInstance.get<ApiResponse<PurchaseInvoice>>(`/purchase/${id}`);
    return res.data.data;
  },

  create: async (payload: CreatePurchasePayload) => {
    const res = await axiosInstance.post<ApiResponse<PurchaseInvoice>>(
      "/purchase/add", payload
    );
    return res.data.data;
  },
};