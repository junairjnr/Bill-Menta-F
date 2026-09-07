// "use client";

// import Navbar from "./mainComponents/NavbBar";
// import Sidebar from "./mainComponents/SideBar";

// export default function DomainLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="h-screen w-full overflow-hidden flex flex-col">
//       {/* Navbar (fixed height) */}
//       <div className="h-16 shrink-0 shadow bg-white z-50">
//         <Navbar />
//       </div>

//       {/* Body */}
//       <div className="flex flex-1 overflow-hidden">
//         {/* Sidebar (fixed height, independent scroll if needed) */}
//         {/* <div className="h-full overflow-y-auto  bg-white"> */}
//         <div className="h-full bg-white">
//           <Sidebar />
//         </div>

//         {/* Main Content (ONLY this scrolls) */}
//         <main className="flex-1 overflow-y-auto p-1">{children}</main>
//       </div>
//     </div>
//   );
// }
"use client";

import Navbar from "./mainComponents/NavbBar";
import Sidebar from "./mainComponents/SideBar";
import { useActiveFY } from "@/app/hooks/financialYearHook/useFinancialYear";
import PermissionGuard from "@/app/utilsComponents/PermissionGuard";
import { useAuthStore } from "@/app/store/auth/auth.store";
import { useEffect } from "react";

export default function DomainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useActiveFY();
  const loadAuth = useAuthStore((s) => s.loadAuth);

  useEffect(() => {
    loadAuth();
  }, [loadAuth]);

  return (
    <div className="h-screen w-full flex overflow-hidden">
      <div className="h-full overflow-hidden bg-white shadow shrink-0">
        <Sidebar />
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="h-16 shrink-0 shadow bg-white z-50">
          <Navbar />
        </div>

        <main className="flex-1 overflow-y-auto p-2">
          <PermissionGuard>{children}</PermissionGuard>
        </main>
      </div>
    </div>
  );
}