"use client"

import { usePriceLevels } from "@/app/hooks/masterHooks/priceLevelHook/usePriceLevel";
import BackPanel from "@/app/utilsComponents/BackPanel";
import PageHeader from "@/app/utilsComponents/PageHeader";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { PAGE_SIZE, listRowNumber } from "@/app/config/pagination";

const PriceLevelPage = () => {
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState(1);

  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const router = useRouter();

  // ── API Hooks ───────────────────────────────────────────────
  const { data, isLoading, isError } = usePriceLevels({
    page,
    search,
    limit: PAGE_SIZE,
  });

  // ── Handlers ────────────────────────────────────────────────
  const handleCreate = () => router.push("/master/priceLevel/add");

  const handleEdit = (id: string) =>
    router.push(`/master/price-level/edit/${id}`);

  // ── Search handler ──────────────────────────────────────────
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // reset to page 1 on new search
  };

  const handleDeleteClick = (id: string) => {
    setSelectedId(id);
    setOpen(true);
  };

  // ── States ──────────────────────────────────────────────────
  if (isLoading) {
    return (
      <BackPanel>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400 text-sm">Loading price levels...</p>
        </div>
      </BackPanel>
    );
  }

  if (isError) {
    return (
      <BackPanel>
        <div className="flex items-center justify-center h-64">
          <p className="text-red-400 text-sm">
            Failed to load price levels. Try again.
          </p>
        </div>
      </BackPanel>
    );
  }

  const priceLevels = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.page ?? 1;
  return (
    <BackPanel>
      <div className="p-6 space-y-6">
        {/* ── Header ─────────────────────────────────────────── */}
        <PageHeader
          title="Price Levels"
          description="Manage your inventory Price Levels"
          actionLabel="Add Price Level"
          onAction={handleCreate}
          btnClassName="px-4 py-2 rounded-md bg-black text-white text-sm hover:bg-gray-800"
        />

        {/* ── Search Bar ─────────────────────────────────────── */}
        <div className="bg-white rounded-lg p-4 flex flex-wrap gap-3 items-center shadow-sm">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={16}
            />
            <input
              placeholder="Search uoms..."
              value={search}
              onChange={handleSearch}
              className="w-full max-w-sm h-10 pl-9 pr-3 border rounded-md text-sm focus:ring-2 focus:ring-black outline-none"
            />
          </div>
        </div>

        {/* ── Table ──────────────────────────────────────────── */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="text-left px-5 py-3 font-semibold">#</th>
                <th className="text-left px-5 py-3 font-semibold">Name</th>
                <th className="text-left px-5 py-3 font-semibold">Percent</th>
                {/* <th className="text-right px-5 py-3 font-semibold">Actions</th> */}
              </tr>
            </thead>

            <tbody>
              {priceLevels.length > 0 ? (
                priceLevels.map((priceLevel, index) => (
                  <tr
                    key={priceLevel._id}
                    onClick={() =>
                      router.push(`/master/priceLevel/${priceLevel._id}`)
                    }
                    className="border-t hover:bg-gray-50 transition cursor-pointer"
                  >
                    {/* Serial number */}
                    <td className="px-5 py-4 text-gray-400">
                      {listRowNumber(page, index)}
                    </td>

                    {/* Name */}
                    <td className="px-5 py-4 font-medium text-gray-800">
                      {priceLevel.name}
                    </td>

                    {/* Code */}
                    <td className="px-5 py-4 text-gray-500">
                      {`${priceLevel.taxPercent }`|| "—"}
                    </td>

                    {/* Actions */}
                    {/* <td className="px-5 py-4 text-right space-x-2">
                      <Button
                        onClick={() => handleEdit(uom._id)}
                        className="p-2 rounded-md border hover:bg-gray-100"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </Button>

                      <Button
                        onClick={() => handleDeleteClick(uom._id)}
                        disabled={deleting}
                        className="p-2 rounded-md border text-red-500 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </td> */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400">
                    {search ? `No uom found for "${search}"` : "No uom yet"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* ── Pagination ───────────────────────────────────── */}
          <div className="flex justify-between items-center p-4 border-t text-sm">
            <p className="text-gray-500">
              Showing {priceLevels?.length} of {total} Price Levels
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
export default React.memo(PriceLevelPage);
