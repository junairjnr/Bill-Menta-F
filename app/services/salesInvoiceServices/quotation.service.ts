import axiosInstance from "@/app/api/axios";
import {
  ApiResponse,
  PaginatedData,
  Quotation,
  CreateQuotationPayload,
} from "../../types";

export const quotationService = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    salesType?: string;
  }): Promise<PaginatedData<Quotation>> => {
    const res = await axiosInstance.get<
      ApiResponse<PaginatedData<Quotation>>
    >("/sales/quotations", { params });

    return res.data.data;
  },

  getOne: async (id: string): Promise<Quotation> => {
    const res = await axiosInstance.get<ApiResponse<Quotation>>(
      `/sales/quotations/${id}`
    );

    return res.data.data;
  },

  create: async (payload: CreateQuotationPayload): Promise<Quotation> => {
    const res = await axiosInstance.post<ApiResponse<Quotation>>(
      "/sales/quotations/add",
      payload
    );

    return res.data.data;
  },
};
