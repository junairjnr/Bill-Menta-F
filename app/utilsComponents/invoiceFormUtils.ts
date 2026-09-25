export const ENTER_NAV_SELECTOR = "[data-enter-nav]:not([data-enter-nav-disabled='true'])";

export function getTodayISO(): string {
  return new Date().toISOString().split("T")[0];
}

export function focusEnterNavField(el: HTMLElement) {
  if (el.dataset.enterNav === "select" || el.dataset.enterNav === "item-select") {
    const input = el.querySelector<HTMLInputElement>("input");
    input?.focus();
    return;
  }
  if (
    el instanceof HTMLInputElement ||
    el instanceof HTMLSelectElement ||
    el instanceof HTMLTextAreaElement
  ) {
    el.focus();
    return;
  }
  el.querySelector<HTMLElement>("input, select, textarea")?.focus();
}

export function getEnterNavFields(form: HTMLElement): HTMLElement[] {
  return Array.from(form.querySelectorAll<HTMLElement>(ENTER_NAV_SELECTOR)).filter(
    (el) => el.offsetParent !== null && !el.hasAttribute("disabled")
  );
}

export function focusNextEnterNavField(form: HTMLElement, target: EventTarget | null) {
  const fields = getEnterNavFields(form);
  if (!fields.length) return false;

  let currentIdx = -1;
  const node = target as HTMLElement;
  const wrapper = node.closest<HTMLElement>(ENTER_NAV_SELECTOR);
  if (wrapper) {
    currentIdx = fields.indexOf(wrapper);
  }

  if (currentIdx < 0 || currentIdx >= fields.length - 1) return false;

  focusEnterNavField(fields[currentIdx + 1]);
  return true;
}

export function isSelectMenuOpen(target: EventTarget | null): boolean {
  const node = target as HTMLElement;
  if (node.closest('[aria-expanded="true"]')) return true;
  return !!document.querySelector('[class*="menu"] [role="option"]');
}

/** Merge invoice rows that share the same itemId — sums qty into the first row. */
export function mergeDuplicateInvoiceItems<
  T extends { itemId?: string; qty?: string | number },
>(items: T[], recalcRow?: (row: T) => T): { items: T[]; merged: boolean } {
  const result: T[] = [];
  const indexByItemId = new Map<string, number>();
  let merged = false;

  for (const row of items) {
    const itemId = String(row.itemId ?? "").trim();
    if (!itemId) {
      result.push(row);
      continue;
    }

    const existingIdx = indexByItemId.get(itemId);
    if (existingIdx === undefined) {
      indexByItemId.set(itemId, result.length);
      result.push(row);
      continue;
    }

    merged = true;
    const existing = result[existingIdx];
    const mergedQty = (Number(existing.qty) || 0) + (Number(row.qty) || 0);
    const qtyValue =
      typeof existing.qty === "string" || typeof row.qty === "string"
        ? String(mergedQty)
        : mergedQty;
    result[existingIdx] = recalcRow
      ? recalcRow({ ...existing, qty: qtyValue } as T)
      : ({ ...existing, qty: qtyValue } as T);
  }

  return { items: result, merged };
}

type InvoiceLineTotals = {
  taxableValue: number;
  sgst: number;
  cgst: number;
  igst?: number;
};

/** Shared invoice summary totals from line rows (sales & purchase forms). */
export function computeInvoiceTotalsFromItems(
  items: InvoiceLineTotals[],
  cashDiscountAmtInput: string | number
) {
  const lineNetAmount = items.reduce((s, r) => s + r.taxableValue, 0);
  const totalSGST = items.reduce((s, r) => s + r.sgst, 0);
  const totalCGST = items.reduce((s, r) => s + r.cgst, 0);
  const totalIGST = items.reduce((s, r) => s + (r.igst ?? 0), 0);
  const totalTax = totalSGST + totalCGST + totalIGST;
  const total = Number((lineNetAmount + totalTax).toFixed(2));
  const billTotal = Math.round(total);
  const roundOff = Number((billTotal - total).toFixed(2));

  let cashDiscountAmt = Number(Number(cashDiscountAmtInput || 0).toFixed(2));
  if (cashDiscountAmt > billTotal) cashDiscountAmt = billTotal;

  const grandTotal = Number((billTotal - cashDiscountAmt).toFixed(2));

  return {
    lineNetAmount,
    netAmount: lineNetAmount,
    totalSGST,
    totalCGST,
    totalIGST,
    totalTax,
    total,
    billTotal,
    roundOff,
    cashDiscountAmt,
    grandTotal,
    hasTax: totalTax > 0,
  };
}

export function focusLastItemRow(form: HTMLFormElement | null) {
  if (!form) return;
  const selects = form.querySelectorAll('[data-enter-nav="item-select"]');
  const last = selects[selects.length - 1] as HTMLElement | undefined;
  if (last) focusEnterNavField(last);
}

export function appendMergedInvoiceRow<
  T extends { itemId?: string; qty?: string | number },
>(items: T[], emptyRow: () => T, recalcRow: (row: T) => T) {
  const { items: mergedItems, merged } = mergeDuplicateInvoiceItems(items, recalcRow);
  return {
    nextItems: [...mergedItems, emptyRow()],
    merged,
  };
}

/** Calculated amounts derived from qty/rate/discount/tax on invoice lines. */
export const INVOICE_ROW_CALCULATED_ZERO = {
  discountAmt: 0,
  taxableValue: 0,
  sgst: 0,
  cgst: 0,
  igst: 0,
  total: 0,
} as const;

export const PURCHASE_ROW_CALCULATED_ZERO = {
  discountAmt: 0,
  taxableValue: 0,
  sgst: 0,
  cgst: 0,
  total: 0,
} as const;

export function clearInvoiceRowCalculated<T extends Record<string, unknown>>(row: T): T {
  return { ...row, ...INVOICE_ROW_CALCULATED_ZERO };
}

export function clearPurchaseRowCalculated<T extends Record<string, unknown>>(row: T): T {
  return { ...row, ...PURCHASE_ROW_CALCULATED_ZERO };
}

/** Clear qty/discount and all calculated amounts (used when product changes). */
export function clearInvoiceRowQtyDependents<
  T extends { qty?: string | number; discount?: string | number },
>(row: T): T {
  return {
    ...row,
    qty: "",
    discount: "0",
    ...INVOICE_ROW_CALCULATED_ZERO,
  };
}

export function clearPurchaseRowQtyDependents<
  T extends { qty?: string | number; discount?: string | number },
>(row: T): T {
  return {
    ...row,
    qty: "",
    discount: "0",
    ...PURCHASE_ROW_CALCULATED_ZERO,
  };
}

/** Rebuild a manual line from empty defaults while keeping row key. */
export function resetManualLineKeepingKey<T extends { key: string }>(
  emptyLine: () => T,
  key: string,
  fields: Partial<Omit<T, "key">> = {}
): T {
  return { ...emptyLine(), key, ...fields };
}
