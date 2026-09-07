"use client";

import { memo, useMemo, useState } from "react";
import { Cell, Pie, PieChart, Tooltip } from "recharts";
import type { CashFlowSummary } from "@/app/types/dashboard";
import { PIE_PALETTE, tooltipStyle } from "@/lib/admin/chart-utils";
import { adminType } from "@/lib/admin/typography";
import ChartContainer from "./ChartContainer";
import { ChartExpandDialog } from "./ChartExpandDialog";
import DashboardCard from "./DashboardCard";

interface CashFlowPieChartProps {
  title: string;
  description?: string;
  cashFlow: CashFlowSummary;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

function CashFlowPieBody({
  pieData,
  totalValue,
  items,
  pieSize,
  innerRadius,
  outerRadius,
  layout = "compact",
}: {
  pieData: { name: string; value: number; color: string }[];
  totalValue: string;
  items: { label: string; value: number; color: string; percent: number }[];
  pieSize: number;
  innerRadius: number;
  outerRadius: number;
  layout?: "compact" | "expanded";
}) {
  const isExpanded = layout === "expanded";

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
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [formatCurrency(Number(value)), ""]}
              {...tooltipStyle}
            />
          </PieChart>
        </ChartContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-2 text-center">
          <span className={isExpanded ? "text-2xl font-bold text-gray-800" : adminType.emphasisTotal}>
            {totalValue}
          </span>
          <span className={`${adminType.badge} text-gray-500`}>Total Flow</span>
        </div>
      </div>

      <ul className={isExpanded ? "w-full max-w-sm space-y-3 lg:flex-1" : "w-full space-y-2.5"}>
        {items.map((item) => (
          <li
            key={item.label}
            className={`flex items-center justify-between ${adminType.badge} ${isExpanded ? "text-sm" : ""}`}
          >
            <span className="flex items-center gap-2 text-gray-600">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              {item.label}
            </span>
            <span className="font-semibold text-gray-800">
              {formatCurrency(item.value)} ({item.percent}%)
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CashFlowPieChart({ title, description, cashFlow }: CashFlowPieChartProps) {
  const [expanded, setExpanded] = useState(false);

  const total = cashFlow.receipts + cashFlow.payments || 1;
  const items = useMemo(
    () => [
      {
        label: "Receipts",
        value: cashFlow.receipts,
        color: PIE_PALETTE[0],
        percent: Number(((cashFlow.receipts / total) * 100).toFixed(1)),
      },
      {
        label: "Payments",
        value: cashFlow.payments,
        color: PIE_PALETTE[7],
        percent: Number(((cashFlow.payments / total) * 100).toFixed(1)),
      },
    ],
    [cashFlow, total]
  );

  const pieData = useMemo(
    () =>
      items
        .filter((item) => item.value > 0)
        .map((item) => ({ name: item.label, value: item.value, color: item.color })),
    [items]
  );

  const totalValue = formatCurrency(cashFlow.receipts + cashFlow.payments);
  const bodyProps = { pieData, totalValue, items };

  return (
    <>
      <DashboardCard
        title={title}
        description={description}
        onExpand={() => setExpanded(true)}
        className="h-full"
      >
        <CashFlowPieBody
          {...bodyProps}
          pieSize={180}
          innerRadius={58}
          outerRadius={78}
          layout="compact"
        />
      </DashboardCard>

      <ChartExpandDialog open={expanded} onOpenChange={setExpanded} title={title} description={description}>
        <CashFlowPieBody
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

export default memo(CashFlowPieChart);
