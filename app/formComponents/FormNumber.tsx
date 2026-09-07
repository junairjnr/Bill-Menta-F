// // components/common/FormNumberInput.tsx

// "use client";

// import React from "react";

// interface FormNumberInputProps {
//   label: string;
//   name: string;
//   value: number | string;
//   placeholder?: string;
//   required?: boolean;
//   min?: number;
//   max?: number;
//   step?: number;
//   error?: string;
//   touched?: boolean;
//   readOnly?: boolean;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
//   onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
// }

// const FormNumberInput = ({
//   label,
//   name,
//   value,
//   placeholder,
//   required = false,
//   min,
//   max,
//   step,
//   error,
//   touched,
//   onChange,
//   onBlur,
//   onKeyDown,
//   readOnly = false,
// }: FormNumberInputProps) => {
//   const hasError = touched && error;

//   return (
//     <div className="flex items-start gap-4 max-w-md">
//       <label className="w-28 pt-2 text-sm font-medium text-gray-700">
//       {/* <label className={`w-28 pt-2 text-sm font-medium text-gray-700 ${!required ? "ml-3" : ""}`}> */}
//         {required && <span className="text-red-500">*</span>} {label}
//       </label>

//       <div className="flex-1">
//         <input
//           type="number"
//           name={name}
//           value={value}
//           placeholder={placeholder}
//           min={min}
//           max={max}
//           step={step}
//           onChange={onChange}
//           onBlur={onBlur}
//           onKeyDown={onKeyDown}
//           readOnly={readOnly}
//           className={`w-full border-b-2 bg-transparent py-2 text-sm outline-none ${
//             hasError
//               ? "border-red-500"
//               : "border-gray-300 focus:border-blue-600"
//           }`}
//         />

//         {hasError && <p className="mt-1 text-xs text-red-500">{error}</p>}
//       </div>
//     </div>
//   );
// };
// export default React.memo(FormNumberInput);
"use client";
import React from "react";

interface FormNumberInputProps {
  label: string;
  name: string;
  value: number | string;
  placeholder?: string;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  error?: string;
  touched?: boolean;
  readOnly?: boolean;
  disabled?: boolean;       // ← ADD
  blockNegative?: boolean;  // ← ADD — auto blocks -/e/E/+
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const FormNumberInput = ({
  label, name, value, placeholder,
  required = false, min, max, step,
  error, touched, onChange, onBlur,
  onKeyDown, readOnly = false,
  disabled = false, blockNegative = true,
}: FormNumberInputProps) => {
  const hasError = touched && error;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (blockNegative && ["-", "e", "E", "+"].includes(e.key)) {
      e.preventDefault();
    }
    onKeyDown?.(e);
  };

  return (
    <div className="flex items-start gap-4 max-w-md">
      <label className="w-28 pt-2 text-sm font-medium text-gray-700">
        {required && <span className="text-red-500">*</span>} {label}
      </label>
      <div className="flex-1">
        <input
          type="number"
          name={name}
          value={value}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          onChange={onChange}
          onBlur={onBlur}
          onKeyDown={handleKeyDown}
          readOnly={readOnly}
          disabled={disabled}
          className={`w-full border-b-2 bg-transparent py-2 text-sm outline-none
            ${hasError ? "border-red-500" : "border-gray-300 focus:border-blue-600"}
            ${readOnly ? "bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200" : ""}
            ${disabled ? "opacity-60 cursor-not-allowed" : ""}
          `}
        />
        {hasError && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default React.memo(FormNumberInput);