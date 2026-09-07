"use client";

import { memo } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { DashboardStat } from "@/app/types/dashboard";
import { adminType } from "@/lib/admin/typography";
import { formatTrend } from "@/lib/admin/chart-utils";

interface StatCardProps {
  stat: DashboardStat;
}

function StatCard({ stat }: StatCardProps) {
  const isUp = stat.trend?.direction === "up";
  const trendColor = isUp ? "text-emerald-600" : "text-red-500";
  const TrendIcon = isUp ? ArrowUpRight : ArrowDownRight;

  return (
    <article className="flex h-full flex-col rounded-xl border border-border bg-card p-5 shadow-sm">
      <p className={`mb-3 ${adminType.label}`}>{stat.label}</p>
      <p className="text-2xl font-semibold leading-none text-foreground">{stat.value}</p>
      {stat.trend && (
        <p className={`mt-2 flex items-center gap-0.5 ${adminType.badge} font-semibold ${trendColor}`}>
          <TrendIcon size={14} />
          {formatTrend(stat.trend.value, stat.trend.direction)}
        </p>
      )}
    </article>
  );
}

export default memo(StatCard);
