"use client";

import React from "react";
import SelectWithAddField from "./SelectWithAddField";
import { FORM_FIELD_LABEL, FORM_FIELD_ROW } from "./formFieldLayout";
import type { SelectOption } from "./selectTypes";

interface FormSelectWithAddProps {
  label: string;
  instanceId?: string;
  value: string;
  selectedOption?: SelectOption | null;
  placeholder?: string;
  required?: boolean;
  options?: SelectOption[];
  loadOptions?: (search: string) => Promise<SelectOption[]>;
  error?: string;
  touched?: boolean;
  disabled?: boolean;
  addLabel?: string;
  reloadKey?: string;
  enterNav?: boolean;
  onAddClick?: () => void;
  onValueChange: (value: string, option: SelectOption | null) => void;
  onBlur?: () => void;
}

const FormSelectWithAdd = ({
  label,
  instanceId,
  value,
  selectedOption,
  placeholder = "Search & select...",
  required = false,
  options,
  loadOptions,
  error,
  touched,
  disabled = false,
  addLabel = "Add New",
  reloadKey,
  enterNav = false,
  onAddClick,
  onValueChange,
  onBlur,
}: FormSelectWithAddProps) => {
  const hasError = !!(touched && error);

  return (
    <div
      className={FORM_FIELD_ROW}
      {...(enterNav ? { "data-enter-nav": "select" } : {})}
    >
      <label className={FORM_FIELD_LABEL}>
        {required && <span className="text-red-500">*</span>} {label}
      </label>
      <div className="min-w-0 flex-1">
        <SelectWithAddField
          instanceId={instanceId}
          value={value}
          selectedOption={selectedOption}
          options={options}
          loadOptions={loadOptions}
          placeholder={placeholder}
          disabled={disabled}
          hasError={hasError}
          addLabel={addLabel}
          reloadKey={reloadKey}
          onChange={onValueChange}
          onBlur={onBlur}
          onAddClick={onAddClick}
        />
        {hasError && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default React.memo(FormSelectWithAdd);
