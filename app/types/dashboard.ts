export type DashboardRange = "today" | "weekly" | "monthly" | "yearly";

export interface DashboardStat {
  id: string;
  label: string;
  value: string;
  trend?: { value: number; direction: "up" | "down" };
}

export interface RevenueTrendPoint {
  month: string;
  sales: number;
  purchase: number;
}

export interface ReturnTrendPoint {
  month: string;
  salesReturn: number;
  purchaseReturn: number;
}

export interface CashFlowTrendPoint {
  month: string;
  receipts: number;
  payments: number;
}

export interface ExpenseTrendPoint {
  month: string;
  amount: number;
}

export interface DashboardCategoryItem {
  id: string;
  label: string;
  amount: number;
  percent: number;
}

export interface PieChartItem {
  id: string;
  label: string;
  value: number;
  amount?: number;
  percent: number;
  color: string;
}

export interface CategoryBarPoint {
  label: string;
  amount: number;
}

export interface SalesDistributionItem {
  id: string;
  label: string;
  amount: number;
  percent: number;
  color: string;
}

export interface CategoryChartItem {
  id: string;
  label: string;
  value: number;
  color: string;
}

export type TransactionStatus = "completed" | "pending" | "failed";

export interface DashboardTransaction {
  id: string;
  client: string;
  date: string;
  amount: string;
  status: TransactionStatus;
}

export interface DashboardOrder {
  id: string;
  customer: string;
  date: string;
  items: number;
  amount: string;
  status: string;
}

export interface DashboardLowStockItem {
  id: string;
  product: string;
  sku: string;
  stock: number;
  threshold: number;
}

export interface DashboardTopSoldItem {
  id: string;
  rank: number;
  product: string;
  sku: string;
  qty: number;
  amount: number;
}

export interface CashFlowSummary {
  receipts: number;
  payments: number;
}

export interface DashboardData {
  stats: DashboardStat[];
  revenueTrend: RevenueTrendPoint[];
  returnTrend: ReturnTrendPoint[];
  cashFlowTrend: CashFlowTrendPoint[];
  expenseTrend: ExpenseTrendPoint[];
  businessMix: DashboardCategoryItem[];
  salesByCategory: DashboardCategoryItem[];
  expenseByCategory: DashboardCategoryItem[];
  categoryBar: CategoryBarPoint[];
  expenseBar: CategoryBarPoint[];
  businessMixPie: PieChartItem[];
  salesByCategoryPie: PieChartItem[];
  expenseByCategoryPie: PieChartItem[];
  salesTypePie: PieChartItem[];
  paymentStatusPie: PieChartItem[];
  cashFlowPie: PieChartItem[];
  cashFlow: CashFlowSummary;
  salesByType: {
    items: SalesDistributionItem[];
    totalValue: string;
  };
  paymentStatus: {
    items: CategoryChartItem[];
    totalValue: string;
  };
  businessMixTotal: string;
  expenseTotal: string;
  cashFlowTotal: string;
  topSoldProducts: DashboardTopSoldItem[];
  recentSales: DashboardTransaction[];
  recentPurchases: DashboardOrder[];
  lowStock: DashboardLowStockItem[];
}

export const DASHBOARD_RANGES: { key: DashboardRange; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
  { key: "yearly", label: "Yearly" },
];
