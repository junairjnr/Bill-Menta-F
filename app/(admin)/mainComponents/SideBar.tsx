// // "use client";

// // import { useState } from "react";
// // // import { Link } from "react-router-dom";
// // import {
// //   Menu,
// //   X,
// //   ChevronRight,
// //   ChevronDown,
// //   Box,
// //   Mail,
// //   MessageSquare,
// //   FileText,
// //   Shield,
// //   Hash,
// // } from "lucide-react";
// // import SideMenuIcon from "../../utils/SideIcon";
// // import Link from "next/link";
// // import { usePathname } from "next/navigation";

// // interface MenuItem {
// //   name: string;
// //   path?: string;
// //   icon: React.ReactNode;
// //   subMenu?: { name: string; path: string; icon?: React.ReactNode }[];
// // }

// // interface Section {
// //   title: string;
// //   items: MenuItem[];
// // }

// // const sections: Section[] = [
// //   {
// //     title: "MAIN",
// //     items: [{ name: "Dashboard", path: "/dashboard", icon: <SideMenuIcon /> }],
// //   },
// //   {
// //     title: "WEB APPS",
// //     items: [
// //       {
// //         name: "Masters",
// //         icon: <SideMenuIcon />,
// //         subMenu: [
// //           {
// //             name: "Product",
// //             path: "/master/product",
// //             icon: <SideMenuIcon />,
// //           },
// //           {
// //             name: "Customer",
// //             path: "/master/customer",
// //             icon: <SideMenuIcon />,
// //           },
// //         ],
// //       },
// //     ],
// //   },
// //   // add more sections as needed
// // ];

// // export default function Sidebar() {
// //   const [collapsed, setCollapsed] = useState(false);
// //   const [hovered, setHovered] = useState(false);
// //   const [openMenu, setOpenMenu] = useState<string | null>(null);

// //   const pathname = usePathname();

// //   const isExpanded = !collapsed || hovered;

// //   const toggleMenu = (menuName: string) => {
// //     setOpenMenu(openMenu === menuName ? null : menuName);
// //   };

// //   const isSubMenuActive = (subMenu: any[]) => {
// //     return subMenu.some((sub) => pathname.startsWith(sub.path));
// //   };

// //   return (
// //     <aside className="bg-white h-screen flex  flex-col transition-all duration-500">
// //       {/* Header */}
// //       <div
// //         className={`${
// //           collapsed ? "w-16" : "w-48"
// //         } flex items-center justify-between px-4 py-3 transition-all duration-500`}
// //       >
// //         {!collapsed && (
// //           <h1 className="flex items-center gap-2 text-lg font-bold text-blue-900">
// //             {/* <img
// //               src="/images/logo.png"
// //               alt="Logo"
// //               className="w-10 h-10 object-contain"
// //             /> */}
// //             <span className="text-black">ENTERPRISES</span>
// //           </h1>
// //         )}
// //         <button
// //           onClick={() => setCollapsed(!collapsed)}
// //           className="text-gray-600"
// //         >
// //           {collapsed ? <X size={20} /> : <Menu size={20} />}
// //         </button>
// //       </div>

// //       {/* Navigation */}
// //       <div
// //         className={`flex-1 transition-all duration-500 ${
// //           isExpanded ? "w-52" : "w-16"
// //         }`}
// //         onMouseEnter={() => setHovered(true)}
// //         onMouseLeave={() => setHovered(false)}
// //       >
// //         <nav className="h-full overflow-y-auto px-2 py-4 space-y-4">
// //           {sections.map((section, sIdx) => (
// //             <div key={sIdx}>
// //               {/* Section heading or dot */}
// //               <div className="px-2 mb-1">
// //                 {isExpanded ? (
// //                   <span className="text-[11px] font-semibold text-[#7987a1] tracking-wider">
// //                     {section.title}
// //                   </span>
// //                 ) : (
// //                   <span className="flex justify-center mr-3">
// //                     <span className="w-1.5 h-1.5 bg-[#7987a1] rounded-full"></span>
// //                   </span>
// //                 )}
// //               </div>

// //               <ul className="space-y-1 text-sm">
// //                 {section.items.map((item, idx) => (
// //                   <li key={idx}>
// //                     {item.subMenu ? (
// //                       <>
// //                         <button
// //                           onClick={() => toggleMenu(item.name)}
// //                           className="w-full flex items-center justify-between px-2 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition"
// //                         >
// //                           <span className="flex items-center gap-2">
// //                             {/* {item.icon} */}
// //                             {isExpanded && <span>{item.name}</span>}
// //                           </span>
// //                           {isExpanded ? (
// //                             openMenu === item.name || isSubMenuActive(item.subMenu || []) ? (
// //                               <ChevronDown
// //                                 size={14}
// //                                 className="text-gray-500"
// //                               />
// //                             ) : (
// //                               <ChevronRight
// //                                 size={14}
// //                                 className="text-gray-400"
// //                               />
// //                             )
// //                           ) : null}
// //                         </button>
// //                         {isExpanded && openMenu === item.name && (
// //                           <ul className="ml-6 mt-1 space-y-1">
// //                             {item.subMenu.map((sub, subIdx) => (
// //                               <li key={subIdx}>
// //                                 <Link
// //                                   href={sub.path}
// //                                   className="flex items-center gap-2 px-2 py-1 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition"
// //                                 >
// //                                   {/* {sub.icon} */}
// //                                   {sub.name}
// //                                 </Link>
// //                               </li>
// //                             ))}
// //                           </ul>
// //                         )}
// //                       </>
// //                     ) : (
// //                       <Link
// //                         href={item.path || "#"}
// //                         className="flex items-center gap-2 px-2 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition"
// //                       >
// //                         {/* {item.icon} */}
// //                         {isExpanded && item.name}
// //                       </Link>
// //                     )}
// //                   </li>
// //                 ))}
// //               </ul>
// //             </div>
// //           ))}
// //         </nav>
// //       </div>
// //     </aside>
// //   );
// // }

// "use client";

// import { useState, useEffect } from "react";
// import { Menu, X, ChevronRight, ChevronDown } from "lucide-react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";

// interface MenuItem {
//   name: string;
//   path?: string;
//   subMenu?: { name: string; path: string }[];
// }

// interface Section {
//   title: string;
//   items: MenuItem[];
// }

// const sections: Section[] = [
//   {
//     title: "MAIN",
//     items: [{ name: "Dashboard", path: "/dashboard" }],
//   },
//   {
//     title: "WEB APPS",
//     items: [
//       {
//         name: "Masters",
//         subMenu: [
//           { name: "Product", path: "/master/product" },
//           { name: "Customer", path: "/master/customer" },
//         ],
//       },
//     ],
//   },
// ];

// export default function Sidebar() {
//   const [collapsed, setCollapsed] = useState(false);
//   const [openMenu, setOpenMenu] = useState<string | null>(null);

//   const pathname = usePathname();

//   // 🔥 Auto open correct menu on refresh / route change
//   // useEffect(() => {
//   //   sections.forEach((section) => {
//   //     section.items.forEach((item) => {
//   //       if (item.subMenu) {
//   //         const isActive = item.subMenu.some((sub) =>
//   //           pathname.startsWith(sub.path)
//   //         );
//   //         if (isActive) {
//   //           setOpenMenu(item.name);
//   //         }
//   //       }
//   //     });
//   //   });
//   // }, [pathname]);
//   useEffect(() => {
//     sections.forEach((section) => {
//       section.items.forEach((item) => {
//         if (item.subMenu) {
//           const isActive = item.subMenu.some((sub) =>
//             pathname.startsWith(sub.path)
//           );
//           if (isActive) {
//             setOpenMenu(item.name);
//           }
//         }
//       });
//     });
//   }, [pathname]);

//   const toggleMenu = (menuName: string) => {
//     setOpenMenu((prev) => (prev === menuName ? null : menuName));
//   };

//   return (
//     <aside className="bg-white h-screen flex flex-col">
//       {/* Header */}
//       <div
//         className={`${
//           collapsed ? "w-16" : "w-52"
//         } flex items-center justify-between px-4 py-3`}
//       >
//         {!collapsed && (
//           <h1 className="text-lg font-bold text-black">ENTERPRISES</h1>
//         )}

//         <button onClick={() => setCollapsed(!collapsed)}>
//           {collapsed ? <X size={20} /> : <Menu size={20} />}
//         </button>
//       </div>

//       {/* Navigation */}
//       <div className={`${collapsed ? "w-16" : "w-52"} flex-1`}>
//         <nav className="px-2 py-4 space-y-4">
//           {sections.map((section, sIdx) => (
//             <div key={sIdx}>
//               {/* Section title */}
//               {!collapsed && (
//                 <span className="text-xs text-gray-400 px-2">
//                   {section.title}
//                 </span>
//               )}

//               <ul className="space-y-1 mt-2">
//                 {section.items.map((item, idx) => {
//                   const isSubActive = item.subMenu?.some((sub) =>
//                     pathname.startsWith(sub.path)
//                   );

//                   return (
//                     <li key={idx}>
//                       {item.subMenu ? (
//                         <>
//                           <button
//                             onClick={() => toggleMenu(item.name)}
//                             className={`w-full flex justify-between px-2 py-2 rounded-md ${
//                               isSubActive
//                                 ? "bg-gray-100 text-green-600"
//                                 : "text-gray-700 hover:bg-gray-100"
//                             }`}
//                           >
//                             {!collapsed && item.name}

//                             {!collapsed &&
//                               (openMenu === item.name ? (
//                                 <ChevronDown size={14} />
//                               ) : (
//                                 <ChevronRight size={14} />
//                               ))}
//                           </button>

//                           {/* Submenu */}
//                           {!collapsed && openMenu === item.name && (
//                             <ul className="ml-4 mt-1 space-y-1">
//                               {item.subMenu.map((sub, subIdx) => {
//                                 const isActive = pathname === sub.path;

//                                 return (
//                                   <li key={subIdx}>
//                                     <Link
//                                       href={sub.path}
//                                       className={`block px-2 py-1 rounded-md ${
//                                         isActive
//                                           ? "text-white bg-green-600"
//                                           : "text-gray-600 hover:bg-gray-50"
//                                       }`}
//                                     >
//                                       {sub.name}
//                                     </Link>
//                                   </li>
//                                 );
//                               })}
//                             </ul>
//                           )}
//                         </>
//                       ) : (
//                         <Link
//                           href={item.path || "#"}
//                           className={`block px-2 py-2 rounded-md ${
//                             pathname === item.path
//                               ? "bg-gray-100 text-blue-600"
//                               : "text-gray-700 hover:bg-gray-100"
//                           }`}
//                         >
//                           {!collapsed && item.name}
//                         </Link>
//                       )}
//                     </li>
//                   );
//                 })}
//               </ul>
//             </div>
//           ))}
//         </nav>
//       </div>
//     </aside>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { X, Menu, ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sections } from "../../utilsComponents/SideSection";
import { colors } from "../../utilsComponents/Colors";
import { logger } from "../../utilsComponents/console";
import { motion, AnimatePresence } from "framer-motion";
import { usePermissions } from "@/app/hooks/usePermissions";
import { ViewPermissionKey } from "@/app/config/permissions";

export const skynetClient = {
  id: "skynet",
  name: "Skynet Solution",
  tagline: "Qatar",
  siteUrl: "https://www.skynetqatar.com/",
  phone: "+974 4431 1525",
  theme: {
    bg: "#FFFFFF",
    bgSoft: "#FAF8F3",
    primary: "#111827",
    primaryMid: "#8B6B1F",
    primaryLight: "#D4A63A",
    accent: "#B88A2A",
    accentHover: "#8B6B1F",
    accentSoft: "#FFF9F0",
    accentLight: "#E8C978",
    muted: "#6B7280",
    border: "#E5E7EB",
  },
};

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const { canView, isSuperAdmin, permissions } = usePermissions();

  const pathname = usePathname();

  const canShowItem = (permissionKey?: ViewPermissionKey, superAdminOnly?: boolean) => {
    if (superAdminOnly && !isSuperAdmin) return false;
    if (!permissionKey) return !superAdminOnly || isSuperAdmin;
    return canView(permissionKey);
  };

  const filteredSections = sections
    .map((section) => ({
      ...section,
      items: section.items
        .map((item) => {
          if (item.subMenu) {
            const subMenu = item.subMenu.filter((sub) =>
              canShowItem(sub.permissionKey, sub.superAdminOnly)
            );
            if (!subMenu.length) return null;
            return { ...item, subMenu };
          }
          if (!canShowItem(item.permissionKey, item.superAdminOnly)) return null;
          return item;
        })
        .filter(Boolean) as typeof section.items,
    }))
    .filter((section) => section.items.length > 0);

  const isExpanded = !collapsed || hovered;

  // ✅ Better matching for nested routes
  const isPathActive = (basePath: string) => {
    return pathname === basePath || pathname.startsWith(basePath + "/");
  };

  const isSubMenuActive = (subMenu: any[]) => {
    return subMenu.some((sub) => isPathActive(sub.path));
  };

  // Auto-open the menu group that contains the current route
  useEffect(() => {
    for (const section of filteredSections) {
      for (const item of section.items) {
        if (item.subMenu && isSubMenuActive(item.subMenu)) {
          setOpenMenu(item.name);
          return;
        }
      }
    }
  }, [pathname, permissions, isSuperAdmin]);
  useEffect(() => {
    logger("open", openMenu);
  }, [openMenu]);

  const toggleMenu = (menuName: string) => {
    setOpenMenu((prev) => (prev === menuName ? null : menuName));
  };

  return (
    <aside className="bg-white h-full flex flex-col overflow-hidden transition-all duration-500">
      {/* Header */}
      <div
        className={`shrink-0 ${
          collapsed ? "w-16" : "w-48"
        } flex items-center justify-between px-4 py-3 transition-all duration-500`}
      >
        {!collapsed && (
          <h1 className="flex items-center gap-2 text-lg font-bold text-blue-900">
            <span className="text-emerald-900">BROSCO™</span>
            {/* <span className="text-emerald-300">SKYNET™</span> */}
          </h1>
          // <motion.button
          //   type="button"
          //   onClick={() => window.open(skynetClient.siteUrl, "_blank")}
          //   className="flex shrink-0 cursor-pointer flex-col items-start border-0 bg-transparent p-0"
          //   whileHover={{ scale: 1.03 }}
          //   whileTap={{ scale: 0.97 }}
          // >
          //   <span className="font-display text-[20px] font-extrabold leading-none tracking-tight text-gray-900 sm:text-[22px]">
          //     {skynetClient.name.split(" ")[0]}
          //     <span className="text-[11px] font-black text-gray-400">™</span>
          //   </span>
          //   <span className="hidden font-eyebrow text-[7px] tracking-[0.22em] text-gray-400 sm:block">
          //     {skynetClient.tagline}
          //   </span>
          // </motion.button>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-600"
        >
          {collapsed ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <div
        className={`flex-1 min-h-0 overflow-hidden transition-all duration-500 ${
          isExpanded ? "w-48" : "w-16"
        }`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <nav className="sidebar-scrollbar h-full overflow-y-auto overscroll-contain px-2 py-4 pb-20 space-y-4">
          {filteredSections.map((section, sIdx) => (
            <div key={sIdx}>
              {/* Section heading */}
              <div className="px-2 mb-1">
                {isExpanded ? (
                  <span className="text-[11px] font-semibold text-[#7987a1] tracking-wider">
                    {section.title}
                  </span>
                ) : (
                  <span className="flex justify-center mr-3">
                    <span className="w-1.5 h-1.5 bg-[#7987a1] rounded-full"></span>
                  </span>
                )}
              </div>

              <ul className="space-y-1 text-sm">
                {section.items.map((item, idx) => {
                  const isParentActive = item.subMenu
                    ? isSubMenuActive(item.subMenu)
                    : isPathActive(item.path || "");

                  return (
                    <li key={idx}>
                      {item.subMenu ? (
                        <>
                          <button
                            onClick={() => toggleMenu(item.name)}
                            className={`w-full flex items-center justify-between px-2 py-2 rounded-md transition ${
                              isParentActive && isExpanded
                                ? `${colors.mainColor} text-white`
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              {/* {item.icon} */}
                              {/* {isExpanded && <span>{item.name}</span>} */}
                              <span className="flex items-center gap-2">
                                {item.icon}
                                {isExpanded && <span>{item.name}</span>}
                              </span>
                            </span>

                            {isExpanded &&
                              (openMenu === item.name || isParentActive ? (
                                <ChevronDown size={14} />
                              ) : (
                                <ChevronRight size={14} />
                              ))}
                          </button>

                          {/* Submenu — show when toggled open or when a child route is active */}
                          {isExpanded && (openMenu === item.name || isParentActive) && (
                            <ul className="ml-6 mt-1 space-y-1">
                              {item.subMenu.map((sub, subIdx) => {
                                const isActive = isPathActive(sub.path);

                                return (
                                  <li key={subIdx}>
                                    <Link
                                      href={sub.path}
                                      className={`flex items-center gap-2 px-2 py-1 text-[12px] rounded-md transition ${
                                        isActive
                                          ? `text-white ${colors.mainColor}`
                                          : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                                      }`}
                                    >
                                      {sub.icon}
                                      {sub.name}
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </>
                      ) : (
                        <Link
                          href={item.path || "#"}
                          className={`flex items-center gap-2 px-2 py-2 rounded-md transition ${
                            isPathActive(item.path || "")
                              ? `${colors.mainColor} text-white`
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {item.icon}
                          {isExpanded && item.name}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
