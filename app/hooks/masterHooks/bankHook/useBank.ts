import { bankAccountService } from "@/app/services/bank/bank.services";
import { CreateBankAccountPayload } from "@/app/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";

export const useBankAccounts = () =>
  useQuery({
    queryKey: ["bank-accounts"],
    queryFn: () => bankAccountService.getAll(),
  });

export const useBankAccount = (id: string) =>
  useQuery({
    queryKey: ["bank-accounts", id],
    queryFn: () => bankAccountService.getOne(id),
    enabled: !!id,
  });

export const useCreateBankAccount = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBankAccountPayload) =>
      bankAccountService.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bank-accounts"] });
      toast.success("Bank account added");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to add bank account"
      );
    },
  });
};

export const useUpdateBankAccount = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<CreateBankAccountPayload>;
    }) => bankAccountService.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bank-accounts"] });
      toast.success("Bank account updated");
    },
  });
};

export const useDeleteBankAccount = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bankAccountService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bank-accounts"] });
      toast.success("Bank account removed");
    },
  });
};
