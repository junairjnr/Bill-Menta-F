"use client";

import { useMemo, useState } from "react";
import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { exportService } from "@/app/services/export/export.service";
import { getExportConfig, getExportColumns } from "@/app/config/export/registry";
import {
  cleanExportParams,
  getExportFetchOptions,
  normalizeExportColumnKey,
} from "@/app/config/export/helpers";
import type { ExportFormat } from "@/app/config/export/types";
import { prepareTablePdfData, downloadTablePdf } from "@/app/pdf/common/tablePdf";

type Props = {
  reportType: string;
  title?: string;
  params?: Record<string, string | undefined>;
  variant?: "card" | "inline";
};

export default function ReportExport({ reportType, title, params, variant = "card" }: Props) {
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState<ExportFormat>("excel");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [exporting, setExporting] = useState(false);
  const [exportStep, setExportStep] = useState("");
  const [error, setError] = useState("");

  const config = useMemo(() => getExportConfig(reportType), [reportType]);
  const columns = useMemo(() => getExportColumns(reportType), [reportType]);
  const exportTitle = title ?? config?.title ?? reportType;

  const openDialog = (nextFormat: ExportFormat) => {
    setFormat(nextFormat);
    setError("");
    setExportStep("");
    setSelected(new Set(columns.filter((c) => c.default).map((c) => c.key)));
    setOpen(true);
  };

  const toggle = (key: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleExport = async () => {
    if (selected.size === 0) {
      setError("Select at least one column");
      return;
    }
    if (!config) {
      setError("Export is not configured for this report");
      return;
    }

    setExporting(true);
    setError("");
    setExportStep(format === "pdf" ? "Fetching records..." : "Preparing file...");

    const cleanedParams = cleanExportParams(params);
    const selectedKeys = Array.from(selected).map(normalizeExportColumnKey);
    const fetchOptions = getExportFetchOptions();

    try {
      if (format === "excel") {
        await exportService.downloadExcel(reportType, selectedKeys, cleanedParams);
      } else {
        const rows = await config.fetchRows(cleanedParams, fetchOptions);
        if (rows.length === 0) {
          setError("No records found with the current filters");
          return;
        }
        setExportStep(`Generating PDF (${rows.length} records)...`);
        const { columns: pdfColumns, rows: pdfRows } = prepareTablePdfData(
          columns,
          rows,
          selectedKeys
        );
        const filename = `${reportType}-${new Date().toISOString().slice(0, 10)}.pdf`;
        await downloadTablePdf({
          title: exportTitle,
          columns: pdfColumns,
          rows: pdfRows,
          filename,
        });
      }
      setOpen(false);
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } }; message?: string };
      setError(err?.response?.data?.message || err.message || "Export failed");
    } finally {
      setExporting(false);
      setExportStep("");
    }
  };

  if (columns.length === 0) return null;

  const exportButtons = (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" size="sm" onClick={() => openDialog("excel")}>
        <Download className="mr-2 h-4 w-4" />
        Excel
      </Button>
      <Button variant="outline" size="sm" onClick={() => openDialog("pdf")}>
        <FileText className="mr-2 h-4 w-4" />
        PDF
      </Button>
    </div>
  );

  return (
    <>
      {variant === "inline" ? (
        exportButtons
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
          <div>
            <p className="text-sm font-medium text-gray-900">Export Report</p>
            <p className="text-xs text-gray-500">Choose columns before downloading</p>
          </div>
          {exportButtons}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Select Columns for {format === "excel" ? "Excel" : "PDF"}
            </DialogTitle>
          </DialogHeader>

          <div className="max-h-80 overflow-y-auto py-1">
            <div className="mb-3 flex gap-3 text-xs">
              <button
                type="button"
                onClick={() => setSelected(new Set(columns.map((c) => c.key)))}
                className="text-blue-600 hover:underline"
              >
                Select all
              </button>
              <button
                type="button"
                onClick={() => setSelected(new Set())}
                className="text-gray-500 hover:underline"
              >
                Clear all
              </button>
            </div>
            <div className="space-y-2">
              {columns.map((col) => (
                <label
                  key={col.key}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 px-3 py-2 hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={selected.has(col.key)}
                    onChange={() => toggle(col.key)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">{col.label}</span>
                </label>
              ))}
            </div>
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={exporting}>
              Cancel
            </Button>
            <Button onClick={handleExport} disabled={exporting || selected.size === 0}>
              {exporting
                ? exportStep || "Exporting..."
                : format === "excel"
                  ? "Download Excel"
                  : "Download PDF"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
