"use client";

import { FORM_FIELD_LABEL, FORM_FIELD_ROW } from "@/app/formComponents/formFieldLayout";
import { useNextDocumentNumber } from "@/app/hooks/documentNumberHook/useNextDocumentNumber";
import type {
  DocumentNumberType,
  NextDocumentNumberParams,
} from "@/app/services/documentNumber/documentNumber.service";
import { cn } from "@/lib/utils";

type SharedProps = {
  documentType: DocumentNumberType;
  label: string;
  params?: NextDocumentNumberParams;
  enabled?: boolean;
};

function useDisplayValue(
  documentType: DocumentNumberType,
  params?: NextDocumentNumberParams,
  enabled = true
) {
  const { data, isLoading, isError } = useNextDocumentNumber(
    documentType,
    params,
    enabled
  );

  const text = isLoading
    ? "Loading..."
    : isError
      ? "—"
      : enabled === false
        ? "Select required fields first"
        : data?.nextNumber ?? "—";

  return { text, isLoading, isError, nextNumber: data?.nextNumber };
}

/** Badge for PageHeader — shows next auto-generated number prominently */
export function NextDocumentNumberBadge({
  documentType,
  label,
  params,
  enabled = true,
}: SharedProps) {
  const { text, isLoading } = useDisplayValue(documentType, params, enabled);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5",
        !enabled && "opacity-60"
      )}
    >
      <span className="text-xs font-medium text-gray-500">{label}</span>
      <span
        className={cn(
          "font-mono text-sm font-semibold text-gray-900",
          isLoading && "text-gray-400"
        )}
      >
        {text}
      </span>
      <span className="text-[10px] uppercase tracking-wide text-gray-400">Auto</span>
    </span>
  );
}

type NextDocumentNumberFieldProps = SharedProps & {
  variant?: "form" | "compact";
};

/** Read-only form field — backend assigns this number on save */
export default function NextDocumentNumberField({
  documentType,
  label,
  params,
  enabled = true,
  variant = "form",
}: NextDocumentNumberFieldProps) {
  const { text } = useDisplayValue(documentType, params, enabled);

  if (variant === "compact") {
    return (
      <div className="flex min-w-0 flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <div
          className="flex h-10 items-center rounded-md border border-gray-200 bg-gray-50 px-3 font-mono text-sm font-semibold text-gray-800"
          aria-readonly
        >
          {text}
        </div>
      </div>
    );
  }

  return (
    <div className={FORM_FIELD_ROW}>
      <label className={`${FORM_FIELD_LABEL} pt-0`}>{label}</label>
      <div className="min-w-0 flex-1">
        <div
          className="flex min-h-[2.5rem] items-center border-b-2 border-gray-200 bg-gray-50/80 py-2 font-mono text-sm font-semibold text-gray-800"
          aria-readonly
        >
          {text}
        </div>
      </div>
    </div>
  );
}

/** PageHeader helper — description line + badge */
export function NextDocumentNumberHeader({
  description,
  documentType,
  label,
  params,
  enabled = true,
}: SharedProps & { description?: string }) {
  return (
    <div className="flex flex-col gap-2">
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      <NextDocumentNumberBadge
        documentType={documentType}
        label={label}
        params={params}
        enabled={enabled}
      />
    </div>
  );
}
