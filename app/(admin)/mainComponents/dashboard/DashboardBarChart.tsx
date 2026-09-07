"use client";

import { memo, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
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

export interface BarSeriesConfig {
  dataKey: string;
  name: string;
  color: string;
  radius?: [number, number, number, number];
}

interface DashboardBarChartProps {
  title: string;
  description?: string;
  data: Record<string, string | number>[];
  xKey: string;
  series: BarSeriesConfig[];
  height?: number;
  yTickSuffix?: string;
  tooltipFormatter?: (value: number, name: string) => [string, string];
}

function BarChartBody({
  data,
  xKey,
  series,
  height,
  yTickSuffix = "k",
  tooltipFormatter,
}: Omit<DashboardBarChartProps, "title" | "description"> & { height: number }) {
  return (
    <ChartContainer height={height}>
      <BarChart data={data} margin={{ ...chartMargin, left: 4, bottom: 4 }}>
        <CartesianGrid stroke={CHART_COLORS.grid} vertical={false} />
        <XAxis
          dataKey={xKey}
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
          tickFormatter={(v: number) => `${v}${yTickSuffix}`}
          width={40}
        />
        <Tooltip
          formatter={(value, name) =>
            tooltipFormatter
              ? tooltipFormatter(Number(value), String(name))
              : [`${value}${yTickSuffix}`, name]
          }
          {...tooltipStyle}
        />
        <Legend />
        {series.map((item) => (
          <Bar
            key={item.dataKey}
            dataKey={item.dataKey}
            name={item.name}
            fill={item.color}
            radius={item.radius ?? [4, 4, 0, 0]}
            maxBarSize={48}
          />
        ))}
      </BarChart>
    </ChartContainer>
  );
}

function DashboardBarChart({
  title,
  description,
  data,
  xKey,
  series,
  height = 260,
  yTickSuffix,
  tooltipFormatter,
}: DashboardBarChartProps) {
  const [expanded, setExpanded] = useState(false);
  const chartData = useMemo(() => data, [data]);

  const bodyProps = {
    data: chartData,
    xKey,
    series,
    yTickSuffix,
    tooltipFormatter,
  };

  return (
    <>
      <DashboardCard
        title={title}
        description={description}
        onExpand={() => setExpanded(true)}
        className="h-full"
      >
        <BarChartBody {...bodyProps} height={height} />
      </DashboardCard>

      <ChartExpandDialog
        open={expanded}
        onOpenChange={setExpanded}
        title={title}
        description={description}
      >
        <BarChartBody {...bodyProps} height={420} />
      </ChartExpandDialog>
    </>
  );
}

export default memo(DashboardBarChart);
