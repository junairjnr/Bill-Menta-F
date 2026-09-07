"use client";

import { memo, useId, useMemo, useState } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { RevenueTrendPoint } from "@/app/types/dashboard";
import {
  CHART_COLORS,
  axisTickStyle,
  chartMargin,
  tooltipStyle,
} from "@/lib/admin/chart-utils";
import ChartContainer from "./ChartContainer";
import { ChartExpandDialog } from "./ChartExpandDialog";
import DashboardCard from "./DashboardCard";

interface RevenueTrendChartProps {
  title: string;
  description: string;
  points: RevenueTrendPoint[];
}

const seriesDot = (color: string) => ({
  r: 3,
  fill: color,
  stroke: "#fff",
  strokeWidth: 1.5,
});

const seriesActiveDot = (color: string) => ({
  r: 5,
  fill: color,
  stroke: "#fff",
  strokeWidth: 2,
});

function RevenueChartBody({
  chartData,
  salesGradientId,
  purchaseGradientId,
  height,
}: {
  chartData: RevenueTrendPoint[];
  salesGradientId: string;
  purchaseGradientId: string;
  height: number;
}) {
  if (!chartData.length) {
    return (
      <div
        className="flex items-center justify-center text-sm text-muted-foreground"
        style={{ height }}
      >
        No sales or purchase data yet
      </div>
    );
  }

  return (
    <ChartContainer height={height}>
      <ComposedChart data={chartData} margin={{ ...chartMargin, left: 8, bottom: 4, right: 12 }}>
        <defs>
          <linearGradient id={salesGradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CHART_COLORS.primary} stopOpacity={0.4} />
            <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0.03} />
          </linearGradient>
          <linearGradient id={purchaseGradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CHART_COLORS.secondary} stopOpacity={0.28} />
            <stop offset="95%" stopColor={CHART_COLORS.secondary} stopOpacity={0.02} />
          </linearGradient>
        </defs>

        <CartesianGrid stroke={CHART_COLORS.grid} vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={axisTickStyle}
          dy={8}
          interval="preserveStartEnd"
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={axisTickStyle}
          tickFormatter={(v: number) => `${v}k`}
          width={42}
          domain={[0, "auto"]}
        />
        <Tooltip
          formatter={(value, name) => [
            `₹${Number(value).toLocaleString("en-IN")}k`,
            name === "sales" ? "Sales" : "Purchase",
          ]}
          labelFormatter={(label) => `Month: ${label}`}
          {...tooltipStyle}
        />
        <Legend
          verticalAlign="top"
          align="right"
          iconType="plainline"
          wrapperStyle={{ fontSize: 12, paddingBottom: 8 }}
        />

        {/* Sales — area fill + line stroke */}
        <Area
          type="monotone"
          dataKey="sales"
          name="Sales"
          stroke="none"
          fill={`url(#${salesGradientId})`}
          fillOpacity={1}
          connectNulls
          isAnimationActive={false}
        />
        <Line
          type="monotone"
          dataKey="sales"
          name="Sales"
          stroke={CHART_COLORS.primary}
          strokeWidth={2.5}
          dot={seriesDot(CHART_COLORS.primary)}
          activeDot={seriesActiveDot(CHART_COLORS.primary)}
          connectNulls
          legendType="none"
          isAnimationActive={false}
        />

        {/* Purchase — area fill + line stroke */}
        <Area
          type="monotone"
          dataKey="purchase"
          name="Purchase"
          stroke="none"
          fill={`url(#${purchaseGradientId})`}
          fillOpacity={1}
          connectNulls
          isAnimationActive={false}
        />
        <Line
          type="monotone"
          dataKey="purchase"
          name="Purchase"
          stroke={CHART_COLORS.secondary}
          strokeWidth={2.5}
          dot={seriesDot(CHART_COLORS.secondary)}
          activeDot={seriesActiveDot(CHART_COLORS.secondary)}
          connectNulls
          legendType="none"
          isAnimationActive={false}
        />
      </ComposedChart>
    </ChartContainer>
  );
}

function RevenueTrendChart({ title, description, points }: RevenueTrendChartProps) {
  const [expanded, setExpanded] = useState(false);
  const salesGradientId = useId();
  const purchaseGradientId = useId();
  const expandedSalesGradientId = useId();
  const expandedPurchaseGradientId = useId();

  const chartData = useMemo(() => points, [points]);

  return (
    <>
      <DashboardCard
        title={title}
        description={description}
        onExpand={() => setExpanded(true)}
        className="h-full"
      >
        <RevenueChartBody
          chartData={chartData}
          salesGradientId={salesGradientId}
          purchaseGradientId={purchaseGradientId}
          height={280}
        />
      </DashboardCard>

      <ChartExpandDialog open={expanded} onOpenChange={setExpanded} title={title} description={description}>
        <RevenueChartBody
          chartData={chartData}
          salesGradientId={expandedSalesGradientId}
          purchaseGradientId={expandedPurchaseGradientId}
          height={440}
        />
      </ChartExpandDialog>
    </>
  );
}

export default memo(RevenueTrendChart);
