"use client";

import { Plus } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Select, { components } from "react-select";
import type { IndicatorsContainerProps } from "react-select";
import AsyncSelect from "react-select/async";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ADD_SELECT_BUTTON_CLASS } from "./formFieldLayout";
import { getSelectStyles } from "./reactSelectStyles";
import type { SelectOption } from "./selectTypes";

interface SelectWithAddFieldProps {
  instanceId?: string;
  value: string;
  selectedOption?: SelectOption | null;
  options?: SelectOption[];
  loadOptions?: (search: string) => Promise<SelectOption[]>;
  placeholder?: string;
  disabled?: boolean;
  hasError?: boolean;
  addLabel?: string;
  reloadKey?: string;
  onChange: (value: string, option: SelectOption | null) => void;
  onBlur?: () => void;
  onAddClick?: () => void;
}

const SelectWithAddField = ({
  instanceId,
  value,
  selectedOption,
  options,
  loadOptions,
  placeholder = "Search & select...",
  disabled = false,
  hasError = false,
  addLabel = "Add New",
  reloadKey,
  onChange,
  onBlur,
  onAddClick,
}: SelectWithAddFieldProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const styles = useMemo(() => getSelectStyles(hasError), [hasError]);

  const selectValue = useMemo(() => {
    if (!value) return null;
    if (selectedOption?.value === value) return selectedOption;
    return options?.find((o) => o.value === value) ?? null;
  }, [value, selectedOption, options]);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debouncedLoad = useMemo(() => {
    if (!loadOptions) return undefined;
    return (input: string) =>
      new Promise<SelectOption[]>((resolve, reject) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
          loadOptions(input).then(resolve).catch(reject);
        }, 350);
      });
  }, [loadOptions]);

  const addButtonEl = (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onAddClick}
      aria-label={addLabel}
      title={addLabel}
      className={ADD_SELECT_BUTTON_CLASS}
    >
      <Plus
        className="h-3 w-3 shrink-0 text-emerald-700"
        strokeWidth={2.5}
      />
      <span className="whitespace-nowrap">Add</span>
    </button>
  );

  const selectComponents = useMemo(() => {
    if (!onAddClick) return undefined;

    const IndicatorsContainer = (
      props: IndicatorsContainerProps<SelectOption, false>
    ) => (
      <components.IndicatorsContainer {...props}>
        {props.children}
        {mounted ? (
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>{addButtonEl}</TooltipTrigger>
              <TooltipContent side="top" sideOffset={6}>
                {addLabel}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          addButtonEl
        )}
      </components.IndicatorsContainer>
    );

    return { IndicatorsContainer };
  }, [onAddClick, mounted, addLabel, addButtonEl]);

  if (!mounted) {
    return (
      <div
        className={`flex min-w-0 flex-1 items-center border-b-2 ${
          hasError ? "border-red-500" : "border-gray-300"
        }`}
      >
        <div className="min-w-0 flex-1 py-2 text-sm text-gray-400">
          {selectValue?.label || placeholder}
        </div>
        {onAddClick && addButtonEl}
      </div>
    );
  }

  const commonProps = {
    instanceId: instanceId ?? `select-${value || "empty"}`,
    value: selectValue,
    isDisabled: disabled,
    isClearable: false,
    isSearchable: true,
    placeholder,
    styles,
    components: selectComponents,
    menuPortalTarget: document.body,
    menuPosition: "fixed" as const,
    onBlur,
    onChange: (opt: SelectOption | null) => onChange(opt?.value ?? "", opt),
  };

  return loadOptions ? (
    <AsyncSelect
      key={reloadKey}
      {...commonProps}
      loadOptions={debouncedLoad!}
      defaultOptions
      cacheOptions={false}
      filterOption={() => true}
      loadingMessage={() => "Loading..."}
      noOptionsMessage={() => "No results found"}
    />
  ) : (
    <Select
      {...commonProps}
      options={options ?? []}
      filterOption={(option, input) =>
        option.label.toLowerCase().includes(input.toLowerCase())
      }
      noOptionsMessage={() => "No options"}
    />
  );
};

export default React.memo(SelectWithAddField);
