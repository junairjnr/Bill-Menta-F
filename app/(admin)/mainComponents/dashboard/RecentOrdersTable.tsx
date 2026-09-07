"use client";

import { memo } from "react";
import Link from "next/link";
import type { DashboardOrder } from "@/app/types/dashboard";
import { adminType } from "@/lib/admin/typography";
import DashboardCard from "./DashboardCard";

interface RecentOrdersTableProps {
  title: string;
  viewAllLabel: string;
  viewAllHref: string;
  columns: { key: string; label: string }[];
  rows: DashboardOrder[];
}

function RecentOrdersTable({
  title,
  viewAllLabel,
  viewAllHref,
  columns,
  rows,
}: RecentOrdersTableProps) {
  return (
    <DashboardCard
      title={title}
      headerRight={
        <Link
          href={viewAllHref}
          className={`${adminType.badge} font-semibold text-emerald-800 hover:underline dark:text-emerald-400`}
        >
          {viewAllLabel}
        </Link>
      }
      className="h-full"
    >
      <div className="w-full overflow-x-auto">
        <table className={`admin-table w-full table-fixed text-left ${adminType.table}`}>
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              {columns.map((col) => (
                <th key={col.key} className={`pb-3 pr-4 last:pr-0 ${adminType.tableHead}`}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-6 text-center text-muted-foreground">
                  No records found
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-b border-border last:border-0 hover:bg-accent/50">
                  <td className={`py-3.5 pr-4 font-mono ${adminType.badge} ${adminType.tableCellPrimary}`}>
                    {row.id}
                  </td>
                  <td className={`py-3.5 pr-4 ${adminType.tableCellPrimary}`}>{row.customer}</td>
                  <td className={`py-3.5 pr-4 ${adminType.label}`}>{row.date}</td>
                  <td className={`py-3.5 pr-4 ${adminType.label}`}>{row.items}</td>
                  <td className="py-3.5 pr-4 font-semibold text-foreground">{row.amount}</td>
                  <td className="py-3.5 capitalize text-muted-foreground">{row.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  );
}

export default memo(RecentOrdersTable);
