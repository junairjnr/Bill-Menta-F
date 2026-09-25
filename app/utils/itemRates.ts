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

/** Profit % from purchase and sales rates. */
export const profitPercentFromRates = (
  purchaseRate: number,
  salesRate: number
): number | "" => {
  const purchase = Number(purchaseRate);
  const sales = Number(salesRate);
  if (!purchase || purchase <= 0 || !sales || sales < 0) return "";
  return Number((((sales - purchase) / purchase) * 100).toFixed(2));
};

/** Sales rate from purchase cost and profit margin %. */
export const salesRateFromProfit = (
  purchaseRate: number,
  profitPercent: number
): number | "" => {
  const purchase = Number(purchaseRate);
  const profit = Number(profitPercent);
  if (!purchase || purchase <= 0 || Number.isNaN(profit)) return "";
  return Number((purchase * (1 + profit / 100)).toFixed(2));
};
