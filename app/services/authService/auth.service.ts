import axiosInstance from "../../api/axios";
import {
  ApiResponse,
  AuthResponse,
  LoginPayload,
  RegisterPayload,
} from "../../types";

export const authService = {
  // ── REGISTER ───────────────────────────────────────────────
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const res = await axiosInstance.post<ApiResponse<AuthResponse>>(
      "/auth/register",
      payload
    );
    return res.data.data;
  },

  // ── LOGIN ──────────────────────────────────────────────────
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const res = await axiosInstance.post<ApiResponse<AuthResponse>>(
      "/auth/login",
      payload
    );
    return res.data.data;
  },
};
