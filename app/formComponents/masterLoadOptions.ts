import { customerService } from "@/app/services/masterServices/customer/customer.service";
import { itemService } from "@/app/services/masterServices/item/item.service";
import { itemCategoryService } from "@/app/services/masterServices/itemCategory/itemCategory.service";
import { uomService } from "@/app/services/masterServices/uom/uom.service";
import { taxMasterService } from "@/app/services/masterServices/taxMaster/taxMaster.service";
import type { QueryParams, PaginatedData, Item } from "@/app/types";
import { SELECT_PAGE_SIZE, toOption, type SelectOption } from "./selectTypes";

/** Min chars before search filter is applied */
export const MIN_SEARCH_CHARS = 1;

async function searchOptions<T>(
  fetcher: (params?: QueryParams) => Promise<PaginatedData<T>>,
  mapper: (row: T) => SelectOption,
  search: string,
  extraParams?: QueryParams,
  postFilter?: (rows: T[]) => T[]
): Promise<SelectOption[]> {
  const q = search.trim();
  const params: QueryParams = {
    limit: SELECT_PAGE_SIZE,
    page: 1,
    isActive: true,
    ...extraParams,
  };
  if (q.length >= MIN_SEARCH_CHARS) params.search = q;

  const res = await fetcher(params);
  let rows = res.data;
  if (postFilter) rows = postFilter(rows);
  return rows.map(mapper);
}

export async function loadSalesCustomers(
  search: string,
  customerType: string
): Promise<SelectOption[]> {
  const rows = await customerService.search({
    q: search.trim(),
    type: "sales",
    customerType,
  });
  return rows.map((c) => toOption(c._id, c.name, c));
}

export async function loadVendors(search: string): Promise<SelectOption[]> {
  const rows = await customerService.search({
    q: search.trim(),
    type: "purchase",
  });
  return rows.map((c) => toOption(c._id, c.name, c));
}

export async function loadItems(search: string): Promise<SelectOption[]> {
  const rows = await itemService.search({ q: search.trim() });
  return rows.map((i) =>
    toOption(i._id, i.name, {
      ...i,
      hsnCode: i.hsnCode ?? (i as Item & { hsn?: string }).hsn ?? "",
    })
  );
}

export async function loadCategories(search: string): Promise<SelectOption[]> {
  return searchOptions<import("@/app/types").ItemCategory>(
    (params) => itemCategoryService.getAll(params),
    (c) => toOption(c._id, c.name, c),
    search
  );
}

export async function loadUoms(search: string): Promise<SelectOption[]> {
  return searchOptions<import("@/app/types").Uom>(
    (params) => uomService.getAll(params),
    (u) => toOption(u._id, `${u.name} (${u.shortCode})`, u),
    search
  );
}

export async function loadTaxMasters(search: string): Promise<SelectOption[]> {
  return searchOptions<import("@/app/types").TaxMaster>(
    (params) => taxMasterService.getAll(params),
    (t) => toOption(t._id, `${t.name} (${t.taxPercent}%)`, t),
    search
  );
}

export function mapStaticOptions(
  items: { _id: string; name: string; isDefault?: boolean }[]
): SelectOption[] {
  return items.map((w) =>
    toOption(w._id, `${w.name}${w.isDefault ? " (Default)" : ""}`, w)
  );
}
