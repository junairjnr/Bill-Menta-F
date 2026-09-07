import axiosInstance from "@/app/api/axios";
import {
  ApiResponse,
  CreateSalesReturnPayload,
  PaginatedData,
  SalesReturn,
  SalesReturnableData,
} from "@/app/types";

export const salesReturnService = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    salesType?: string;
    salesInvoiceId?: string;
  }) => {
    const res = await axiosInstance.get<ApiResponse<PaginatedData<SalesReturn>>>(
      "/sales/returns",
      { params }
    );
    return res.data.data;
  },

  getOne: async (id: string) => {
    const res = await axiosInstance.get<ApiResponse<SalesReturn>>(
      `/sales/returns/${id}`
    );
    return res.data.data;
  },

  getReturnableItems: async (invoiceId: string) => {
    const res = await axiosInstance.get<ApiResponse<SalesReturnableData>>(
      `/sales/returns/invoice/${invoiceId}/returnable`
    );
    return res.data.data;
  },

  create: async (payload: CreateSalesReturnPayload) => {
    const res = await axiosInstance.post<ApiResponse<SalesReturn>>(
      "/sales/returns/add",
      payload
    );
    return res.data.data;
  },
};
