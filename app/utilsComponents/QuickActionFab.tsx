"use client";

import Link from "next/link";
import { ShoppingCart, Truck } from "lucide-react";

export default function QuickActionFab() {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      <Link
        href="/sales/salesInvoice/add"
        className="group flex items-center gap-2 rounded-full bg-emerald-700 pl-4 pr-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/20 hover:bg-emerald-800 transition-all hover:scale-105"
      >
        <ShoppingCart className="h-4 w-4" />
        Add Sale
      </Link>
      <Link
        href="/purchase/purchaseInvoice/add"
        className="group flex items-center gap-2 rounded-full bg-blue-700 pl-4 pr-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 hover:bg-blue-800 transition-all hover:scale-105"
      >
        <Truck className="h-4 w-4" />
        Add Purchase
      </Link>
    </div>
  );
}
