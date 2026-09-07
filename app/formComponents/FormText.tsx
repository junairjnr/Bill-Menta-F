// "use client";

// import React from "react";

// interface FormInputProps {
//   label: string;
//   name: string;
//   value: string | number;
//   placeholder?: string;
//   required?: boolean;
//   type?: string;
//   error?: string;
//   touched?: boolean;
//   disabled?: boolean;
//   readOnly?: boolean;
//   onChange: (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => void;
//   onBlur: (
//     e: React.FocusEvent<HTMLInputElement>
//   ) => void;
// }
// const FormInput = ({
//   label,
//   name,
//   value,
//   placeholder,
//   required = false,
//   type = "text",
//   error,
//   touched,
//   onChange,
//   onBlur,
//   disabled = false,
//   readOnly = false,
// }: FormInputProps) => {
//   const hasError = touched && error;

//   return (
//     <div className="flex items-start gap-4 max-w-md">
//       <label className="w-28 pt-2 text-sm font-medium text-gray-700">
//         {/* <label className={`w-28 pt-2 text-sm font-medium text-gray-700 ${!required ? "ml-3" : ""}`}> */}
//         {required && <span className="text-red-500">*</span>}{" "}
//         {label}
//       </label>

//       <div className="flex-1">
//         <input
//           type={type}
//           name={name}
//           value={value}
//           placeholder={placeholder}
//           onChange={onChange}
//           onBlur={onBlur}
//           disabled={disabled}
//           readOnly={readOnly}
//           className={`w-full border-b-2 bg-transparent py-2 text-sm outline-none transition ${
//             hasError
//               ? "border-red-500 focus:border-red-500"
//               : "border-gray-300 focus:border-blue-600"
//           }`}
//         />

//         {hasError && (
//           <p className="mt-1 text-xs text-red-500">
//             {error}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }
// export default React.memo(FormInput); 

"use client";
import React from "react";
import { FORM_FIELD_LABEL, FORM_FIELD_ROW } from "./formFieldLayout";

interface FormInputProps {
  label: string;
  name: string;
  value: string | number;
  placeholder?: string;
  required?: boolean;
  type?: string;
  error?: string;
  touched?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  enterNav?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const FormInput = ({
  label, name, value, placeholder,
  required = false, type = "text",
  error, touched, onChange, onBlur,
  disabled = false, readOnly = false,
  enterNav = false,
}: FormInputProps) => {
  const hasError = touched && error;

  return (
    <div
      className={`${FORM_FIELD_ROW} ${readOnly ? "items-center" : "items-start"}`}
      {...(enterNav && !readOnly ? { "data-enter-nav": "field" } : {})}
    >
      <label
        className={`${FORM_FIELD_LABEL} ${readOnly ? "pt-0" : ""}`}
      >
        {required && <span className="text-red-500">*</span>} {label}
      </label>
      <div className="min-w-0 flex-1">
        <input
          type={type}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          readOnly={readOnly}
          className={`w-full border-b-2 bg-transparent py-2 text-sm outline-none transition
            ${hasError ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-600"}
            ${readOnly ? "bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200" : ""}
            ${disabled ? "opacity-60 cursor-not-allowed" : ""}
          `}
        />
        {hasError && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default React.memo(FormInput);