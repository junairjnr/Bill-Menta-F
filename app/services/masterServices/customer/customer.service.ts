import axiosInstance from "../../../api/axios";
import {
  ApiResponse,
  PaginatedData,
  QueryParams,
  Customer,
  CreateCustomerPayload,
} from "../../../types";

export const customerService = {
  getAll: async (params?: QueryParams): Promise<PaginatedData<Customer>> => {
    const res = await axiosInstance.get<ApiResponse<PaginatedData<Customer>>>(
      "/masters/customers",
      { params }
    );
    return res.data.data;
  },

  search: async (params?: {
    q?: string;
    type?: string;
    customerType?: string;
  }): Promise<Customer[]> => {
    const res = await axiosInstance.get<ApiResponse<Customer[]>>(
      "/masters/customers/search",
      { params }
    );
    return res.data.data;
  },

  getOne: async (id: string): Promise<Customer> => {
    const res = await axiosInstance.get<ApiResponse<Customer>>(
      `/masters/customers/${id}`
    );
    return res.data.data;
  },

  create: async (payload: CreateCustomerPayload): Promise<Customer> => {
    const res = await axiosInstance.post<ApiResponse<Customer>>(
      "/masters/customers/add",
      payload
    );
    return res.data.data;
  },

  update: async (
    id: string,
    payload: Partial<CreateCustomerPayload>
  ): Promise<Customer> => {
    const res = await axiosInstance.put<ApiResponse<Customer>>(
      `/masters/customers/${id}`,
      payload
    );
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/masters/customers/${id}`);
  },
};
