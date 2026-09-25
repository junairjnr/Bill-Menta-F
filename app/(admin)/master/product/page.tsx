"use client";

import React, { useState } from "react";
import { Pencil, Trash2, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import BackPanel from "@/app/utilsComponents/BackPanel";
import { Button } from "@/components/ui/button";
import PageHeader from "@/app/utilsComponents/PageHeader";
import ReportExport from "@/app/utilsComponents/ReportExport";
import { ListFilterBar } from "@/app/utilsComponents/report-ui";
import { PAGE_SIZE, listRowNumber } from "@/app/config/pagination";
import {
  useItems,
  useDeleteItem,
} from "@/app/hooks/masterHooks/itemHook/useItem";
import { itemPurchaseRate, itemSalesRate } from "@/app/utils/itemRates";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ProductPage = () => {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // ✅ API Hooks
  const { data, isLoading, isError } = useItems({
    page,
    search,
    limit: PAGE_SIZE,
  });

  const { mutate: remove, isPending: deleting } = useDeleteItem();

  // ✅ Handlers
  const handleCreate = () => router.push("/master/product/add");

  const handleEdit = (id: string) => router.push(`/master/product/edit/${id}`);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleDeleteClick = (id: string) => {
    setSelectedId(id);
    setOpen(true);
  };

  const confirmDelete = () => {
    if (selectedId) remove(selectedId);
    setOpen(false);
    setSelectedId(null);
  };

  // ✅ States
  if (isLoading) {
    return (
      <BackPanel>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-400 text-sm">Loading products...</p>
        </div>
      </BackPanel>
    );
  }

  if (isError) {
    return (
      <BackPanel>
        <div className="flex justify-center items-center h-64">
          <p className="text-red-400 text-sm">Failed to load products</p>
        </div>
      </BackPanel>
    );
  }

  const items = data?.data ?? [];
  const total = data?.total ?? 0;
  // const totalPages = data?.page ?? 1;
  const totalPages = data?.totalPages ?? 1;

  return (
    <BackPanel>
      <div className="p-6 space-y-6">
        {/* 🔷 Header */}
        <PageHeader
          title="Products"
          description="Manage your inventory and products"
          actionLabel="Add Product"
          onAction={handleCreate}
          btnClassName="px-4 py-2 bg-black text-white rounded-md text-sm"
        />

        {/* 🔷 Search */}
        <ListFilterBar trailing={<ReportExport variant="inline" reportType="products" params={{ search }} />}>
          <div className="relative w-full max-w-sm">
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={16}
            />
            <input
              placeholder="Search products..."
              value={search}
              onChange={handleSearch}
              className="h-10 w-full rounded-md border pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </ListFilterBar>

        {/* 🔷 Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-5 py-3 text-left">#</th>
                <th className="px-5 py-3 text-left">Name</th>
                <th className="px-5 py-3 text-left">HSN Code</th>
                <th className="px-5 py-3 text-left">Unit</th>
                <th className="px-5 py-3 text-left">Category</th>
                {/* <th className="px-5 py-3 text-left">Tax Percentage</th> */}
                <th className="px-5 py-3 text-left">Sales Rate</th>
                <th className="px-5 py-3 text-left">Purchase Rate</th>
                {/* <th className="px-5 py-3 text-right">Actions</th> */}
              </tr>
            </thead>

            <tbody>
              {items.length > 0 ? (
                items.map((item: any, index: number) => (
                  <tr
                    key={item._id}
                    onClick={() => router.push(`/master/product/${item._id}`)}
                    className="border-t hover:bg-gray-50"
                  >
                    {/* Serial */}
                    <td className="px-5 py-4 text-gray-400">
                      {listRowNumber(page, index)}
                    </td>

                    {/* Name */}
                    <td className="px-5 py-4 font-medium">{item.name}</td>
                    {/* HSN Code */}
                    <td className="px-5 py-4 font-medium">
                      {item?.hsnCode || "—"}
                    </td>
                    {/* Unit */}
                    <td className="px-5 py-4 font-medium">
                      {item.uomId?.name}
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4 text-gray-500">
                      {item.categoryId?.name || "—"}
                    </td>
                    {/* Tax Percentage */}
                    {/* <td className="px-5 py-4 font-medium">{item.taxPercent}</td> */}

                    {/* Sales Rate */}
                    <td className="px-5 py-4">
                      ₹{itemSalesRate(item).toLocaleString("en-IN")}
                    </td>

                    {/* Purchase Rate */}
                    <td className="px-5 py-4">
                      ₹{itemPurchaseRate(item).toLocaleString("en-IN")}
                    </td>

                    {/* Status */}
                    {/* <td className="px-5 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {item.isActive ? "Active" : "Inactive"}
                      </span>
                    </td> */}

                    {/* Actions */}
                    {/* <td className="px-5 py-4 text-right space-x-2">
                      <Button
                        onClick={() => handleEdit(item._id)}
                        className="p-2 border rounded-md"
                      >
                        <Pencil size={14} />
                      </Button>

                      <Button
                        onClick={() => handleDeleteClick(item._id)}
                        className="p-2 border rounded-md text-red-500"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </td> */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-400">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* 🔷 Pagination */}
          <div className="flex justify-between items-center p-4 border-t text-sm">
            <p className="text-gray-500">
              Showing {items.length} of {total}
            </p>

            <div className="flex gap-2">
              <Button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded-md"
              >
                Prev
              </Button>

              {[...Array(totalPages)].map((_, i) => (
                <Button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 border rounded-md ${
                    page === i + 1 ? "bg-black text-white" : ""
                  }`}
                >
                  {i + 1}
                </Button>
              ))}

              <Button
                // onClick={() => setPage((p) => p + 1)}
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={!data?.hasNext}
                className="px-3 py-1 border rounded-md"
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

export default React.memo(ProductPage);
