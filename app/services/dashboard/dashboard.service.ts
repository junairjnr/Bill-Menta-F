import axiosInstance from "@/app/api/axios";
import { ApiResponse } from "@/app/types";

export interface DashboardApiResponse {
  stats: {
    salesTotal: number;
    purchaseTotal: number;
    salesReturnTotal: number;
    purchaseReturnTotal: number;
    receiptsTotal: number;
    paymentsTotal: number;
    expensesTotal: number;
    productCount: number;
    customerCount: number;
  };
  revenueTrend: { month: string; sales: number; purchase: number }[];
  returnTrend: { month: string; salesReturn: number; purchaseReturn: number }[];
  cashFlowTrend: { month: string; receipts: number; payments: number }[];
  businessMix: { id: string; label: string; amount: number; percent: number }[];
  salesByCategory: { id: string; label: string; amount: number; percent: number }[];
  expenseByCategory: { id: string; label: string; amount: number; percent: number }[];
  expenseTrend: { month: string; amount: number }[];
  salesByType: {
    retail: number;
    wholesale: number;
    retailPercent: number;
    wholesalePercent: number;
    total: number;
  };
  paymentStatus: { paid: number; partial: number; pending: number; total: number };
  topSoldProducts: {
    id: string;
    rank: number;
    product: string;
    sku: string;
    qty: number;
    amount: number;
  }[];
  recentSales: {
    id: string;
    invoiceNo: string;
    customer: string;
    date: string;
    amount: number;
    paymentStatus: string;
  }[];
  recentPurchases: {
    id: string;
    invoiceNo: string;
    vendor: string;
    date: string;
    items: number;
    amount: number;
    status: string;
  }[];
  lowStock: {
    id: string;
    product: string;
    sku: string;
    stock: number;
    threshold: number;
  }[];
}

export const dashboardService = {
  getDashboard: async () => {
    const res = await axiosInstance.get<ApiResponse<DashboardApiResponse>>(
      "/reports/dashboard"
    );
    return res.data.data;
  },
};
