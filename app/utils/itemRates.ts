/** Resolve sales rate from item master (0/missing salesRate falls back to price). */
export const itemSalesRate = (
  item: { salesRate?: number; price?: number } | null | undefined
) => {
  const salesRate = Number(item?.salesRate);
  if (salesRate > 0) return salesRate;
  return Number(item?.price ?? 0);
};

/** Resolve purchase rate from item master (0/missing purchaseRate falls back to price). */
export const itemPurchaseRate = (
  item: { purchaseRate?: number; price?: number } | null | undefined
) => {
  const purchaseRate = Number(item?.purchaseRate);
  if (purchaseRate > 0) return purchaseRate;
  return Number(item?.price ?? 0);
};
