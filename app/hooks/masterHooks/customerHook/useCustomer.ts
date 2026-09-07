import { KEYS } from "@/app/queryKeys/keys";
import { customerService } from "@/app/services/masterServices/customer/customer.service";
import { CreateCustomerPayload, QueryParams } from "@/app/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// ── Customers ─────────────────────────────────────────────────
export const useCustomers = (params?: QueryParams) =>
  useQuery({
    queryKey: KEYS.customers(params),
    queryFn: () => customerService.getAll(params),
  });

export const useCustomer = (id: string) =>
  useQuery({
    queryKey: KEYS.customer(id),
    queryFn: () => customerService.getOne(id),
    enabled: !!id,
  });

export const useCreateCustomer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCustomerPayload) =>
      customerService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["customers"] }),
    onError: (error) => {
      toast.error(
        `Failed to create customer: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    },
  });
};

export const useUpdateCustomer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<CreateCustomerPayload>;
    }) => customerService.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["customers"] }),
  });
};

export const useDeleteCustomer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => customerService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["customers"] }),
  });
};
