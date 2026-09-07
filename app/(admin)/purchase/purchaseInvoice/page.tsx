"use client";

import React, { useState } from "react";
import { Pencil, Trash2, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import BackPanel from "@/app/utilsComponents/BackPanel";
import { Button } from "@/components/ui/button";
import PageHeader from "@/app/utilsComponents/PageHeader";
import ReportExport from "@/app/utilsComponents/ReportExport";
import { ListFilterBar } from "@/app/utilsComponents/report-ui";
import { usePurchaseInvoices } from "@/app/hooks/purchaseHooks/usePurchaseInvoice";
import { logger } from "../../../utilsComponents/console";
import { formatDate } from "../../../utilsComponents/DateFormat";
import { PAGE_SIZE, listRowNumber } from "@/app/config/pagination";

const PurchaseInvoice = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = usePurchaseInvoices({ page, search, limit: PAGE_SIZE });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  if (isLoading) {
    return (
      <BackPanel>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400 text-sm">Loading purchase invoices...</p>
        </div>
      </BackPanel>
    );
  }

  if (isError) {
    return (
      <BackPanel>
        <div className="flex items-center justify-center h-64">
          <p className="text-red-400 text-sm">Failed to load invoices. Try again.</p>
        </div>
      </BackPanel>
    );
  }

  const purchaseInvoices = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  logger("data", purchaseInvoices);

  return (
    <BackPanel>
      <div className="p-6 space-y-6">
        {/* Header */}
        <PageHeader
          title="Purchase Invoices"
          description="Manage your purchase invoices"
          actionLabel="Add Invoice"
          onAction={() => router.push("/purchase/purchaseInvoice/add")}
          btnClassName="px-4 py-2 rounded-md bg-black text-white text-sm hover:bg-gray-800"
        />

        <ListFilterBar
          trailing={<ReportExport variant="inline" reportType="purchase" params={{ search }} />}
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input
              placeholder="Search purchase invoices..."
              value={search}
              onChange={handleSearch}
              className="h-10 w-full max-w-sm rounded-md border pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </ListFilterBar>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="text-left px-5 py-3 font-semibold">#</th>
                <th className="text-left px-5 py-3 font-semibold">Purchase Date</th>
                <th className="text-left px-5 py-3 font-semibold">Invoice Number</th>
                <th className="text-left px-5 py-3 font-semibold">Vendor</th>
                <th className="text-left px-5 py-3 font-semibold">Warehouse</th>
              </tr>
            </thead>
            <tbody>
              {purchaseInvoices.length > 0 ? (
                purchaseInvoices.map((invoice, index) => (
                  <tr
                    key={invoice._id}
                    onClick={() => router.push(`/purchase/purchaseInvoice/${invoice._id}`)}
                    className="border-t hover:bg-gray-50 transition cursor-pointer"
                  >
                    <td className="px-5 py-4 text-gray-400">
                      {listRowNumber(page, index)}
                    </td>
                    <td className="px-5 py-4 text-gray-500">
                      {formatDate(invoice.purchaseDate) || "—"}
                    </td>
                    <td className="px-5 py-4 font-medium text-gray-800">
                      {invoice.invoiceNo}
                    </td>
                    <td className="px-5 py-4 font-medium text-gray-800">{invoice?.vendorId?.name}</td>
                    <td className="px-5 py-4 font-medium text-gray-800">{invoice?.warehouseId?.name}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400">
                    {search ? `No invoice found for "${search}"` : "No invoice yet"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center p-4 border-t text-sm">
            <p className="text-gray-500">
              Showing {purchaseInvoices.length} of {total} invoices
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
                  className={`px-3 py-1 rounded-md border ${page === i + 1 ? "bg-black text-white" : "hover:bg-gray-50"
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

export default React.memo(PurchaseInvoice);
