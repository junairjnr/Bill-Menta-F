"use client";

import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import BackPanel from "@/app/utilsComponents/BackPanel";
import { Button } from "@/components/ui/button";
import PageHeader from "@/app/utilsComponents/PageHeader";
import ReportExport from "@/app/utilsComponents/ReportExport";
import { ListFilterBar } from "@/app/utilsComponents/report-ui";
import { useWarehouses } from "@/app/hooks/warehouseHooks/useWarehouse";
import { useAuthStore } from "@/app/store/auth/auth.store";
import { AuthUser } from "@/app/types";
import { PAGE_SIZE, listRowNumber } from "@/app/config/pagination";

const WarehousePage = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const user = useAuthStore((s) => s.user);
  const [loginData, setLoginData] = useState<AuthUser>();

  useEffect(() => {
    const data = localStorage.getItem("USER");
    setLoginData(data ? JSON.parse(data) : null);
  }, []);

  const { data, isLoading, isError } = useWarehouses({
    page,
    search,
    limit: PAGE_SIZE,
    branchId: loginData?.branchId || user?.branchId || "",
  });

  const handleCreate = () => router.push("/master/warehouse/add");
  const handleView = (id: string) => router.push(`/master/warehouse/${id}`);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };
  if (isLoading) {
    return (
      <BackPanel>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400 text-sm">Loading warehouses...</p>
        </div>
      </BackPanel>
    );
  }

  if (isError) {
    return (
      <BackPanel>
        <div className="flex items-center justify-center h-64">
          <p className="text-red-400 text-sm">
            Failed to load categories. Try again.
          </p>
        </div>
      </BackPanel>
    );
  }

  const warehouses = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.page ?? 1;

  return (
    <BackPanel>
      <div className="p-6 space-y-6">
        {/* ── Header ─────────────────────────────────────────── */}
        <PageHeader
          title="Warehouses"
          description="Manage your inventory warehouses"
          actionLabel="Add Warehouse"
          onAction={handleCreate}
          btnClassName="px-4 py-2 rounded-md bg-black text-white text-sm hover:bg-gray-800"
        />

        <ListFilterBar trailing={<ReportExport variant="inline" reportType="warehouses" params={{ search }} />}>
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={16}
            />
            <input
              placeholder="Search warehouses..."
              value={search}
              onChange={handleSearch}
              className="h-10 w-full max-w-sm rounded-md border pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </ListFilterBar>

        {/* ── Table ──────────────────────────────────────────── */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="text-left px-5 py-3 font-semibold">#</th>
                <th className="text-left px-5 py-3 font-semibold">Name</th>
                <th className="text-left px-5 py-3 font-semibold">Code</th>
                <th className="text-left px-5 py-3 font-semibold">
                  Description
                </th>
                <th className="text-left px-5 py-3 font-semibold">IsDefault</th>
              </tr>
            </thead>

            <tbody>
              {warehouses.length > 0 ? (
                warehouses.map((warehouse, index) => (
                  <tr
                    key={warehouse._id}
                    onClick={() => handleView(warehouse._id)}
                    className="border-t hover:bg-gray-50 transition cursor-pointer"
                  >
                    {/* Serial number */}
                    <td className="px-5 py-4 text-gray-400">
                      {listRowNumber(page, index)}
                    </td>

                    {/* Name */}
                    <td className="px-5 py-4 font-medium text-gray-800">
                      {warehouse.name}
                    </td>

                    {/* Code */}
                    <td className="px-5 py-4 text-gray-500">
                      {warehouse.code || "—"}
                    </td>
                    {/* Description */}
                    <td className="px-5 py-4 text-gray-500">
                      {warehouse.description || "—"}
                    </td>
                    {/* default */}
                    <td className="px-5 py-4 text-gray-500">
                      {warehouse.isDefault ? "Yes" : "No"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400">
                    {search
                      ? `No warehouses found for "${search}"`
                      : "No warehouses yet"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* ── Pagination ───────────────────────────────────── */}
          <div className="flex justify-between items-center p-4 border-t text-sm">
            <p className="text-gray-500">
              Showing {warehouses?.length} of {total} Warehouses
            </p>

            <div className="flex gap-2 items-center">
              {/* Prev */}
              <Button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded-md hover:bg-gray-50 disabled:opacity-40"
              >
                Prev
              </Button>

              {/* Page numbers */}
              {[...Array(totalPages)].map((_, i) => (
                <Button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 rounded-md border ${
                    page === i + 1 ? "bg-black text-white" : "hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </Button>
              ))}

              {/* Next */}
              <Button
                onClick={() => setPage((p) => p + 1)}
                disabled={!data?.hasNext}
                className="px-3 py-1 border rounded-md hover:bg-gray-50 disabled:opacity-40"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </BackPanel>
  );
};

export default React.memo(WarehousePage);
