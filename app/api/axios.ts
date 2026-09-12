

import axios from "axios";
import { tokenUtils } from "../utilsComponents/token";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:8080/api";
// const API_BASE =
//   process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "https://billing-app-b.onrender.com/api";

const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});
// ✅ REQUEST INTERCEPTOR
axiosInstance.interceptors.request.use(
  (config) => {
    const token = tokenUtils.getToken();

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (typeof window !== "undefined") {
      const fyId = localStorage.getItem("ACTIVE_FY_ID");
      if (fyId) {
        config.headers = config.headers || {};
        config.headers["x-fy-id"] = fyId;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ RESPONSE INTERCEPTOR
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message;

    switch (status) {
      case 401: {
        const requestUrl = error?.config?.url ?? "";
        const isAuthRequest = /\/auth\/(login|register)/.test(requestUrl);

        // Let login/register pages show the error — don't hard-redirect and wipe state
        if (!isAuthRequest) {
          tokenUtils.removeToken();
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }
        break;
      }

      case 403:
        console.error("Access denied:", message);
        break;

      case 404:
        console.error("Not found:", message);
        break;

      case 500:
        console.error("Server error:", message);
        break;

      default:
        if (!error.response) {
          console.error("Network error — check your connection");
        }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
