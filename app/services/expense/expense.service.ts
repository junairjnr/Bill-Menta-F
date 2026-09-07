import axiosInstance from "@/app/api/axios";
import { ApiResponse, CreateExpensePayload, Expense, PaginatedData, QueryParams } from "@/app/types";

export const expenseService = {
  getAll: async (params?: QueryParams): Promise<PaginatedData<Expense>> => {
    const res = await axiosInstance.get<ApiResponse<PaginatedData<Expense>>>("/expenses", { params });
    return res.data.data;
  },

  getOne: async (id: string): Promise<Expense> => {
    const res = await axiosInstance.get<ApiResponse<Expense>>(`/expenses/${id}`);
    return res.data.data;
  },

  create: async (payload: CreateExpensePayload): Promise<Expense> => {
    const res = await axiosInstance.post<ApiResponse<Expense>>("/expenses", payload);
    return res.data.data;
  },

  update: async (id: string, payload: Partial<CreateExpensePayload>): Promise<Expense> => {
    const res = await axiosInstance.put<ApiResponse<Expense>>(`/expenses/${id}`, payload);
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/expenses/${id}`);
  },
};
