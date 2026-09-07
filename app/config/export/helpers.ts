import type { ExportColumn, ExportFetchOptions } from "./types";
import { EXPORT_BATCH_SIZE, EXPORT_LIMIT } from "@/app/config/pagination";

export { EXPORT_LIMIT, EXPORT_BATCH_SIZE };

export const fmtExportDate = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export const fmtExportMoney = (n: number) => `₹ ${(n ?? 0).toFixed(2)}`;

export function cleanExportParams(
  params?: Record<string, string | undefined>
): Record<string, string> {
  if (!params) return {};
  const cleaned = Object.fromEntries(
    Object.entries(params).filter(
      ([k, v]) => v !== undefined && v !== "" && k !== "page" && k !== "pageLimit"
    )
  ) as Record<string, string>;
  return cleaned;
}

export function getExportFetchOptions(): ExportFetchOptions {
  return { scope: "all" };
}

export const SLNO_KEY = "slno";

export function isSlNoColumn(col: { key: string; label?: string }): boolean {
  return (
    col.key === SLNO_KEY ||
    col.key === "rowNum" ||
    col.key === "#" ||
    col.label === "#" ||
    col.label?.toLowerCase() === "sl no"
  );
}

export function normalizeSlNoColumn(col: ExportColumn): ExportColumn {
  if (!isSlNoColumn(col)) return col;
  return {
    ...col,
    key: SLNO_KEY,
    label: "Sl No",
    align: "right",
    width: "narrow",
  };
}

export function normalizeExportColumnKey(key: string): string {
  return key === "rowNum" || key === "#" ? SLNO_KEY : key;
}

export function defineCol(
  key: string,
  label: string,
  opts?: { default?: boolean; align?: "left" | "right"; width?: "narrow" | "normal" }
) {
  if (isSlNoColumn({ key, label })) {
    return {
      key: SLNO_KEY,
      label: "Sl No",
      default: opts?.default ?? true,
      align: "right" as const,
      width: "narrow" as const,
    };
  }
  return {
    key,
    label,
    default: opts?.default ?? true,
    align: opts?.align,
    width: opts?.width ?? "normal",
  };
}

/** Keep Sl No as the first column when present */
export function sortExportColumns(columns: ExportColumn[]): ExportColumn[] {
  const normalized = columns.map(normalizeSlNoColumn);
  const serial = normalized.find((c) => c.key === SLNO_KEY);
  const rest = normalized.filter((c) => c.key !== SLNO_KEY);
  return serial ? [serial, ...rest] : normalized;
}

export async function fetchPaginatedExportRows<T>(
  fetchPage: (
    page: number,
    limit: number
  ) => Promise<{ data?: T[]; rows?: T[]; hasNext?: boolean }>,
  mapItem: (item: T) => Record<string, string>,
  _options?: ExportFetchOptions
): Promise<Record<string, string>[]> {
  const all: T[] = [];
  let page = 1;
  let hasNext = true;

  while (hasNext && all.length < EXPORT_LIMIT) {
    const res = await fetchPage(page, EXPORT_BATCH_SIZE);
    const items = res.data ?? res.rows ?? [];
    if (items.length === 0) break;
    all.push(...items);
    hasNext = Boolean(res.hasNext) && items.length >= EXPORT_BATCH_SIZE;
    page += 1;
  }

  return all.map((item, i) => ({
    [SLNO_KEY]: String(i + 1),
    ...mapItem(item),
  }));
}

export function paginatedListFetcher<T>(
  fetch: (params: Record<string, string | number>) => Promise<{
    data?: T[];
    rows?: T[];
    hasNext?: boolean;
  }>,
  mapItem: (item: T) => Record<string, string>
) {
  return (params: Record<string, string>, options?: ExportFetchOptions) =>
    fetchPaginatedExportRows(
      (page, limit) => fetch({ ...params, page, limit }),
      mapItem,
      options
    );
}

export function paginatedReportFetcher<T>(
  fetch: (params: Record<string, string | number>) => Promise<{
    data?: T[];
    rows?: T[];
    hasNext?: boolean;
  }>,
  mapItem: (item: T) => Record<string, string>
) {
  return paginatedListFetcher(fetch, mapItem);
}

/** Rows without serial numbers (accounting tables, chart of accounts) */
export async function fetchStaticExportRows<T>(
  fetchAll: () => Promise<T[]>,
  mapItem: (item: T) => Record<string, string>
): Promise<Record<string, string>[]> {
  const items = await fetchAll();
  return items.slice(0, EXPORT_LIMIT).map(mapItem);
}

export function flattenSectionRows(
  sections: { label: string; rows: { accountCode: string; accountName: string; amount: number }[] }[],
  fmtAmount: (n: number) => string
): Record<string, string>[] {
  return sections.flatMap(({ label, rows }) =>
    rows.map((row) => ({
      section: label,
      account: `${row.accountCode} ${row.accountName}`,
      amount: fmtAmount(row.amount),
    }))
  );
}
