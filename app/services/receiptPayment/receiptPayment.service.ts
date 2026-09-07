import axiosInstance from "@/app/api/axios";
import type {
  ApiResponse,
  PaginatedData,
  ReceiptPayment,
  CreateReceiptPaymentPayload,
  OutstandingInvoicesResponse,
} from "@/app/types";

export const receiptService = {
  getOutstanding: async (customerId: string): Promise<OutstandingInvoicesResponse> => {
    const res = await axiosInstance.get<ApiResponse<OutstandingInvoicesResponse>>(
      `/customers/${customerId}/outstanding`
    );
    return res.data.data;
  },

  getAll: async (params?: Record<string, unknown>): Promise<PaginatedData<ReceiptPayment>> => {
    const res = await axiosInstance.get<ApiResponse<PaginatedData<ReceiptPayment>>>(
      "/receipts",
      { params }
    );
    return res.data.data;
  },

  getByInvoice: async (invoiceId: string): Promise<ReceiptPayment[]> => {
    const res = await axiosInstance.get<ApiResponse<ReceiptPayment[]>>("/receipts", {
      params: { invoiceId },
    });
    return res.data.data;
  },

  getOne: async (id: string): Promise<ReceiptPayment> => {
    const res = await axiosInstance.get<ApiResponse<ReceiptPayment>>(`/receipts/${id}`);
    return res.data.data;
  },

  create: async (payload: CreateReceiptPaymentPayload): Promise<ReceiptPayment> => {
    const res = await axiosInstance.post<ApiResponse<ReceiptPayment>>("/receipts", payload);
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/receipts/${id}`);
  },
};

export const vendorPaymentService = {
  getOutstanding: async (vendorId: string): Promise<OutstandingInvoicesResponse> => {
    const res = await axiosInstance.get<ApiResponse<OutstandingInvoicesResponse>>(
      `/vendors/${vendorId}/outstanding`
    );
    return res.data.data;
  },

  getAll: async (params?: Record<string, unknown>): Promise<PaginatedData<ReceiptPayment>> => {
    const res = await axiosInstance.get<ApiResponse<PaginatedData<ReceiptPayment>>>(
      "/vendor-payments",
      { params }
    );
    return res.data.data;
  },

  getByInvoice: async (invoiceId: string): Promise<ReceiptPayment[]> => {
    const res = await axiosInstance.get<ApiResponse<ReceiptPayment[]>>(
      "/vendor-payments",
      { params: { invoiceId } }
    );
    return res.data.data;
  },

  getOne: async (id: string): Promise<ReceiptPayment> => {
    const res = await axiosInstance.get<ApiResponse<ReceiptPayment>>(
      `/vendor-payments/${id}`
    );
    return res.data.data;
  },

  create: async (payload: CreateReceiptPaymentPayload): Promise<ReceiptPayment> => {
    const res = await axiosInstance.post<ApiResponse<ReceiptPayment>>(
      "/vendor-payments",
      payload
    );
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/vendor-payments/${id}`);
  },
};
