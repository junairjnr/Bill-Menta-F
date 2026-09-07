// import { useMutation } from "@tanstack/react-query";
// import { useRouter } from "next/navigation";
// import { authService } from "../../services/auth/auth.service";
// import { useAuthStore } from "../../store/auth/auth.store";
// import { LoginPayload, RegisterPayload } from "../../types";
// import { AxiosError } from "axios";

// export const useLogin = () => {
//   const router   = useRouter();
//   const setAuth  = useAuthStore((s) => s.setAuth);

//   return useMutation({
//     mutationFn: (payload: LoginPayload) => authService.login(payload),
//     onSuccess: (data) => {
//       setAuth(data.token, data.user);
//       router.push("/dashboard");
//     },
//     onError: (error: AxiosError<{ message: string }>) => {
//       console.error(error.response?.data?.message || "Login failed");
//     },
//   });
// };

// export const useRegister = () => {
//   const router  = useRouter();
//   const setAuth = useAuthStore((s) => s.setAuth);

//   return useMutation({
//     mutationFn: (payload: RegisterPayload) => authService.register(payload),
//     onSuccess: (data) => {
//       setAuth(data.token, data.user);
//       router.push("/dashboard");
//     },
//     onError: (error: AxiosError<{ message: string }>) => {
//       console.error(error.response?.data?.message || "Registration failed");
//     },
//   });
// };

// export const useLogout = () => {
//   const router    = useRouter();
//   const clearAuth = useAuthStore((s) => s.clearAuth);

//   return () => {
//     clearAuth();
//     router.push("/login");
//   };
// };

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "../../services/authService/auth.service";
import { useAuthStore } from "../../store/auth/auth.store";
import { LoginPayload, RegisterPayload } from "../../types";

export const useLogin = () => {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),

    onSuccess: (data) => {
      setAuth(data.token, data.user);
      router.push("/dashboard");
    },

    onError: (error: unknown) => {
      const message =
        (error as any)?.response?.data?.message ||
        (error as any)?.message ||
        "Login failed";

      console.error(message);
    },
  });
};

export const useRegister = () => {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),

    onSuccess: (data) => {
      setAuth(data.token, data.user);
      router.push("/dashboard");
    },

    onError: (error: unknown) => {
      const message =
        (error as any)?.response?.data?.message ||
        (error as any)?.message ||
        "Registration failed";

      console.error(message);
    },
  });
};

export const useLogout = () => {
  const router = useRouter();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  return () => {
    clearAuth();
    router.push("/login");
  };
};
