import axiosInstance from "@/app/api/axios";
import { ApiResponse, BankAccount, CreateBankAccountPayload, PaginatedData } from "@/app/types";
import { LOOKUP_LIMIT } from "@/app/config/pagination";

export const bankAccountService = {
  getAll: async (): Promise<PaginatedData<BankAccount>> => {
    const res = await axiosInstance.get<ApiResponse<PaginatedData<BankAccount>>>(
      "/bank-accounts", { params: { isActive: "true", limit: LOOKUP_LIMIT } }
    );
    return res.data.data;
  },

  getOne: async (id: string): Promise<BankAccount> => {
    const res = await axiosInstance.get<ApiResponse<BankAccount>>(`/bank-accounts/${id}`);
    return res.data.data;
  },

  create: async (payload: CreateBankAccountPayload): Promise<BankAccount> => {
    const res = await axiosInstance.post<ApiResponse<BankAccount>>("/bank-accounts", payload);
    return res.data.data;
  },

  update: async (id: string, payload: Partial<CreateBankAccountPayload>): Promise<BankAccount> => {
    const res = await axiosInstance.put<ApiResponse<BankAccount>>(`/bank-accounts/${id}`, payload);
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/bank-accounts/${id}`);
  },
};