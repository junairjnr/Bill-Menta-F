"use client";

interface ViewFieldProps {
  label: string;
  value?: string | number | null;
  capitalize?: boolean;
  badge?: boolean;
  badgeColor?: "green" | "red" | "yellow" | "blue" | "gray";
}

const badgeClasses = {
  green: "bg-green-100 text-green-700",
  red: "bg-red-100 text-red-600",
  yellow: "bg-yellow-100 text-yellow-700",
  blue: "bg-blue-100 text-blue-700",
  gray: "bg-gray-100 text-gray-600",
};

export default function ViewField({
  label,
  value,
  capitalize = false,
  badge = false,
  badgeColor = "gray",
}: ViewFieldProps) {
  return (
 
    <div className="flex w-full items-center">
      <span className="w-40 text-sm font-medium text-gray-500">{label}</span>

      <span className="mr-3 text-gray-400">:</span>

      {badge ? (
        <span
          className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClasses[badgeColor]}`}
        >
          {value || "—"}
        </span>
      ) : (
        <span
          className={`flex-1 text-sm font-medium text-gray-800 ${
            capitalize ? "capitalize" : ""
          }`}
        >
          {value || "—"}
        </span>
      )}
    </div>
  );
}

// app/utilsComponents/ViewField.tsx

// // app/utilsComponents/ViewField.tsx
// "use client";

// interface ViewFieldProps {
//   label:       string;
//   value?:      string | number | null;
//   capitalize?: boolean;
//   badge?:      boolean;
//   badgeColor?: "green" | "red" | "yellow" | "blue" | "gray";
// }

// const badgeClasses: Record<string, string> = {
//   green:  "bg-green-100 text-green-700",
//   red:    "bg-red-100 text-red-600",
//   yellow: "bg-yellow-100 text-yellow-700",
//   blue:   "bg-blue-100 text-blue-700",
//   gray:   "bg-gray-100 text-gray-600",
// };

// export default function ViewField({
//   label,
//   value,
//   capitalize = false,
//   badge = false,
//   badgeColor = "gray",
// }: ViewFieldProps) {
//   const display = value ?? "—";

//   return (
//     <div className="flex flex-col gap-1.5">
//       <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
//         {label}
//       </span>

//       {badge ? (
//         <span
//           className={`inline-flex w-fit px-2.5 py-0.5 rounded-full
//             text-xs font-medium ${badgeClasses[badgeColor]}`}
//         >
//           {display}
//         </span>
//       ) : (
//         <span
//           className={`text-sm text-gray-800
//             ${capitalize ? "capitalize" : ""}
//             ${!value ? "text-gray-400 italic" : "font-medium"}`}
//         >
//           {display}
//         </span>
//       )}
//     </div>
//   );
// }
