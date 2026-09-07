"use client";

import BackPanel from "@/app/utilsComponents/BackPanel";
import AdminDashboard from "@/app/(admin)/mainComponents/dashboard/AdminDashboard";
import QuickActionFab from "@/app/utilsComponents/QuickActionFab";

export default function DashboardPage() {
  return (
    <>
      <BackPanel showBack={false}>
        <AdminDashboard />
      </BackPanel>
      <QuickActionFab />
    </>
  );
}
