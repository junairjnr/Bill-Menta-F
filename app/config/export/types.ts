export type ExportColumn = {
  key: string;
  label: string;
  default: boolean;
  align?: "left" | "right";
  width?: "narrow" | "normal";
};

export type ExportFormat = "excel" | "pdf";

export type ExportScope = "all" | "page";

export type ExportFetchOptions = {
  scope?: ExportScope;
  page?: number;
  pageLimit?: number;
};

export type ExportConfig = {
  title: string;
  columns: ExportColumn[];
  fetchRows: (
    params: Record<string, string>,
    options?: ExportFetchOptions
  ) => Promise<Record<string, string>[]>;
};
