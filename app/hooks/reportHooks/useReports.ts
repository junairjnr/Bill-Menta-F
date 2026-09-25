import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { reportsService } from "@/app/services/reportsServices/reports.services";

export const useStockReport = (params?: {
  warehouseId?: string;
  categoryId?: string;
  itemId?: string;
  includeZero?: boolean;
  page?: number;
  limit?: number;
}) =>
  useQuery({
    queryKey: ["reports", "stock", params],
    queryFn: () =>
      reportsService.getStockReport({
        ...params,
        includeZero: params?.includeZero,
      }),
    placeholderData: keepPreviousData,
  });

export const usePurchaseReport = (params?: {
  dateFrom?: string;
  dateTo?: string;
  vendorId?: string;
  warehouseId?: string;
  status?: string;
  page?: number;
  limit?: number;
}) =>
  useQuery({
    queryKey: ["reports", "purchase", params],
    queryFn: () => reportsService.getPurchaseReport(params),
    placeholderData: keepPreviousData,
  });

export const useSalesReport = (params?: {
  dateFrom?: string;
  dateTo?: string;
  customerId?: string;
  salesType?: string;
  warehouseId?: string;
  status?: string;
  page?: number;
  limit?: number;
}) =>
  useQuery({
    queryKey: ["reports", "sales", params],
    queryFn: () => reportsService.getSalesReport(params),
    placeholderData: keepPreviousData,
  });

export const useLedgerReport = (params: {
  itemId: string;
  warehouseId?: string;
  movementType?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}) =>
  useQuery({
    queryKey: ["reports", "ledger", params],
    queryFn: () => reportsService.getLedgerReport(params),
    enabled: !!params.itemId,
    placeholderData: keepPreviousData,
  });

// Add to existing hooks:

export const useShopReport = (params?: {
  partyType?: "customer" | "vendor";
  partyId?: string;
  salesType?: "retail" | "wholesale";
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}) =>
  useQuery({
    queryKey: ["report-shop", params],
    queryFn: () => reportsService.shopReport(params),
    placeholderData: keepPreviousData,
    staleTime: 0,
  });

export const usePurchaseHistory = (params?: {
  itemId?: string;
  vendorId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}) =>
  useQuery({
    queryKey: ["report-purchase-history", params],
    queryFn: () => reportsService.getPurchaseHistory(params ?? {}),
    placeholderData: keepPreviousData,
    staleTime: 0,
  });

export const useSalesReturnHistory = (params?: {
  itemId?: string;
  customerId?: string;
  salesType?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}) =>
  useQuery({
    queryKey: ["reports", "sales-return-history", params],
    queryFn: () => reportsService.getSalesReturnHistory(params),
    placeholderData: keepPreviousData,
  });

export const usePurchaseReturnHistory = (params?: {
  itemId?: string;
  vendorId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}) =>
  useQuery({
    queryKey: ["reports", "purchase-return-history", params],
    queryFn: () => reportsService.getPurchaseReturnHistory(params),
    placeholderData: keepPreviousData,
  });

export const useSalesHistory = (params?: {
  itemId?: string;
  customerId?: string;
  salesType?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}) =>
  useQuery({
    queryKey: ["report-sales-history", params],
    queryFn: () => reportsService.getSalesHistory(params ?? {}),
    placeholderData: keepPreviousData,
    staleTime: 0,
  });

export const useExpenseReport = (params?: {
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}) =>
  useQuery({
    queryKey: ["report-expense", params],
    queryFn: () => reportsService.getExpenseReport(params),
    placeholderData: keepPreviousData,
    staleTime: 0,
  });

export const useSalesReturnReport = (params?: {
  dateFrom?: string;
  dateTo?: string;
  customerId?: string;
  salesType?: string;
  warehouseId?: string;
  status?: string;
  page?: number;
  limit?: number;
}) =>
  useQuery({
    queryKey: ["reports", "sales-return", params],
    queryFn: () => reportsService.getSalesReturnReport(params),
    placeholderData: keepPreviousData,
  });

export const usePurchaseReturnReport = (params?: {
  dateFrom?: string;
  dateTo?: string;
  vendorId?: string;
  warehouseId?: string;
  status?: string;
  page?: number;
  limit?: number;
}) =>
  useQuery({
    queryKey: ["reports", "purchase-return", params],
    queryFn: () => reportsService.getPurchaseReturnReport(params),
    placeholderData: keepPreviousData,
  });
