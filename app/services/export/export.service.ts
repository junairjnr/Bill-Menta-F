import axiosInstance from "@/app/api/axios";
import { EXPORT_LIMIT } from "@/app/config/pagination";

export type ExportColumn = { key: string; label: string; default: boolean };

export const exportService = {
  downloadExcel: async (
    reportType: string,
    columns: string[],
    params?: Record<string, string>
  ) => {
    const res = await axiosInstance.post(
      `/export/${reportType}`,
      { columns },
      {
        params: { ...params, limit: String(EXPORT_LIMIT) },
        responseType: "blob",
      }
    );

    const disposition = res.headers["content-disposition"] || "";
    const match = disposition.match(/filename="?([^"]+)"?/);
    const rawName = match?.[1] || `${reportType}.xlsx`;
    const filename = rawName.replace(/[/\\<>:"|?*\x00-\x1f]/g, "_").slice(0, 200);

    const url = URL.createObjectURL(res.data as Blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  },
};
