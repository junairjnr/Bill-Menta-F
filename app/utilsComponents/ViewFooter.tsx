// // app/utilsComponents/ViewFooter.tsx
// "use client";

// import { useRouter }        from "next/navigation";
// import { Pencil, Trash2 }   from "lucide-react";
// import { Button }           from "@/components/ui/button";

// interface ViewFooterProps {
//   editPath:  string;
//   onDelete:  () => void;
//   deleting?: boolean;
// }

// export default function ViewFooter({
//   editPath,
//   onDelete,
//   deleting = false,
// }: ViewFooterProps) {
//   const router = useRouter();

//   return (
//     <div className="sticky bottom-0 z-20 border-t border-gray-200 bg-white/95 backdrop-blur px-6 py-3 flex justify-end gap-2">
//       <Button
//         onClick={() => router.push(editPath)}
//         variant="outline"
//         className="flex items-center gap-2 text-sm"
//       >
//         <Pencil size={14} /> Edit
//       </Button>

//       <Button
//         onClick={onDelete}
//         disabled={deleting}
//         variant="destructive"
//         className="flex items-center gap-2 text-sm"
//       >
//         <Trash2 size={14} /> Delete
//       </Button>
//     </div>
//   );
// }
// app/utilsComponents/ViewFooterActions.tsx
"use client";

import { useRouter }    from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { Button }       from "@/components/ui/button";

interface ViewFooterActionsProps {
  editPath:  string;
  onDelete?:  () => void;
  deleting?: boolean;
}

export default function ViewFooterActions({
  editPath,
  onDelete,
  deleting = false,
}: ViewFooterActionsProps) {
  const router = useRouter();

  return (
    <div className="sticky bottom-0 z-10 bg-white border-t shadow-md px-6 py-3 flex justify-end gap-2">
      <Button
        onClick={() => router.push(editPath)}
        variant="outline"
        className="flex items-center gap-2 text-sm"
      >
        <Pencil size={14} /> Edit
      </Button>

      <Button
        onClick={onDelete}
        disabled={deleting}
        variant="destructive"
        className="flex items-center gap-2 text-sm"
      >
        <Trash2 size={14} /> Delete
      </Button>
    </div>
  );
}