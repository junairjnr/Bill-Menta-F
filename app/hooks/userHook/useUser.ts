import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "../../services/user/user.services";
import toast from "react-hot-toast";
import { CreateUserPayload, UpdateUserPayload } from "../../types";

export const useUsers = () =>
  useQuery({
    queryKey: ["users"],
    queryFn: () => userService.getAll(),
  });

export const useUser = (id: string) =>
  useQuery({
    queryKey: ["users", id],
    queryFn: () => userService.getOne(id),
    enabled: !!id,
  });

export const useCreateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateUserPayload) => userService.create(payload),
    onSuccess: () => {
      toast.success("User created");
      qc.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to create user");
    },
  });
};

export const useUpdateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload }) =>
      userService.update(id, payload),
    onSuccess: () => {
      toast.success("User updated");
      qc.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update user");
    },
  });
};

export const useDeactivateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userService.deactivate(id),
    onSuccess: () => {
      toast.success("User deactivated");
      qc.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to deactivate user");
    },
  });
};
