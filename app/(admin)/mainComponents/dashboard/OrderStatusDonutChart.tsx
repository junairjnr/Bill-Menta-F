"use client";

import { memo, useMemo, useState } from "react";
import { Cell, Pie, PieChart, Tooltip } from "recharts";
import type { CategoryChartItem } from "@/app/types/dashboard";
import { tooltipStyle } from "@/lib/admin/chart-utils";
import { adminType } from "@/lib/admin/typography";
import ChartContainer from "./ChartContainer";
import { ChartExpandDialog } from "./ChartExpandDialog";
import DashboardCard from "./DashboardCard";

interface OrderStatusDonutChartProps {
  title: string;
  totalLabel: string;
  totalValue: string;
  items: CategoryChartItem[];
}

interface OrderStatusDonutBodyProps {
  pieData: { name: string; value: number; color: string }[];
  totalLabel: string;
  totalValue: string;
  items: CategoryChartItem[];
  pieSize: number;
  innerRadius: number;
  outerRadius: number;
  layout?: "compact" | "expanded";
}

function OrderStatusDonutBody({
  pieData,
  totalLabel,
  totalValue,
  items,
  pieSize,
  innerRadius,
  outerRadius,
  layout = "compact",
}: OrderStatusDonutBodyProps) {
  const isExpanded = layout === "expanded";

  return (
    <div
      className={
        isExpanded
          ? "flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-center"
          : "flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between"
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
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, _name, item) => [String(value), item.payload?.name ?? ""]}
              {...tooltipStyle}
            />
          </PieChart>
        </ChartContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className={isExpanded ? "text-3xl font-bold text-gray-800" : "text-xl font-bold text-gray-800"}>
            {totalValue}
          </span>
          <span className={`${adminType.badge} text-gray-500`}>{totalLabel}</span>
        </div>
      </div>

      <ul
        className={
          isExpanded
            ? "w-full max-w-md space-y-3 lg:flex-1"
            : "w-full min-w-[140px] flex-1 space-y-3 sm:max-w-[220px]"
        }
      >
        {items.map((item) => (
          <li
            key={item.id}
            className={`flex items-center justify-between gap-3 rounded-lg border border-border/60 px-3 py-2.5 ${adminType.badge}`}
          >
            <span className="flex min-w-0 items-center gap-2 text-gray-600">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="truncate">{item.label}</span>
            </span>
            <span className="shrink-0 font-semibold text-gray-800">{item.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function OrderStatusDonutChart({
  title,
  totalLabel,
  totalValue,
  items,
}: OrderStatusDonutChartProps) {
  const [expanded, setExpanded] = useState(false);

  const pieData = useMemo(
    () => items.map((item) => ({ name: item.label, value: item.value, color: item.color })),
    [items]
  );

  const bodyProps = { pieData, totalLabel, totalValue, items };

  return (
    <>
      <DashboardCard title={title} onExpand={() => setExpanded(true)} className="h-full">
        <OrderStatusDonutBody
          {...bodyProps}
          pieSize={160}
          innerRadius={48}
          outerRadius={68}
          layout="compact"
        />
      </DashboardCard>

      <ChartExpandDialog open={expanded} onOpenChange={setExpanded} title={title}>
        <OrderStatusDonutBody
          {...bodyProps}
          pieSize={280}
          innerRadius={88}
          outerRadius={120}
          layout="expanded"
        />
      </ChartExpandDialog>
    </>
  );
}

export default memo(OrderStatusDonutChart);
