"use client";

import Link from "next/link";
import { ShoppingCart, Truck } from "lucide-react";

export default function QuickActionFab() {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      <Link
        href="/sales/salesInvoice/add"
        className="group flex items-center gap-2 rounded-full bg-[#3B82F6] pl-4 pr-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/30 hover:bg-[#2563EB] transition-all hover:scale-105"
      >
        <ShoppingCart className="h-4 w-4" />
        Add Sale
      </Link>
      <Link
        href="/purchase/purchaseInvoice/add"
        className="group flex items-center gap-2 rounded-full bg-[#00D1C1] pl-4 pr-5 py-3 text-sm font-semibold text-[#1E2235] shadow-lg shadow-cyan-900/20 hover:bg-[#00B8AA] transition-all hover:scale-105"
      >
        <Truck className="h-4 w-4" />
        Add Purchase
      </Link>
    </div>
  );
}
