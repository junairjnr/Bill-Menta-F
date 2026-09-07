import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/app/services/dashboard/dashboard.service";
import { DashboardData } from "@/app/types/dashboard";
import { PIE_PALETTE } from "@/lib/admin/chart-utils";
import { expenseCategoryLabel } from "@/app/utilsComponents/expenseConstants";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const mapPaymentStatus = (status: string): "completed" | "pending" | "failed" => {
  if (status === "paid") return "completed";
  if (status === "partial") return "pending";
  return "pending";
};

const mapPieItems = (
  rows: { id: string; label: string; amount: number; percent: number }[],
  useCount = false
) =>
  rows.map((row, index) => ({
    id: row.id,
    label: row.label,
    value: useCount ? row.amount : row.percent,
    amount: row.amount,
    percent: row.percent,
    color: PIE_PALETTE[index % PIE_PALETTE.length],
  }));

const mapApiToDashboard = (
  api: Awaited<ReturnType<typeof dashboardService.getDashboard>>
): DashboardData => {
  const businessTotal = (api?.businessMix ?? []).reduce((sum, row) => sum + row.amount, 0);
  const categoryBar = (api?.salesByCategory ?? []).map((row) => ({
    label: row.label.length > 14 ? `${row.label.slice(0, 14)}…` : row.label,
    amount: Number((row.amount / 1000).toFixed(2)),
  }));
  const expenseBar = (api?.expenseByCategory ?? []).map((row) => ({
    label: expenseCategoryLabel(row.label).length > 14
      ? `${expenseCategoryLabel(row.label).slice(0, 14)}…`
      : expenseCategoryLabel(row.label),
    amount: Number((row.amount / 1000).toFixed(2)),
  }));
  const expenseTotal = api?.stats?.expensesTotal ?? 0;

  return {
    stats: [
      { id: "products", label: "Total Products", value: String(api?.stats?.productCount ?? 0) },
      { id: "customers", label: "Total Customers", value: String(api?.stats?.customerCount ?? 0) },
      { id: "sales", label: "Sales", value: formatCurrency(api?.stats?.salesTotal ?? 0) },
      { id: "purchase", label: "Purchase", value: formatCurrency(api?.stats?.purchaseTotal ?? 0) },
      { id: "sales_return", label: "Sales Return", value: formatCurrency(api?.stats?.salesReturnTotal ?? 0) },
      { id: "purchase_return", label: "Purchase Return", value: formatCurrency(api?.stats?.purchaseReturnTotal ?? 0) },
      { id: "receipts", label: "Receipts", value: formatCurrency(api?.stats?.receiptsTotal ?? 0) },
      { id: "payments", label: "Payments", value: formatCurrency(api?.stats?.paymentsTotal ?? 0) },
      { id: "expenses", label: "Expenses", value: formatCurrency(expenseTotal) },
    ],
    revenueTrend: api?.revenueTrend ?? [],
    returnTrend: api?.returnTrend ?? [],
    cashFlowTrend: api?.cashFlowTrend ?? [],
    expenseTrend: api?.expenseTrend ?? [],
    businessMix: api?.businessMix ?? [],
    salesByCategory: api?.salesByCategory ?? [],
    expenseByCategory: api?.expenseByCategory ?? [],
    categoryBar,
    expenseBar,
    businessMixPie: mapPieItems(api?.businessMix ?? []),
    salesByCategoryPie: mapPieItems(api?.salesByCategory ?? []),
    expenseByCategoryPie: mapPieItems(
      (api?.expenseByCategory ?? []).map((row) => ({
        ...row,
        label: expenseCategoryLabel(row.label),
      }))
    ),
    cashFlow: {
      receipts: api?.stats?.receiptsTotal ?? 0,
      payments: api?.stats?.paymentsTotal ?? 0,
    },
    salesByType: {
      totalValue: formatCurrency(api?.salesByType?.total ?? 0),
      items: [
        {
          id: "retail",
          label: "Retail",
          amount: api?.salesByType?.retail ?? 0,
          percent: api?.salesByType?.retailPercent ?? 0,
          color: PIE_PALETTE[0],
        },
        {
          id: "wholesale",
          label: "Wholesale",
          amount: api?.salesByType?.wholesale ?? 0,
          percent: api?.salesByType?.wholesalePercent ?? 0,
          color: PIE_PALETTE[1],
        },
      ],
    },
    salesTypePie: mapPieItems([
      {
        id: "retail",
        label: "Retail",
        amount: api?.salesByType?.retail ?? 0,
        percent: api?.salesByType?.retailPercent ?? 0,
      },
      {
        id: "wholesale",
        label: "Wholesale",
        amount: api?.salesByType?.wholesale ?? 0,
        percent: api?.salesByType?.wholesalePercent ?? 0,
      },
    ].filter((row) => row.amount > 0)),
    paymentStatus: {
      totalValue: String(api?.paymentStatus?.total ?? 0),
      items: [
        { id: "paid", label: "Paid", value: api?.paymentStatus?.paid ?? 0, color: PIE_PALETTE[0] },
        { id: "partial", label: "Partial", value: api?.paymentStatus?.partial ?? 0, color: PIE_PALETTE[3] },
        { id: "pending", label: "Pending", value: api?.paymentStatus?.pending ?? 0, color: PIE_PALETTE[7] },
      ],
    },
    paymentStatusPie: mapPieItems(
      [
        { id: "paid", label: "Paid", amount: api?.paymentStatus?.paid ?? 0, percent: 0 },
        { id: "partial", label: "Partial", amount: api?.paymentStatus?.partial ?? 0, percent: 0 },
        { id: "pending", label: "Pending", amount: api?.paymentStatus?.pending ?? 0, percent: 0 },
      ]
        .filter((row) => row.amount > 0)
        .map((row) => {
          const total = api?.paymentStatus?.total || 1;
          return { ...row, percent: Number(((row.amount / total) * 100).toFixed(1)) };
        }),
      true
    ),
    cashFlowPie: mapPieItems(
      [
        { id: "receipts", label: "Receipts", amount: api?.stats?.receiptsTotal ?? 0, percent: 0 },
        { id: "payments", label: "Payments", amount: api?.stats?.paymentsTotal ?? 0, percent: 0 },
      ]
        .filter((row) => row.amount > 0)
        .map((row) => {
          const total = (api?.stats?.receiptsTotal ?? 0) + (api?.stats?.paymentsTotal ?? 0) || 1;
          return { ...row, percent: Number(((row.amount / total) * 100).toFixed(1)) };
        })
    ),
    topSoldProducts: api?.topSoldProducts ?? [],
    recentSales: (api?.recentSales ?? []).map((row) => ({
      id: row.invoiceNo,
      client: row.customer,
      date: formatDate(row.date),
      amount: formatCurrency(row.amount),
      status: mapPaymentStatus(row.paymentStatus),
    })),
    recentPurchases: (api?.recentPurchases ?? []).map((row) => ({
      id: row.invoiceNo,
      customer: row.vendor,
      date: formatDate(row.date),
      items: row.items,
      amount: formatCurrency(row.amount),
      status: row.status,
    })),
    lowStock: api?.lowStock ?? [],
    businessMixTotal: formatCurrency(businessTotal),
    expenseTotal: formatCurrency(expenseTotal),
    cashFlowTotal: formatCurrency((api?.stats?.receiptsTotal ?? 0) + (api?.stats?.paymentsTotal ?? 0)),
  };
};

export const useDashboard = () =>
  useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => mapApiToDashboard(await dashboardService.getDashboard()),
  });
