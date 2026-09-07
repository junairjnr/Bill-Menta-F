import axios from "axios";
import { tokenUtils } from "@/app/utilsComponents/token";
import type { ApiResponse, DocumentAttachment } from "@/app/types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:8008/api";

function authHeaders() {
  const headers: Record<string, string> = {};
  const token = tokenUtils.getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (typeof window !== "undefined") {
    const fyId = localStorage.getItem("ACTIVE_FY_ID");
    if (fyId) headers["x-fy-id"] = fyId;
  }
  return headers;
}

export const uploadService = {
  uploadPurchaseDocument: async (file: File): Promise<DocumentAttachment> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post<ApiResponse<DocumentAttachment>>(
      `${API_BASE}/uploads/purchase`,
      formData,
      {
        headers: {
          ...authHeaders(),
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000,
      }
    );

    return res.data.data;
  },

  deletePurchaseDocument: async (fileName: string): Promise<void> => {
    await axios.delete(`${API_BASE}/uploads/purchase/${encodeURIComponent(fileName)}`, {
      headers: authHeaders(),
      timeout: 30000,
    });
  },

  fetchPurchaseDocument: async (
    fileName: string,
    originalName: string,
    inline = false
  ): Promise<Blob> => {
    const params = new URLSearchParams({
      name: originalName,
      ...(inline ? { inline: "1" } : {}),
    });

    const res = await axios.get(
      `${API_BASE}/uploads/purchase/${encodeURIComponent(fileName)}?${params.toString()}`,
      {
        headers: authHeaders(),
        responseType: "blob",
        timeout: 60000,
      }
    );

    return res.data as Blob;
  },

  viewPurchaseDocument: async (attachment: DocumentAttachment) => {
    const blob = await uploadService.fetchPurchaseDocument(
      attachment.fileName,
      attachment.originalName,
      true
    );
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank", "noopener,noreferrer");
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  },

  downloadPurchaseDocument: async (attachment: DocumentAttachment) => {
    const blob = await uploadService.fetchPurchaseDocument(
      attachment.fileName,
      attachment.originalName,
      false
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = attachment.originalName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  },
};
