"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import BackPanel from "@/app/utilsComponents/BackPanel";
import { Button } from "@/components/ui/button";
import PageHeader from "@/app/utilsComponents/PageHeader";
import { PAGE_SIZE, listRowNumber } from "@/app/config/pagination";
import {
  useTaxMasters,
} from "@/app/hooks/masterHooks/taxMasterHook/useTaxMaster";

const TaxMasterPage = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useTaxMasters({
    page,
    search,
    limit: PAGE_SIZE,
  });

  const handleCreate = () => router.push("/master/taxMaster/add");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  if (isLoading) {
    return (
      <BackPanel>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400 text-sm">Loading tax masters...</p>
        </div>
      </BackPanel>
    );
  }

  if (isError) {
    return (
      <BackPanel>
        <div className="flex items-center justify-center h-64">
          <p className="text-red-400 text-sm">Failed to load tax masters. Try again.</p>
        </div>
      </BackPanel>
    );
  }

  const taxMasters = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.page ?? 1;

  return (
    <BackPanel>
      <div className="p-6 space-y-6">
        <PageHeader
          title="Tax Master"
          description="Manage GST tax slabs"
          actionLabel="Add Tax Master"
          onAction={handleCreate}
          btnClassName="px-4 py-2 rounded-md bg-black text-white text-sm hover:bg-gray-800"
        />

        <div className="bg-white rounded-lg p-4 flex flex-wrap gap-3 items-center shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input
              placeholder="Search tax masters..."
              value={search}
              onChange={handleSearch}
              className="w-full max-w-sm h-10 pl-9 pr-3 border rounded-md text-sm focus:ring-2 focus:ring-black outline-none"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="text-left px-5 py-3 font-semibold">#</th>
                <th className="text-left px-5 py-3 font-semibold">Name</th>
                <th className="text-left px-5 py-3 font-semibold">GST %</th>
              </tr>
            </thead>
            <tbody>
              {taxMasters.length > 0 ? (
                taxMasters.map((tax, index) => (
                  <tr
                    key={tax._id}
                    onClick={() => router.push(`/master/taxMaster/${tax._id}`)}
                    className="border-t hover:bg-gray-50 transition cursor-pointer"
                  >
                    <td className="px-5 py-4 text-gray-400">
                      {listRowNumber(page, index)}
                    </td>
                    <td className="px-5 py-4 font-medium text-gray-800">{tax.name}</td>
                    <td className="px-5 py-4 text-gray-500">{tax.taxPercent}%</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-10 text-gray-400">
                    {search ? `No tax master found for "${search}"` : "No tax master yet"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex justify-between items-center p-4 border-t text-sm">
            <p className="text-gray-500">
              Showing {taxMasters.length} of {total} tax masters
            </p>
            <div className="flex gap-2 items-center">
              <Button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded-md hover:bg-gray-50 disabled:opacity-40"
              >
                Prev
              </Button>
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

export default React.memo(TaxMasterPage);
