export type SelectOption = {
  value: string;
  label: string;
  data?: unknown;
};

export { FORM_LOOKUP_LIMIT as SELECT_PAGE_SIZE } from "@/app/config/pagination";

export const toOption = (
  value: string,
  label: string,
  data?: unknown
): SelectOption => ({ value, label, data });
