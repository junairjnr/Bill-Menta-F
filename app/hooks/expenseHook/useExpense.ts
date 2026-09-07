import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { expenseService } from "@/app/services/expense/expense.service";
import { CreateExpensePayload, QueryParams } from "@/app/types";

export const useExpenses = (params?: QueryParams) =>
  useQuery({
    queryKey: ["expenses", params],
    queryFn: () => expenseService.getAll(params),
  });

export const useExpense = (id: string) =>
  useQuery({
    queryKey: ["expenses", id],
    queryFn: () => expenseService.getOne(id),
    enabled: !!id,
  });

export const useCreateExpense = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateExpensePayload) => expenseService.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["expenses"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      qc.invalidateQueries({ queryKey: ["report-expense"] });
      toast.success("Expense saved");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to save expense");
    },
  });
};

export const useUpdateExpense = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateExpensePayload> }) =>
      expenseService.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["expenses"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      qc.invalidateQueries({ queryKey: ["report-expense"] });
      toast.success("Expense updated");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update expense");
    },
  });
};

export const useDeleteExpense = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => expenseService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["expenses"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      qc.invalidateQueries({ queryKey: ["report-expense"] });
      toast.success("Expense cancelled");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to cancel expense");
    },
  });
};
