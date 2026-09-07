import axiosInstance from "@/app/api/axios";
import {
  ApiResponse,
  PaginatedData,
  SalesInvoice,
  CreateSalesPayload,
} from "../../types";

export const salesService = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    salesType?: string;
  }): Promise<PaginatedData<SalesInvoice>> => {
    const res = await axiosInstance.get<
      ApiResponse<PaginatedData<SalesInvoice>>
    >("/sales", { params });

    return res.data.data;
  },

  getOne: async (id: string): Promise<SalesInvoice> => {
    const res = await axiosInstance.get<ApiResponse<SalesInvoice>>(
      `/sales/${id}`
    );

    return res.data.data;
  },

  create: async (payload: CreateSalesPayload): Promise<SalesInvoice> => {
    const res = await axiosInstance.post<ApiResponse<SalesInvoice>>(
      "/sales/add",
      payload
    );

    return res.data.data;
  },
};
