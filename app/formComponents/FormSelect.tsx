"use client";

import React from "react";
import SelectWithAddField from "./SelectWithAddField";
import { FORM_FIELD_LABEL, FORM_FIELD_ROW } from "./formFieldLayout";
import type { SelectOption } from "./selectTypes";

interface Option {
  label: string;
  value: string;
}

interface FormSelectProps {
  label: string;
  name: string;
  value: string;
  placeholder?: string;
  required?: boolean;
  options: Option[];
  error?: string;
  touched?: boolean;
  disabled?: boolean;
  enterNav?: boolean;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLSelectElement>) => void;
}

const FormSelect = ({
  label,
  name,
  value,
  placeholder = "Select option",
  required = false,
  options,
  error,
  touched,
  disabled = false,
  enterNav = false,
  onChange,
  onBlur,
}: FormSelectProps) => {
  const hasError = !!(touched && error);
  const selectOptions: SelectOption[] = options.map((o) => ({
    label: o.label,
    value: o.value,
  }));

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
          instanceId={name}
          value={value}
          options={selectOptions}
          placeholder={placeholder}
          disabled={disabled}
          hasError={hasError}
          onChange={(val) =>
            onChange({
              target: { name, value: val },
            } as React.ChangeEvent<HTMLSelectElement>)
          }
          onBlur={() =>
            onBlur({
              target: { name },
            } as React.FocusEvent<HTMLSelectElement>)
          }
        />
        {hasError && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default React.memo(FormSelect);
