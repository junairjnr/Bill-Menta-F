"use client";

import { Suspense, useMemo } from "react";
import { lazyClient } from "@/lib/lazy";
import { CHART_COLORS } from "@/lib/admin/chart-utils";
import { useDashboard } from "@/app/hooks/dashboardHook/useDashboard";
import type { PieChartItem } from "@/app/types/dashboard";
import StatCard from "./StatCard";
import RecentTransactionsTable from "./RecentTransactionsTable";
import RecentOrdersTable from "./RecentOrdersTable";
import LowStockTable from "./LowStockTable";
import TopSoldProductsTable from "./TopSoldProductsTable";
import DashboardSkeleton from "./DashboardSkeleton";

const RevenueTrendChart = lazyClient(() => import("./RevenueTrendChart"), { ssr: false });
const ReturnTrendChart = lazyClient(() => import("./ReturnTrendChart"), { ssr: false });
const CashFlowTrendChart = lazyClient(() => import("./CashFlowTrendChart"), { ssr: false });
const DashboardPieChart = lazyClient(() => import("./DashboardPieChart"), { ssr: false });
const DashboardBarChart = lazyClient(() => import("./DashboardBarChart"), { ssr: false });

function ChartFallback() {
  return <div className="h-[260px] animate-pulse rounded-lg bg-muted" />;
}

const currencyPieTooltip = (value: number, item: PieChartItem) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(item.amount ?? value);

const countPieTooltip = (_value: number, item: PieChartItem) =>
  `${item.label}: ${item.amount ?? item.value} invoices (${item.percent}%)`;

export default function AdminDashboard() {
  const { data, isLoading, isError, error } = useDashboard();

  const categoryBarSeries = useMemo(
    () => [
      {
        dataKey: "amount",
        name: "Sales",
        color: CHART_COLORS.primary,
        radius: [4, 4, 0, 0] as [number, number, number, number],
      },
    ],
    []
  );

  const expenseBarSeries = useMemo(
    () => [
      {
        dataKey: "amount",
        name: "Expenses",
        color: CHART_COLORS.tertiary,
        radius: [4, 4, 0, 0] as [number, number, number, number],
      },
    ],
    []
  );

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !data) {
    const message =
      (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
      "Failed to load dashboard data.";
    return (
      <div className="flex min-h-[320px] items-center justify-center p-6">
        <p className="text-sm text-red-500">{message}</p>
      </div>
    );
  }

  const hasRevenueTrend = data.revenueTrend.length > 0;
  const hasReturnTrend = data.returnTrend.length > 0;
  const hasCashFlowTrend = data.cashFlowTrend.length > 0;
  const hasCategoryBar = data.categoryBar.length > 0;
  const hasExpenseBar = data.expenseBar.length > 0;
  const hasExpenseTrend = data.expenseTrend.length > 0;

  return (
    <div className="p-4 md:p-6">
      <div className="mx-auto max-w-[1400px] space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Sales, purchase, returns, receipts, payments and expenses for the current financial year
            </p>
          </div>
        </div>

        <section className="grid grid-cols-2 gap-4 sm:max-w-md">
          {data.stats
            .filter((stat) => stat.id === "products" || stat.id === "customers")
            .map((stat) => (
              <div key={stat.id}>
                <StatCard stat={stat} />
              </div>
            ))}
        </section>

        <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
          {data.stats
            .filter((stat) => stat.id !== "products" && stat.id !== "customers")
            .map((stat) => (
              <div key={stat.id}>
                <StatCard stat={stat} />
              </div>
            ))}
        </section>

        {/* Sales vs Purchase trend + Business mix pie */}
        <section className="grid grid-cols-12 items-stretch gap-4">
          <div className="col-span-12 lg:col-span-8">
            <Suspense fallback={<ChartFallback />}>
              {hasRevenueTrend ? (
                <RevenueTrendChart
                  title="Sales vs Purchase Trend"
                  description="Monthly comparison — amounts in ₹ thousands"
                  points={data.revenueTrend}
                />
              ) : (
                <div className="flex h-[260px] items-center justify-center rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
                  No sales or purchase data for this financial year yet.
                </div>
              )}
            </Suspense>
          </div>
          <div className="col-span-12 lg:col-span-4">
            <Suspense fallback={<ChartFallback />}>
              <DashboardPieChart
                title="Business Mix"
                description="Sales, purchase and returns share"
                totalLabel="Total Volume"
                totalValue={data.businessMixTotal}
                items={data.businessMixPie}
                valueFormatter={currencyPieTooltip}
              />
            </Suspense>
          </div>
        </section>

        {/* Sales return vs Purchase return trend */}
        <section className="grid grid-cols-12 items-stretch gap-4">
          <div className="col-span-12">
            <Suspense fallback={<ChartFallback />}>
              {hasReturnTrend ? (
                <ReturnTrendChart
                  title="Sales Return vs Purchase Return"
                  description="Monthly return amounts in ₹ thousands"
                  points={data.returnTrend}
                />
              ) : (
                <div className="flex h-[280px] items-center justify-center rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
                  No sales or purchase return data for this financial year yet.
                </div>
              )}
            </Suspense>
          </div>
        </section>

        {/* Cash flow area + Sales by product category bar */}
        <section className="grid grid-cols-12 items-stretch gap-4">
          <div className="col-span-12 lg:col-span-6">
            <Suspense fallback={<ChartFallback />}>
              {hasCashFlowTrend ? (
                <CashFlowTrendChart
                  title="Receipts vs Payments Trend"
                  description="Monthly cash movement in ₹ thousands"
                  points={data.cashFlowTrend}
                />
              ) : (
                <div className="flex h-[260px] items-center justify-center rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
                  No receipt or payment vouchers yet.
                </div>
              )}
            </Suspense>
          </div>
          <div className="col-span-12 lg:col-span-6">
            <Suspense fallback={<ChartFallback />}>
              {hasCategoryBar ? (
                <DashboardBarChart
                  title="Sales by Product Category"
                  description="Top categories by sales amount in ₹ thousands"
                  data={data.categoryBar}
                  xKey="label"
                  series={categoryBarSeries}
                  tooltipFormatter={(value: number) => [`₹${value}k`, "Sales"]}
                />
              ) : (
                <div className="flex h-[260px] items-center justify-center rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
                  No category-wise sales data yet.
                </div>
              )}
            </Suspense>
          </div>
        </section>

        {/* Expense trend + expense by category */}
        <section className="grid grid-cols-12 items-stretch gap-4">
          <div className="col-span-12 lg:col-span-6">
            <Suspense fallback={<ChartFallback />}>
              {hasExpenseTrend ? (
                <DashboardBarChart
                  title="Expense Trend"
                  description="Monthly expenses in ₹ thousands"
                  data={data.expenseTrend}
                  xKey="month"
                  series={expenseBarSeries}
                  tooltipFormatter={(value: number) => [`₹${value}k`, "Expenses"]}
                />
              ) : (
                <div className="flex h-[260px] items-center justify-center rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
                  No expense data yet.
                </div>
              )}
            </Suspense>
          </div>
          <div className="col-span-12 lg:col-span-6">
            <Suspense fallback={<ChartFallback />}>
              {hasExpenseBar ? (
                <DashboardBarChart
                  title="Expenses by Category"
                  description="Top expense categories in ₹ thousands"
                  data={data.expenseBar}
                  xKey="label"
                  series={expenseBarSeries}
                  tooltipFormatter={(value: number) => [`₹${value}k`, "Expenses"]}
                />
              ) : (
                <div className="flex h-[260px] items-center justify-center rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
                  No category-wise expense data yet.
                </div>
              )}
            </Suspense>
          </div>
        </section>

        {/* Category pies: sales type, payment status, cash flow, expenses */}
        <section className="grid grid-cols-12 items-stretch gap-4">
          <div className="col-span-12 md:col-span-6 xl:col-span-3">
            <Suspense fallback={<ChartFallback />}>
              <DashboardPieChart
                title="Sales by Type"
                description="Retail vs wholesale split"
                totalLabel="Total Sales"
                totalValue={data.salesByType.totalValue}
                items={data.salesTypePie}
                valueFormatter={currencyPieTooltip}
              />
            </Suspense>
          </div>
          <div className="col-span-12 md:col-span-6 xl:col-span-3">
            <Suspense fallback={<ChartFallback />}>
              <DashboardPieChart
                title="Payment Status"
                description="Sales invoice payment breakdown"
                totalLabel="Invoices"
                totalValue={data.paymentStatus.totalValue}
                items={data.paymentStatusPie}
                valueFormatter={countPieTooltip}
              />
            </Suspense>
          </div>
          <div className="col-span-12 md:col-span-6 xl:col-span-3">
            <Suspense fallback={<ChartFallback />}>
              <DashboardPieChart
                title="Cash Flow Share"
                description="Receipts vs payments for the year"
                totalLabel="Total Movement"
                totalValue={data.cashFlowTotal}
                items={data.cashFlowPie}
                valueFormatter={currencyPieTooltip}
              />
            </Suspense>
          </div>
          <div className="col-span-12 md:col-span-6 xl:col-span-3">
            <Suspense fallback={<ChartFallback />}>
              <DashboardPieChart
                title="Expenses by Category"
                description="Share of total expenses"
                totalLabel="Total Expenses"
                totalValue={data.expenseTotal}
                items={data.expenseByCategoryPie}
                valueFormatter={currencyPieTooltip}
              />
            </Suspense>
          </div>
        </section>

        <section className="grid grid-cols-12 gap-4">
          <div className="col-span-12">
            <RecentTransactionsTable
              title="Recent Sales Invoices"
              viewAllLabel="View all"
              viewAllHref="/sales/salesInvoice"
              columns={[
                { key: "id", label: "Invoice" },
                { key: "client", label: "Customer" },
                { key: "date", label: "Date" },
                { key: "amount", label: "Amount" },
                { key: "status", label: "Status" },
              ]}
              rows={data.recentSales}
            />
          </div>
        </section>

        <section className="grid grid-cols-12 gap-4">
          <div className="col-span-12">
            <RecentOrdersTable
              title="Recent Purchase Invoices"
              viewAllLabel="View all"
              viewAllHref="/purchase/purchaseInvoice"
              columns={[
                { key: "id", label: "Invoice" },
                { key: "customer", label: "Vendor" },
                { key: "date", label: "Date" },
                { key: "items", label: "Items" },
                { key: "amount", label: "Amount" },
                { key: "status", label: "Status" },
              ]}
              rows={data.recentPurchases}
            />
          </div>
        </section>

        <section className="grid grid-cols-12 gap-4">
          <div className="col-span-12">
            <TopSoldProductsTable
              title="Most Sold Products"
              viewAllLabel="Sales history"
              viewAllHref="/reports/salesHistory"
              rows={data.topSoldProducts ?? []}
            />
          </div>
        </section>

        <section className="grid grid-cols-12 gap-4">
          <div className="col-span-12">
            <LowStockTable
              title="Low Stock Items"
              viewAllLabel="Stock report"
              viewAllHref="/reports/stockReport"
              columns={[
                { key: "product", label: "Product" },
                { key: "sku", label: "SKU" },
                { key: "stock", label: "Stock" },
                { key: "threshold", label: "Threshold" },
              ]}
              rows={data.lowStock}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
