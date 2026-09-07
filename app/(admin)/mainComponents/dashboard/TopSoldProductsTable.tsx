"use client";

import { memo } from "react";
import Link from "next/link";
import type { DashboardTopSoldItem } from "@/app/types/dashboard";
import { adminType } from "@/lib/admin/typography";
import DashboardCard from "./DashboardCard";

interface TopSoldProductsTableProps {
  title: string;
  viewAllLabel: string;
  viewAllHref: string;
  rows: DashboardTopSoldItem[];
}

function TopSoldProductsTable({
  title,
  viewAllLabel,
  viewAllHref,
  rows,
}: TopSoldProductsTableProps) {
  return (
    <DashboardCard
      title={title}
      description="Top products by quantity sold in current financial year"
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
              <th className={`pb-3 pr-4 ${adminType.tableHead}`}>#</th>
              <th className={`pb-3 pr-4 ${adminType.tableHead}`}>Product</th>
              <th className={`pb-3 pr-4 ${adminType.tableHead}`}>SKU</th>
              <th className={`pb-3 pr-4 text-right ${adminType.tableHead}`}>Qty Sold</th>
              <th className={`pb-3 text-right ${adminType.tableHead}`}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-muted-foreground">
                  No sales data yet
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-b border-border last:border-0 hover:bg-accent/40">
                  <td className="py-4 pr-4 text-muted-foreground">{row.rank}</td>
                  <td className={`py-4 pr-4 font-medium text-foreground ${adminType.tableCellPrimary}`}>
                    {row.product}
                  </td>
                  <td className="py-4 pr-4 font-mono text-sm text-muted-foreground">{row.sku}</td>
                  <td className="py-4 pr-4 text-right font-semibold">{row.qty}</td>
                  <td className="py-4 text-right font-semibold">
                    ₹ {row.amount.toLocaleString("en-IN")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  );
}

export default memo(TopSoldProductsTable);
