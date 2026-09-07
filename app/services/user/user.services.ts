import axiosInstance from "../../api/axios";
import {
  ApiResponse,
  User,
  CreateUserPayload,
  UpdateUserPayload,
  InviteUserPayload,
} from "../../types";

export const userService = {
  getAll: async (): Promise<User[]> => {
    const res = await axiosInstance.get<ApiResponse<User[]>>("/users");
    return res.data.data;
  },

  getOne: async (id: string): Promise<User> => {
    const res = await axiosInstance.get<ApiResponse<User>>(`/users/${id}`);
    return res.data.data;
  },

  create: async (payload: CreateUserPayload): Promise<User> => {
    const res = await axiosInstance.post<ApiResponse<User>>("/users", payload);
    return res.data.data;
  },

  update: async (id: string, payload: UpdateUserPayload): Promise<User> => {
    const res = await axiosInstance.put<ApiResponse<User>>(
      `/users/${id}`,
      payload
    );
    return res.data.data;
  },

  deactivate: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/users/${id}`);
  },

  invite: async (
    payload: InviteUserPayload
  ): Promise<{ inviteLink: string }> => {
    const res = await axiosInstance.post<ApiResponse<{ inviteLink: string }>>(
      "/users/invite",
      payload
    );
    return res.data.data;
  },
};
