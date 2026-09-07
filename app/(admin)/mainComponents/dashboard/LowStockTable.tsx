"use client";

import { memo } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import type { DashboardLowStockItem } from "@/app/types/dashboard";
import { adminType } from "@/lib/admin/typography";
import DashboardCard from "./DashboardCard";

interface LowStockTableProps {
  title: string;
  viewAllLabel: string;
  viewAllHref: string;
  columns: { key: keyof DashboardLowStockItem; label: string }[];
  rows: DashboardLowStockItem[];
}

function StockBadge({ stock, threshold }: { stock: number; threshold: number }) {
  const critical = stock <= Math.floor(threshold / 2);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
        critical ? "bg-red-500/15 text-red-600" : "bg-amber-500/15 text-amber-700"
      }`}
    >
      {critical && <AlertTriangle size={12} />}
      {stock} in stock
    </span>
  );
}

function LowStockTable({
  title,
  viewAllLabel,
  viewAllHref,
  rows,
}: LowStockTableProps) {
  return (
    <DashboardCard
      title={title}
      description="Items at or below the alert threshold"
      headerRight={
        <Link
          href={viewAllHref}
          className={`${adminType.badge} font-semibold text-emerald-800 hover:underline dark:text-emerald-400`}
        >
          {viewAllLabel}
        </Link>
      }
    >
      <div className="w-full overflow-x-auto">
        <table className={`admin-table w-full text-left ${adminType.table}`}>
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className={`pb-3 pr-4 ${adminType.tableHead}`}>Product</th>
              <th className={`pb-3 pr-4 ${adminType.tableHead}`}>SKU</th>
              <th className={`pb-3 pr-4 ${adminType.tableHead}`}>Stock</th>
              <th className={`pb-3 ${adminType.tableHead}`}>Threshold</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-muted-foreground">
                  No low stock items
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-b border-border last:border-0 hover:bg-accent/40">
                  <td className={`py-4 pr-4 font-medium text-foreground ${adminType.tableCellPrimary}`}>
                    {row.product}
                  </td>
                  <td className={`py-4 pr-4 font-mono text-sm text-muted-foreground`}>{row.sku}</td>
                  <td className="py-4 pr-4">
                    <StockBadge stock={row.stock} threshold={row.threshold} />
                  </td>
                  <td className="py-4 text-muted-foreground">≤ {row.threshold}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  );
}

export default memo(LowStockTable);
