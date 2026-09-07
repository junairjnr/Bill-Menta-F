/**
 * Global pagination — change values here per client deployment.
 */

/** Rows per page — lists, masters, invoices, expenses, etc. */
export const PAGE_SIZE = 10;

/** Rows per page — report screens */
export const REPORT_PAGE_SIZE = 20;

/** Max records for filter/search dropdowns */
export const DROPDOWN_LIMIT = 500;

/** Categories, invoice pickers in forms */
export const LOOKUP_LIMIT = 100;

/** Warehouses and compact form dropdowns */
export const FORM_LOOKUP_LIMIT = 50;

export const EXPORT_LIMIT = 10000;
export const EXPORT_BATCH_SIZE = 500;

/** Sl No column on paginated list tables (page 2 → continues from 11 if PAGE_SIZE is 10) */
export function listRowNumber(page: number, index: number): number {
  return (page - 1) * PAGE_SIZE + index + 1;
}

/** Sl No column on paginated report tables */
export function reportRowNumber(page: number, index: number): number {
  return (page - 1) * REPORT_PAGE_SIZE + index + 1;
}
