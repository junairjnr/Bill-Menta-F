"use client";

import Link from "next/link";
import CommandSearch from "@/app/utilsComponents/CommandSearch";
import {
  Bell,
  User,
  Edit3,
  RefreshCcw,
  LogOut,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { sections } from "../../utilsComponents/SideSection";
import { useLogout } from "@/app/hooks/authHook/useAuth";
import { logger } from "../../utilsComponents/console";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const logout = useLogout();
  const handleLogout = () => {
    logger("Logging out user...");
    logout();
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="w-full flex items-center justify-between bg-white px-6 py-2  border-gray-200 relative">
      {/* 🔍 Search Bar */}
      <div className="flex items-center  px-3 py-2 w-1/3 rounded-md">
        <CommandSearch sections={sections} />
        {/* <input
          type="text"
          placeholder="Search here..."
          className="ml-2 w-full outline-none text-gray-600 placeholder-gray-400"
        /> */}
      </div>

      {/* Quick actions + profile */}
      <div className="flex items-center gap-4">
        <Link
          href="/sales/salesInvoice/add"
          className="hidden sm:flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-800 transition-colors"
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          Add Sale
        </Link>
        <Link
          href="/purchase/purchaseInvoice/add"
          className="hidden sm:flex items-center gap-1.5 rounded-lg bg-blue-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-800 transition-colors"
        >
          <Truck className="h-3.5 w-3.5" />
          Add Purchase
        </Link>

        {/* 🔔 Notification with Dot */}
        <div className="relative">
          <Bell className="text-gray-600 cursor-pointer" size={22} />
          <span className="absolute top-0 right-0 bg-red-500 w-2 h-2 rounded-full"></span>
        </div>

        {/* 🧑 Profile */}
        <div
          ref={dropdownRef}
          className="flex items-center cursor-pointer relative"
          onClick={() => setOpen(!open)}
        >
          <User className="w-6 h-6 mb-1 rounded-full border-2 border-gray-600 text-gray-600" />
          {/* <span className="ml-2 text-gray-700">Profile</span> */}

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-lg border border-gray-100">
              {/* User Info */}
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-800">
                  Amiah Burton
                </p>
                <p className="text-xs text-gray-500 ">amiahburton@gmail.com</p>
              </div>

              {/* Menu Items */}
              <div className="flex flex-col p-2">
                <button className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 text-sm text-gray-700">
                  <User size={16} /> Profile
                </button>
                <button className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 text-sm text-gray-700">
                  <Edit3 size={16} /> Change Password
                </button>
                <button className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 text-sm text-gray-700">
                  <RefreshCcw size={16} /> Switch User
                </button>
                <button onClick={logout} className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-red-50 text-sm text-red-600">
                  <LogOut size={16} /> Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
