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
import type { ReturnTrendPoint } from "@/app/types/dashboard";
import {
  axisTickStyle,
  chartMargin,
  tooltipStyle,
} from "@/lib/admin/chart-utils";
import ChartContainer from "./ChartContainer";
import { ChartExpandDialog } from "./ChartExpandDialog";
import DashboardCard from "./DashboardCard";

const SALES_RETURN_COLOR = "#F59E0B";
const PURCHASE_RETURN_COLOR = "#EF4444";

interface ReturnTrendChartProps {
  title: string;
  description: string;
  points: ReturnTrendPoint[];
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

function ReturnChartBody({
  chartData,
  salesReturnGradientId,
  purchaseReturnGradientId,
  height,
}: {
  chartData: ReturnTrendPoint[];
  salesReturnGradientId: string;
  purchaseReturnGradientId: string;
  height: number;
}) {
  if (!chartData.length) {
    return (
      <div
        className="flex items-center justify-center text-sm text-muted-foreground"
        style={{ height }}
      >
        No return data yet
      </div>
    );
  }

  return (
    <ChartContainer height={height}>
      <ComposedChart data={chartData} margin={{ ...chartMargin, left: 8, bottom: 4, right: 12 }}>
        <defs>
          <linearGradient id={salesReturnGradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={SALES_RETURN_COLOR} stopOpacity={0.4} />
            <stop offset="95%" stopColor={SALES_RETURN_COLOR} stopOpacity={0.03} />
          </linearGradient>
          <linearGradient id={purchaseReturnGradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={PURCHASE_RETURN_COLOR} stopOpacity={0.32} />
            <stop offset="95%" stopColor={PURCHASE_RETURN_COLOR} stopOpacity={0.02} />
          </linearGradient>
        </defs>

        <CartesianGrid stroke="#E5E7EB" vertical={false} strokeDasharray="3 3" />
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
            name === "salesReturn" ? "Sales Return" : "Purchase Return",
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

        <Area
          type="monotone"
          dataKey="salesReturn"
          name="Sales Return"
          stroke="none"
          fill={`url(#${salesReturnGradientId})`}
          connectNulls
          isAnimationActive={false}
        />
        <Line
          type="monotone"
          dataKey="salesReturn"
          stroke={SALES_RETURN_COLOR}
          strokeWidth={2.5}
          dot={seriesDot(SALES_RETURN_COLOR)}
          activeDot={seriesActiveDot(SALES_RETURN_COLOR)}
          connectNulls
          legendType="none"
          isAnimationActive={false}
        />

        <Area
          type="monotone"
          dataKey="purchaseReturn"
          name="Purchase Return"
          stroke="none"
          fill={`url(#${purchaseReturnGradientId})`}
          connectNulls
          isAnimationActive={false}
        />
        <Line
          type="monotone"
          dataKey="purchaseReturn"
          stroke={PURCHASE_RETURN_COLOR}
          strokeWidth={2.5}
          dot={seriesDot(PURCHASE_RETURN_COLOR)}
          activeDot={seriesActiveDot(PURCHASE_RETURN_COLOR)}
          connectNulls
          legendType="none"
          isAnimationActive={false}
        />
      </ComposedChart>
    </ChartContainer>
  );
}

function ReturnTrendChart({ title, description, points }: ReturnTrendChartProps) {
  const [expanded, setExpanded] = useState(false);
  const salesReturnGradientId = useId();
  const purchaseReturnGradientId = useId();
  const expandedSalesReturnGradientId = useId();
  const expandedPurchaseReturnGradientId = useId();
  const chartData = useMemo(() => points, [points]);

  return (
    <>
      <DashboardCard
        title={title}
        description={description}
        onExpand={() => setExpanded(true)}
        className="h-full"
      >
        <ReturnChartBody
          chartData={chartData}
          salesReturnGradientId={salesReturnGradientId}
          purchaseReturnGradientId={purchaseReturnGradientId}
          height={280}
        />
      </DashboardCard>

      <ChartExpandDialog open={expanded} onOpenChange={setExpanded} title={title} description={description}>
        <ReturnChartBody
          chartData={chartData}
          salesReturnGradientId={expandedSalesReturnGradientId}
          purchaseReturnGradientId={expandedPurchaseReturnGradientId}
          height={440}
        />
      </ChartExpandDialog>
    </>
  );
}

export default memo(ReturnTrendChart);
