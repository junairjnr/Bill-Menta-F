"use client";

import { memo, useMemo, useState } from "react";
import { Cell, Pie, PieChart, Tooltip } from "recharts";
import { tooltipStyle } from "@/lib/admin/chart-utils";
import { adminType } from "@/lib/admin/typography";
import ChartContainer from "./ChartContainer";
import { ChartExpandDialog } from "./ChartExpandDialog";
import DashboardCard from "./DashboardCard";

export interface PieChartItem {
  id: string;
  label: string;
  value: number;
  amount?: number;
  percent: number;
  color: string;
}

interface DashboardPieChartProps {
  title: string;
  description?: string;
  totalLabel: string;
  totalValue: string;
  items: PieChartItem[];
  valueFormatter?: (value: number, item: PieChartItem) => string;
}

function PieBody({
  pieData,
  totalLabel,
  totalValue,
  items,
  pieSize,
  innerRadius,
  outerRadius,
  paddingAngle,
  valueFormatter,
  layout = "compact",
}: {
  pieData: { name: string; value: number; color: string; item: PieChartItem }[];
  totalLabel: string;
  totalValue: string;
  items: PieChartItem[];
  pieSize: number;
  innerRadius: number;
  outerRadius: number;
  paddingAngle: number;
  valueFormatter?: (value: number, item: PieChartItem) => string;
  layout?: "compact" | "expanded";
}) {
  const isExpanded = layout === "expanded";

  if (!pieData.length) {
    return (
      <div
        className="flex items-center justify-center text-sm text-muted-foreground"
        style={{ height: pieSize }}
      >
        No data for this period
      </div>
    );
  }

  return (
    <div
      className={
        isExpanded
          ? "flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-center"
          : "flex flex-col items-center gap-5"
      }
    >
      <div className="relative shrink-0" style={{ width: pieSize, height: pieSize }}>
        <ChartContainer height={pieSize}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={paddingAngle}
              dataKey="value"
              stroke="#fff"
              strokeWidth={2}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, _name, payload) => {
                const item = payload?.payload?.item as PieChartItem | undefined;
                if (!item) return [String(value), ""];
                return [
                  valueFormatter?.(Number(value), item) ??
                    `${item.label}: ${item.percent}%`,
                  item.label,
                ];
              }}
              {...tooltipStyle}
            />
          </PieChart>
        </ChartContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-2 text-center">
          <span className={isExpanded ? "text-2xl font-bold text-gray-800" : adminType.emphasisTotal}>
            {totalValue}
          </span>
          <span className={`${adminType.badge} text-gray-500`}>{totalLabel}</span>
        </div>
      </div>

      <ul className={isExpanded ? "w-full max-w-md space-y-2.5 lg:flex-1" : "w-full space-y-2"}>
        {items.map((item) => (
          <li
            key={item.id}
            className={`flex items-center justify-between gap-3 rounded-lg border border-border/60 px-3 py-2 ${adminType.badge}`}
          >
            <span className="flex min-w-0 items-center gap-2 text-gray-600">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="truncate">{item.label}</span>
            </span>
            <span className="shrink-0 font-semibold text-gray-800">{item.percent}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DashboardPieChart({
  title,
  description,
  totalLabel,
  totalValue,
  items,
  valueFormatter,
}: DashboardPieChartProps) {
  const [expanded, setExpanded] = useState(false);

  const activeItems = useMemo(
    () => items.filter((item) => item.value > 0 || item.percent > 0),
    [items]
  );

  const pieData = useMemo(
    () =>
      activeItems.map((item) => ({
        name: item.label,
        value: item.value,
        color: item.color,
        item,
      })),
    [activeItems]
  );

  const bodyProps = {
    pieData,
    totalLabel,
    totalValue,
    items: activeItems,
    paddingAngle: 4,
    valueFormatter,
  };

  return (
    <>
      <DashboardCard title={title} description={description} onExpand={() => setExpanded(true)} className="h-full">
        <PieBody {...bodyProps} pieSize={190} innerRadius={62} outerRadius={82} layout="compact" />
      </DashboardCard>
      <ChartExpandDialog open={expanded} onOpenChange={setExpanded} title={title} description={description}>
        <PieBody {...bodyProps} pieSize={280} innerRadius={90} outerRadius={118} paddingAngle={5} layout="expanded" />
      </ChartExpandDialog>
    </>
  );
}

export default memo(DashboardPieChart);
