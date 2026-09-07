import axiosInstance from "@/app/api/axios";
import {
  ApiResponse,
  PaginatedData,
  Payment,
  CreatePaymentPayload,
  OutstandingInvoice,
} from "../../types/index";

export const paymentService = {
  getOutstanding: async (customerId: string): Promise<OutstandingInvoice[]> => {
    const res = await axiosInstance.get<ApiResponse<OutstandingInvoice[]>>(
      "/payments/outstanding",
      { params: { customerId } }
    );
    return res.data.data;
  },

  getAll: async (params?: {
    customerId?: string;
    paymentMode?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedData<Payment>> => {
    const res = await axiosInstance.get<ApiResponse<PaginatedData<Payment>>>(
      "/payments",
      { params }
    );
    return res.data.data;
  },

  getOne: async (id: string): Promise<Payment> => {
    const res = await axiosInstance.get<ApiResponse<Payment>>(
      `/payments/${id}`
    );
    return res.data.data;
  },

  create: async (payload: CreatePaymentPayload): Promise<Payment> => {
    const res = await axiosInstance.post<ApiResponse<Payment>>(
      "/payments/add",
      payload
    );
    return res.data.data;
  },
};
