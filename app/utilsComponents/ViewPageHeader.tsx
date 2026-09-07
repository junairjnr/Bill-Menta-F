// // app/utilsComponents/ViewPageHeader.tsx
// "use client";

// import { useRouter }    from "next/navigation";
// import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
// import { Button }       from "@/components/ui/button";

// interface ViewPageHeaderProps {
//   title?:       string;
//   subtitle?:   string;
//   editPath:    string;
//   onDelete:    () => void;
//   deleting?:   boolean;
// }

// export default function ViewPageFooter({
//   title,
//   subtitle,
//   editPath,
//   onDelete,
//   deleting = false,
// }: ViewPageHeaderProps) {
//   const router = useRouter();

//   return (
//     <div className="flex items-center justify-between">
//       <div className="flex items-center gap-4">
//         {/* <button
//           onClick={() => router.back()}
//           className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition"
//         >
//           <ArrowLeft size={16} />
//           Back
//         </button> */}
//         <div>
//           <h1 className="text-xl font-bold text-gray-800">{title}</h1>
//           {subtitle && (
//             <p className="text-sm text-gray-400">{subtitle}</p>
//           )}
//         </div>
//       </div>

//       <div className="flex gap-2">
//         <Button
//           onClick={() => router.push(editPath)}
//           variant="outline"
//           className="flex items-center gap-2 text-sm"
//         >
//           <Pencil size={14} /> Edit
//         </Button>

//         <Button
//           onClick={onDelete}
//           disabled={deleting}
//           variant="destructive"
//           className="flex items-center gap-2 text-sm"
//         >
//           <Trash2 size={14} /> Delete
//         </Button>
//       </div>
//     </div>
//   );
// }

// app/utilsComponents/ViewPageHeader.tsx
"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface ViewPageHeaderProps {
  title:     string;
  subtitle?: string;
}

export default function ViewPageHeader({
  title,
  subtitle,
}: ViewPageHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-4">
      {/* <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition"
      >
        <ArrowLeft size={16} />
        Back
      </button> */}
      <div>
        <h1 className="text-xl font-bold text-gray-800">{title}</h1>
        {subtitle && (
          <p className="text-sm text-gray-400">{subtitle}</p>
        )}
      </div>
    </div>
  );
}