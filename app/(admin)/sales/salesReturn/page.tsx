"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import BackPanel from "@/app/utilsComponents/BackPanel";
import { Button } from "@/components/ui/button";
import PageHeader from "@/app/utilsComponents/PageHeader";
import ReportExport from "@/app/utilsComponents/ReportExport";
import { ListFilterBar } from "@/app/utilsComponents/report-ui";
import { useSalesReturns } from "@/app/hooks/salesHooks/useSalesReturn";
import { formatDate } from "@/app/utilsComponents/DateFormat";
import { PAGE_SIZE, listRowNumber } from "@/app/config/pagination";

export default function SalesReturnListPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [salesType, setSalesType] = useState<"" | "retail" | "wholesale">("");

  const { data, isLoading, isError } = useSalesReturns({
    page,
    search,
    limit: PAGE_SIZE,
    salesType: salesType || undefined,
  });

  const returns = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  if (isLoading) {
    return (
      <BackPanel>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400 text-sm">Loading sales returns...</p>
        </div>
      </BackPanel>
    );
  }

  if (isError) {
    return (
      <BackPanel>
        <div className="flex items-center justify-center h-64">
          <p className="text-red-400 text-sm">Failed to load returns. Try again.</p>
        </div>
      </BackPanel>
    );
  }

  return (
    <BackPanel>
      <div className="p-6 space-y-6">
        <PageHeader
          title="Sales Returns"
          description="Manage returns against invoices or manual returns"
          actionLabel="New Return"
          onAction={() => router.push("/sales/salesReturn/add")}
          btnClassName="px-4 py-2 rounded-md bg-black text-white text-sm hover:bg-gray-800"
        />

        <ListFilterBar
          trailing={
            <ReportExport
              variant="inline"
              reportType="sales-returns"
              params={{ salesType, search }}
            />
          }
        >
          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input
              placeholder="Search by return number..."
              value={search}
              onChange={handleSearch}
              className="h-10 w-full max-w-sm rounded-md border pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div className="flex gap-2">
            {(["", "retail", "wholesale"] as const).map((type) => (
              <button
                key={type}
                onClick={() => {
                  setSalesType(type);
                  setPage(1);
                }}
                className={`rounded-md border px-4 py-2 text-sm font-medium transition ${
                  salesType === type
                    ? "border-black bg-black text-white"
                    : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {type === "" ? "All" : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </ListFilterBar>

        <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
          <table className="w-full min-w-[900px] table-fixed text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="w-12 whitespace-nowrap px-5 py-3 text-left font-semibold">#</th>
                <th className="w-28 whitespace-nowrap px-5 py-3 text-left font-semibold">Return No</th>
                <th className="w-28 whitespace-nowrap px-5 py-3 text-left font-semibold">Date</th>
                <th className="whitespace-nowrap px-5 py-3 text-left font-semibold">Original Invoice</th>
                <th className="whitespace-nowrap px-5 py-3 text-left font-semibold">Customer</th>
                <th className="w-24 whitespace-nowrap px-5 py-3 text-left font-semibold">Type</th>
                <th className="w-28 whitespace-nowrap px-5 py-3 text-right font-semibold">Amount</th>
                <th className="w-24 whitespace-nowrap px-5 py-3 text-left font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {returns.length > 0 ? (
                returns.map((ret, index) => (
                  <tr
                    key={ret._id}
                    onClick={() => router.push(`/sales/salesReturn/${ret._id}`)}
                    className="border-t hover:bg-gray-50 transition cursor-pointer"
                  >
                    <td className="px-5 py-4 text-gray-400">
                      {listRowNumber(page, index)}
                    </td>
                    <td className="px-5 py-4 font-medium text-gray-800">{ret.returnNo}</td>
                    <td className="px-5 py-4 text-gray-500">{formatDate(ret.returnDate)}</td>
                    <td className="px-5 py-4 text-gray-600">{ret.originalInvoiceNo}</td>
                    <td className="px-5 py-4 font-medium text-gray-800">
                      {ret.customerId?.name}
                    </td>
                    <td className="px-5 py-4 capitalize text-gray-500">{ret.salesType}</td>
                    <td className="px-5 py-4 text-right font-semibold">
                      ₹ {ret.grandTotal.toFixed(2)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          ret.status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {ret.status.charAt(0).toUpperCase() + ret.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-gray-400">
                    {search ? `No return found for "${search}"` : "No sales returns yet"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex justify-between items-center p-4 border-t text-sm">
            <p className="text-gray-500">
              Showing {returns.length} of {total} returns
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
}
