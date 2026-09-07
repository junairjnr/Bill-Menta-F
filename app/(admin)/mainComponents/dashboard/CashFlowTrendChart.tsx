"use client";

import { memo, useId, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CHART_COLORS,
  axisTickStyle,
  chartMargin,
  tooltipStyle,
} from "@/lib/admin/chart-utils";
import ChartContainer from "./ChartContainer";
import { ChartExpandDialog } from "./ChartExpandDialog";
import DashboardCard from "./DashboardCard";

export interface CashFlowTrendPoint {
  month: string;
  receipts: number;
  payments: number;
}

function ChartBody({
  data,
  receiptsGradientId,
  paymentsGradientId,
  height,
}: {
  data: CashFlowTrendPoint[];
  receiptsGradientId: string;
  paymentsGradientId: string;
  height: number;
}) {
  if (!data.length) {
    return (
      <div
        className="flex items-center justify-center text-sm text-muted-foreground"
        style={{ height }}
      >
        No receipt or payment data yet
      </div>
    );
  }

  return (
    <ChartContainer height={height}>
      <AreaChart data={data} margin={{ ...chartMargin, left: 4, bottom: 4 }}>
        <defs>
          <linearGradient id={receiptsGradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CHART_COLORS.primary} stopOpacity={0.35} />
            <stop offset="100%" stopColor={CHART_COLORS.primary} stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id={paymentsGradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CHART_COLORS.quaternary} stopOpacity={0.3} />
            <stop offset="100%" stopColor={CHART_COLORS.quaternary} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={CHART_COLORS.grid} vertical={false} />
        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={axisTickStyle} dy={8} />
        <YAxis axisLine={false} tickLine={false} tick={axisTickStyle} tickFormatter={(v) => `${v}k`} width={36} />
        <Tooltip
          formatter={(value, name) => [
            `₹${value}k`,
            name === "receipts" ? "Receipts" : "Payments",
          ]}
          {...tooltipStyle}
        />
        <Legend />
        <Area type="monotone" dataKey="receipts" name="Receipts" stroke={CHART_COLORS.primary} strokeWidth={2} fill={`url(#${receiptsGradientId})`} />
        <Area type="monotone" dataKey="payments" name="Payments" stroke={CHART_COLORS.quaternary} strokeWidth={2} fill={`url(#${paymentsGradientId})`} />
      </AreaChart>
    </ChartContainer>
  );
}

function CashFlowTrendChart({
  title,
  description,
  points,
}: {
  title: string;
  description?: string;
  points: CashFlowTrendPoint[];
}) {
  const [expanded, setExpanded] = useState(false);
  const receiptsGradientId = useId();
  const paymentsGradientId = useId();
  const expandedReceiptsId = useId();
  const expandedPaymentsId = useId();
  const chartData = useMemo(() => points, [points]);

  return (
    <>
      <DashboardCard title={title} description={description} onExpand={() => setExpanded(true)} className="h-full">
        <ChartBody data={chartData} receiptsGradientId={receiptsGradientId} paymentsGradientId={paymentsGradientId} height={260} />
      </DashboardCard>
      <ChartExpandDialog open={expanded} onOpenChange={setExpanded} title={title} description={description}>
        <ChartBody data={chartData} receiptsGradientId={expandedReceiptsId} paymentsGradientId={expandedPaymentsId} height={420} />
      </ChartExpandDialog>
    </>
  );
}

export default memo(CashFlowTrendChart);
