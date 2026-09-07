"use client";

import React from "react";
import SelectWithAddField from "./SelectWithAddField";
import type { SelectOption } from "./selectTypes";

interface ItemSelectWithAddProps {
  instanceId?: string;
  value: string;
  selectedOption?: SelectOption | null;
  options?: SelectOption[];
  loadOptions?: (search: string) => Promise<SelectOption[]>;
  placeholder?: string;
  hasError?: boolean;
  error?: string;
  addLabel?: string;
  enterNav?: boolean;
  onChange: (value: string, option: SelectOption | null) => void;
  onAddClick?: () => void;
}

const ItemSelectWithAdd = ({
  instanceId,
  value,
  selectedOption,
  options,
  loadOptions,
  placeholder = "Search item...",
  hasError,
  error,
  addLabel = "Add Product",
  enterNav = false,
  onChange,
  onAddClick,
}: ItemSelectWithAddProps) => (
  <div className="min-w-0" {...(enterNav ? { "data-enter-nav": "item-select" } : {})}>
    <SelectWithAddField
      instanceId={instanceId}
      value={value}
      selectedOption={selectedOption}
      options={options}
      loadOptions={loadOptions}
      placeholder={placeholder}
      hasError={!!hasError}
      addLabel={addLabel}
      onChange={onChange}
      onAddClick={onAddClick}
    />
    {hasError && error && (
      <p className="mt-1 text-xs text-red-500">{error}</p>
    )}
  </div>
);

export default React.memo(ItemSelectWithAdd);
