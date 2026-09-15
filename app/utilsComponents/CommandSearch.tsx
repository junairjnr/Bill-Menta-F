// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useRouter } from "next/navigation";
// import { CommandDialog, CommandInput, CommandList, CommandGroup, CommandItem, CommandEmpty } from "@/components/ui/command";
// import { Search } from "lucide-react";

// interface Item {
//   name: string;
//   path?: string;
//   icon?: React.ReactNode;
//   subMenu?: Item[];
// }

// interface Section {
//   title: string;
//   items: Item[];
// }

// export default function CommandSearch({ sections }: { sections: Section[] }) {
//   const [open, setOpen] = useState(false);
//   const router = useRouter();

//   // ⌘K shortcut
//   useEffect(() => {
//     const down = (e: KeyboardEvent) => {
//       if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
//         e.preventDefault();
//         setOpen((prev) => !prev);
//       }
//     };
//     document.addEventListener("keydown", down);
//     return () => document.removeEventListener("keydown", down);
//   }, []);

//   // 🔥 Flatten menu
//   const flatItems = useMemo(() => {
//     const result: { name: string; path: string; icon?: React.ReactNode; group: string }[] = [];

//     sections.forEach((section) => {
//       section.items.forEach((item) => {
//         if (item.subMenu) {
//           item.subMenu.forEach((sub) => {
//             if (sub.path) {
//               result.push({
//                 name: sub.name,
//                 path: sub.path,
//                 icon: sub.icon,
//                 group: section.title,
//               });
//             }
//           });
//         } else if (item.path) {
//           result.push({
//             name: item.name,
//             path: item.path,
//             icon: item.icon,
//             group: section.title,
//           });
//         }
//       });
//     });

//     return result;
//   }, [sections]);

//   return (
//     <>
//       {/* Trigger (looks like search bar) */}
//       <div
//         onClick={() => setOpen(true)}
//         className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg cursor-pointer w-64 text-sm text-gray-500 hover:bg-gray-200"
//       >
//         <Search size={16} />
//         <span>Search menu... (Ctrl + K)</span>
//       </div>

//       {/* Dialog */}
//       <CommandDialog open={open} onOpenChange={setOpen}>
//         <CommandInput placeholder="Search modules..." />

//         <CommandList>
//           <CommandEmpty>No results found.</CommandEmpty>

//           {Object.entries(
//             flatItems.reduce((acc, item) => {
//               if (!acc[item.group]) acc[item.group] = [];
//               acc[item.group].push(item);
//               return acc;
//             }, {} as Record<string, typeof flatItems>)
//           ).map(([group, items]) => (
//             <CommandGroup key={group} heading={group}>
//               {items.map((item, idx) => (
//                 <CommandItem
//                   key={idx}
//                   onSelect={() => {
//                     router.push(item.path);
//                     setOpen(false);
//                   }}
//                   className="flex items-center gap-2"
//                 >
//                   {item.icon}
//                   {item.name}
//                 </CommandItem>
//               ))}
//             </CommandGroup>
//           ))}
//         </CommandList>
//       </CommandDialog>
//     </>
//   );
// }

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";
import { Search } from "lucide-react";

interface Item {
  name: string;
  path?: string;
  icon?: React.ReactNode;
  subMenu?: Item[];
}

interface Section {
  title: string;
  items: Item[];
}

export default function CommandSearch({
  sections,
}: {
  sections: Section[];
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // ⌘K / Ctrl+K shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // 🔥 Flatten menu safely
  const flatItems = useMemo(() => {
    const result: {
      name: string;
      path: string;
      icon?: React.ReactNode;
      group: string;
    }[] = [];

    sections?.forEach((section) => {
      section.items?.forEach((item) => {
        if (item.subMenu?.length) {
          item.subMenu.forEach((sub) => {
            if (sub.path) {
              result.push({
                name: sub.name,
                path: sub.path,
                icon: sub.icon,
                group: section.title,
              });
            }
          });
        } else if (item.path) {
          result.push({
            name: item.name,
            path: item.path,
            icon: item.icon,
            group: section.title,
          });
        }
      });
    });

    return result;
  }, [sections]);

  // 🔥 Group items
  const groupedItems = useMemo(() => {
    return flatItems.reduce((acc, item) => {
      if (!acc[item.group]) acc[item.group] = [];
      acc[item.group].push(item);
      return acc;
    }, {} as Record<string, typeof flatItems>);
  }, [flatItems]);

  return (
    <>
      {/* 🔍 Trigger */}
      <div
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-white/95 px-4 py-2 rounded-full cursor-pointer w-full max-w-md text-sm text-slate-500 hover:bg-white shadow-sm ring-1 ring-white/10 transition-colors"
      >
        <Search size={16} />
        <span>Search menu... (Ctrl + K)</span>
      </div>

      {/* ✅ FIXED Dialog */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command className="bg-gray-400 text-white border border-gray-400 max-h-[500px]">
          <CommandInput placeholder="Search modules..." />

          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            {Object.entries(groupedItems).map(([group, items]) => (
              <CommandGroup key={group} heading={group}>
                {items.map((item, idx) => (
                  <CommandItem
                    key={idx}
                    value={item.name} // important for filtering
                    onSelect={() => {
                      router.push(item.path);
                      setOpen(false);
                    }}
                    className="flex items-center gap-2"
                  >
                    {item.icon}
                    {item.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}