// components/common/FormCheckbox.tsx

"use client";

import React from "react";

interface FormCheckboxProps {
  label: string;
  name: string;
  checked: boolean;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  onBlur?: (
    e: React.FocusEvent<HTMLInputElement>
  ) => void;
}

const FormCheckbox = ({
  label,
  name,
  checked,
  onChange,
  onBlur,
}: FormCheckboxProps) => {
  return (
    <div className="flex items-center gap-4 max-w-md">
      <label className="w-28 text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        onBlur={onBlur}
        className="h-4 w-4 rounded border-gray-300"
      />
    </div>
  );
}
export default React.memo(FormCheckbox);