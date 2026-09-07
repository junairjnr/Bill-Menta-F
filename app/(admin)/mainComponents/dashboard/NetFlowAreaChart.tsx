"use client";

import { memo, useId, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
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

interface NetTrendPoint {
  month: string;
  net: number;
}

interface NetFlowAreaChartProps {
  title: string;
  description?: string;
  points: NetTrendPoint[];
}

function NetFlowChartBody({
  chartData,
  gradientId,
  height,
}: {
  chartData: NetTrendPoint[];
  gradientId: string;
  height: number;
}) {
  return (
    <ChartContainer height={height}>
      <AreaChart data={chartData} margin={{ ...chartMargin, left: 4, bottom: 4 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CHART_COLORS.tertiary} stopOpacity={0.35} />
            <stop offset="100%" stopColor={CHART_COLORS.tertiary} stopOpacity={0.02} />
          </linearGradient>
        </defs>

        <CartesianGrid stroke={CHART_COLORS.grid} vertical={false} />
        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={axisTickStyle} dy={8} />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={axisTickStyle}
          tickFormatter={(v: number) => `${v}k`}
          width={40}
        />
        <ReferenceLine y={0} stroke={CHART_COLORS.grid} strokeDasharray="4 4" />
        <Tooltip
          formatter={(value) => [`₹${value}k`, "Net (Sales − Purchase)"]}
          {...tooltipStyle}
        />
        <Area
          type="monotone"
          dataKey="net"
          name="Net"
          stroke={CHART_COLORS.tertiary}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
        />
      </AreaChart>
    </ChartContainer>
  );
}

function NetFlowAreaChart({ title, description, points }: NetFlowAreaChartProps) {
  const [expanded, setExpanded] = useState(false);
  const gradientId = useId();
  const expandedGradientId = useId();
  const chartData = useMemo(() => points, [points]);

  return (
    <>
      <DashboardCard
        title={title}
        description={description}
        onExpand={() => setExpanded(true)}
        className="h-full"
      >
        <NetFlowChartBody chartData={chartData} gradientId={gradientId} height={260} />
      </DashboardCard>

      <ChartExpandDialog
        open={expanded}
        onOpenChange={setExpanded}
        title={title}
        description={description}
      >
        <NetFlowChartBody chartData={chartData} gradientId={expandedGradientId} height={420} />
      </ChartExpandDialog>
    </>
  );
}

export default memo(NetFlowAreaChart);
