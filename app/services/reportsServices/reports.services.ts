import axiosInstance from "@/app/api/axios";
import {
  ApiResponse,
  ReportResponse,
  StockReportRow,
  StockReportSummary,
  PurchaseReportRow,
  PurchaseReportSummary,
  SalesReportRow,
  SalesReportSummary,
  LedgerReportRow,
  LedgerReportSummary,
  SalesHistoryRow,
  SalesHistorySummary,
  ShopReportEntry,
  ShopReportSummary,
  PurchaseHistoryRow,
  PurchaseHistorySummary,
  SalesReturnHistoryRow,
  SalesReturnHistorySummary,
  PurchaseReturnHistoryRow,
  PurchaseReturnHistorySummary,
  SalesReturnReportRow,
  SalesReturnReportSummary,
  PurchaseReturnReportRow,
  PurchaseReturnReportSummary,
  ExpenseReportRow,
  ExpenseReportSummary,
} from "../../types/index";

export const reportsService = {
  // Stock Report
  getStockReport: async (params?: {
    warehouseId?: string;
    categoryId?: string;
    itemId?: string;
    includeZero?: boolean;
    page?: number;
    limit?: number;
  }) => {
    const res = await axiosInstance.get<
      ApiResponse<ReportResponse<StockReportRow, StockReportSummary>>
    >("/reports/stock", {
      params: {
        ...params,
        includeZero: params?.includeZero ? "true" : "false",
      },
    });
    return res.data.data;
  },

  // Purchase Report
  getPurchaseReport: async (params?: {
    dateFrom?: string;
    dateTo?: string;
    vendorId?: string;
    warehouseId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    const res = await axiosInstance.get<
      ApiResponse<ReportResponse<PurchaseReportRow, PurchaseReportSummary>>
    >("/reports/purchase", { params });
    return res.data.data;
  },

  // Sales Report
  getSalesReport: async (params?: {
    dateFrom?: string;
    dateTo?: string;
    customerId?: string;
    salesType?: string;
    warehouseId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    const res = await axiosInstance.get<
      ApiResponse<ReportResponse<SalesReportRow, SalesReportSummary>>
    >("/reports/sales", { params });
    return res.data.data;
  },

  // Ledger Report
  getLedgerReport: async (params: {
    itemId: string; // required
    warehouseId?: string;
    movementType?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }) => {
    const res = await axiosInstance.get<
      ApiResponse<ReportResponse<LedgerReportRow, LedgerReportSummary>>
    >("/reports/ledger", { params });
    return res.data.data;
  },

  // Add to existing reportsService object:

  shopReport: async (params?: {
    partyType?: "customer" | "vendor";
    partyId?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }) => {
    const res = await axiosInstance.get<
      ApiResponse<{
        rows: ShopReportEntry[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        summary: ShopReportSummary;
      }>
    >("/reports/shop", { params });
    return res.data.data;
  },

  getPurchaseHistory: async (params?: {
    itemId?: string;
    vendorId?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }) => {
    const res = await axiosInstance.get<
      ApiResponse<{
        rows: PurchaseHistoryRow[];
        total: number;
        totalPages: number;
        hasNext: boolean;
        summary: PurchaseHistorySummary;
      }>
    >("/reports/purchase-history", { params });
    return res.data.data;
  },

  getSalesHistory: async (params?: {
    itemId?: string;
    customerId?: string;
    salesType?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }) => {
    const res = await axiosInstance.get<
      ApiResponse<{
        rows: SalesHistoryRow[];
        total: number;
        totalPages: number;
        hasNext: boolean;
        summary: SalesHistorySummary;
      }>
    >("/reports/sales-history", { params });
    return res.data.data;
  },

  getSalesReturnHistory: async (params?: {
    itemId?: string;
    customerId?: string;
    salesType?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }) => {
    const res = await axiosInstance.get<
      ApiResponse<{
        rows: SalesReturnHistoryRow[];
        total: number;
        totalPages: number;
        hasNext: boolean;
        summary: SalesReturnHistorySummary;
      }>
    >("/reports/sales-return-history", { params });
    return res.data.data;
  },

  getPurchaseReturnHistory: async (params?: {
    itemId?: string;
    vendorId?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }) => {
    const res = await axiosInstance.get<
      ApiResponse<{
        rows: PurchaseReturnHistoryRow[];
        total: number;
        totalPages: number;
        hasNext: boolean;
        summary: PurchaseReturnHistorySummary;
      }>
    >("/reports/purchase-return-history", { params });
    return res.data.data;
  },

  getExpenseReport: async (params?: {
    category?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }) => {
    const res = await axiosInstance.get<
      ApiResponse<{
        rows: ExpenseReportRow[];
        total: number;
        totalPages: number;
        hasNext: boolean;
        summary: ExpenseReportSummary;
      }>
    >("/reports/expense", { params });
    return res.data.data;
  },

  getSalesReturnReport: async (params?: {
    dateFrom?: string;
    dateTo?: string;
    customerId?: string;
    salesType?: string;
    warehouseId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    const res = await axiosInstance.get<
      ApiResponse<ReportResponse<SalesReturnReportRow, SalesReturnReportSummary>>
    >("/reports/sales-return", { params });
    return res.data.data;
  },

  getPurchaseReturnReport: async (params?: {
    dateFrom?: string;
    dateTo?: string;
    vendorId?: string;
    warehouseId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    const res = await axiosInstance.get<
      ApiResponse<ReportResponse<PurchaseReturnReportRow, PurchaseReturnReportSummary>>
    >("/reports/purchase-return", { params });
    return res.data.data;
  },
};
