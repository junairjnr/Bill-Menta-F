// // "use client";

// // import { Button } from "@/components/ui/button";
// // import { Pencil, Trash2 } from "lucide-react";
// // import { useRouter } from "next/navigation";
// // import { colors } from "./Colors";

// // interface Tab {
// //   key: string;
// //   label: string;
// // }

// // interface ViewTabNavProps {
// //   editPath: string;
// //   onDelete?: () => void;
// //   deleting?: boolean;
// //   tabs: Tab[];
// // }

// // export default function ViewTabNav({
// //   tabs,
// //   editPath,
// //   onDelete,
// //   deleting,
// // }: ViewTabNavProps) {
// //   const router = useRouter();

// //   const scrollTo = (key: string) => {
// //     document.getElementById(key)?.scrollIntoView({
// //       behavior: "smooth",
// //       block: "start",
// //     });
// //   };

// //   return (
// //     <div className="sticky top-0 z-10 bg-white border-b shadow-sm p-2">
// //       <div
// //         className={`sticky top-0 z-10 ${colors.mainColor} border-b shadow-sm flex justify-between text-white p-2 rounded-xl`}
// //       >
// //         <div className="flex gap-1 px-2 py-1.5 overflow-x-auto">
// //           {tabs.map((tab) => (
// //             <button
// //               key={tab.key}
// //               onClick={() => scrollTo(tab.key)}
// //               className="px-4 py-2 text-sm font-medium text-white inset-ring-4-blue-500
// //               hover:text-black hover:bg-gray-100
// //               rounded-lg transition whitespace-nowrap"
// //             >
// //               {tab.label}
// //             </button>
// //           ))}
// //         </div>
// //         <div className="flex gap-2 px-2 py-1.5">
// //           <Button
// //             onClick={() => router.push(editPath)}
// //             variant="outline"
// //             className="flex items-center gap-2 text-sm text-black hover:text-white hover:bg-gray-500"
// //           >
// //             <Pencil size={14} /> Edit
// //           </Button>

// //           <Button
// //             onClick={onDelete}
// //             disabled={deleting}
// //             variant="destructive"
// //             className="flex items-center gap-2 text-sm"
// //           >
// //             <Trash2 size={14} /> Delete
// //           </Button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// "use client";

// import { Button } from "@/components/ui/button";
// import { Pencil, Trash2 } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { colors } from "./Colors";

// interface Tab {
//   key: string;
//   label: string;
// }

// interface ViewTabNavProps {
//   editPath: string;
//   onDelete?: () => void;
//   deleting?: boolean;
//   tabs: Tab[];
// }

// export default function ViewTabNav({
//   tabs,
//   editPath,
//   onDelete,
//   deleting,
// }: ViewTabNavProps) {
//   const router = useRouter();
//   const [activeTab, setActiveTab] = useState(tabs[0]?.key || "");

//   const scrollTo = (key: string) => {
//     setActiveTab(key);
//     document.getElementById(key)?.scrollIntoView({
//       behavior: "smooth",
//       block: "start",
//     });
//   };

//   return (
//     <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
//       <div className={`${colors.mainColor} text-white`}>
//         <div className="max-w-7xl mx-auto px-6">
//           <div className="flex items-center justify-between h-16">
//             {/* Tabs */}
//             <div className="flex items-center gap-2 overflow-x-auto pb-px hide-scrollbar">
//               {tabs.map((tab) => (
//                 <button
//                   key={tab.key}
//                   onClick={() => scrollTo(tab.key)}
//                   className={`px-5 py-2 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap relative
//                     ${
//                       activeTab === tab.key
//                         ? "bg-white/20 text-white shadow-sm"
//                         : "hover:bg-white/10 text-white/90"
//                     }
//                   `}
//                 >
//                   {tab.label}
//                   {activeTab === tab.key && (
//                     <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-6 bg-white rounded-full" />
//                   )}
//                 </button>
//               ))}
//             </div>

//             {/* Action Buttons */}
//             <div className="flex items-center gap-3">
//               <Button
//                 onClick={() => router.push(editPath)}
//                 variant="outline"
//                 className="flex items-center gap-2 border-white/30 text-white hover:bg-white/10 hover:text-white hover:border-white/50 transition-all"
//                 size="sm"
//               >
//                 <Pencil size={16} />
//                 Edit
//               </Button>

//               <Button
//                 onClick={onDelete}
//                 disabled={deleting}
//                 variant="destructive"
//                 className="flex items-center gap-2 hover:bg-red-600 transition-all"
//                 size="sm"
//               >
//                 <Trash2 size={16} />
//                 Delete
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { colors } from "./Colors";

interface Tab {
  key: string;
  label: string;
}

interface ViewTabNavProps {
  editPath: string;
  onDelete?: () => void;
  deleting?: boolean;
  tabs: Tab[];
}

export default function ViewTabNav({
  tabs,
  editPath,
  onDelete,
  deleting,
}: ViewTabNavProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(tabs[0]?.key || "");

  const scrollTo = (key: string) => {
    setActiveTab(key);
    document.getElementById(key)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-lg p-4 rounded-2xl">
      <div className={`${colors.mainColor} text-white rounded-md shadow-xl p-1`}>
        <div className="max-w-7xl mx-auto px-2 py-1">
          <div className="flex items-center justify-between">
            {/* Tabs */}
            <div className="flex items-center gap-3 overflow-x-auto pb-1 hide-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => scrollTo(tab.key)}
                  className={`px-3 py-2 text-sm font-semibold rounded-md transition-all duration-200 whitespace-nowrap
                    ${
                      activeTab === tab.key
                        ? "bg-white text-gray-900 shadow-md"
                        : "hover:bg-white/20 text-white/90"
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button
                onClick={() => router.push(editPath)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 border-white/40 text-black hover:bg-white hover:text-gray-900 hover:border-white transition-all font-medium"
              >
                <Pencil size={16} />
                Edit
              </Button>

              <Button
                onClick={onDelete}
                disabled={deleting}
                variant="destructive"
                size="sm"
                className="flex items-center gap-2 font-medium bg-white"
              >
                <Trash2 size={16} />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}