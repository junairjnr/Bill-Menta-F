import { QueryParams } from "../types";

export const KEYS = {
  categories: (p?: QueryParams) => ["item-categories", p] as const,
  category: (id: string) => ["item-categories", id] as const,
  items: (p?: QueryParams) => ["items", p] as const,
  item: (id: string) => ["items", id] as const,
  customers: (p?: QueryParams) => ["customers", p] as const,
  customer: (id: string) => ["customers", id] as const,
  uoms: (p?: QueryParams) => ["uoms", p] as const,
  uom: (id: string) => ["uoms", id] as const,
};
