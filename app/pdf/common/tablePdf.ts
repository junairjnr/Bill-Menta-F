"use client";

import React from "react";
import type { ExportColumn } from "@/app/config/export/types";
import {
  SLNO_KEY,
  isSlNoColumn,
  normalizeExportColumnKey,
  normalizeSlNoColumn,
  sortExportColumns,
} from "@/app/config/export/helpers";
import type { DownloadTablePdfInput, TablePdfColumn } from "./types";

function defaultGeneratedAt() {
  return new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Filter export columns/rows for PDF — same keys as Excel export */
export function prepareTablePdfData(
  columns: ExportColumn[],
  rows: Record<string, string>[],
  selectedKeys: string[]
): { columns: TablePdfColumn[]; rows: Record<string, string>[] } {
  const normalizedKeys = new Set(selectedKeys.map(normalizeExportColumnKey));

  const selectedColumns = sortExportColumns(
    columns
      .filter(
        (c) =>
          normalizedKeys.has(normalizeExportColumnKey(c.key)) ||
          (isSlNoColumn(c) && normalizedKeys.has(SLNO_KEY))
      )
      .map(normalizeSlNoColumn)
  );

  const includesSlNo = selectedColumns.some((c) => c.key === SLNO_KEY);

  const filteredRows = rows.map((row, index) => {
    const filtered: Record<string, string> = {};
    for (const col of selectedColumns) {
      if (col.key === SLNO_KEY) {
        filtered[SLNO_KEY] = String(row[SLNO_KEY] ?? row.rowNum ?? index + 1);
      } else {
        filtered[col.key] = row[col.key] ?? "—";
      }
    }
    if (includesSlNo && !filtered[SLNO_KEY]) {
      filtered[SLNO_KEY] = String(row[SLNO_KEY] ?? row.rowNum ?? index + 1);
    }
    return filtered;
  });

  return { columns: selectedColumns, rows: filteredRows };
}

/** Generate and download a table PDF — pass title, columns, and rows */
export async function downloadTablePdf({
  title,
  columns,
  rows,
  filename,
  generatedAt = defaultGeneratedAt(),
}: DownloadTablePdfInput): Promise<void> {
  const [{ pdf }, { default: TablePdfDocument }] = await Promise.all([
    import("@react-pdf/renderer"),
    import("./TablePdfDocument"),
  ]);

  const blob = await pdf(
    React.createElement(TablePdfDocument, {
      title,
      columns,
      rows,
      generatedAt,
      totalRows: rows.length,
    })
  ).toBlob();

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
