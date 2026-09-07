import axiosInstance from "@/app/api/axios";
import {
  ApiResponse,
  CreatePurchaseReturnPayload,
  PaginatedData,
  PurchaseReturn,
  PurchaseReturnableData,
} from "@/app/types";

export const purchaseReturnService = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    purchaseInvoiceId?: string;
  }) => {
    const res = await axiosInstance.get<ApiResponse<PaginatedData<PurchaseReturn>>>(
      "/purchase/returns",
      { params }
    );
    return res.data.data;
  },

  getOne: async (id: string) => {
    const res = await axiosInstance.get<ApiResponse<PurchaseReturn>>(
      `/purchase/returns/${id}`
    );
    return res.data.data;
  },

  getReturnableItems: async (invoiceId: string) => {
    const res = await axiosInstance.get<ApiResponse<PurchaseReturnableData>>(
      `/purchase/returns/invoice/${invoiceId}/returnable`
    );
    return res.data.data;
  },

  create: async (payload: CreatePurchaseReturnPayload) => {
    const res = await axiosInstance.post<ApiResponse<PurchaseReturn>>(
      "/purchase/returns/add",
      payload
    );
    return res.data.data;
  },
};
