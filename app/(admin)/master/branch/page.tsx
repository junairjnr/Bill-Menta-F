"use client";

import React, { useState } from "react";
import { Pencil, Trash2, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import BackPanel from "@/app/utilsComponents/BackPanel";
import { Button } from "@/components/ui/button";
import PageHeader from "@/app/utilsComponents/PageHeader";
import { PAGE_SIZE, listRowNumber } from "@/app/config/pagination";
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
import { useBranches, useDeleteBranch } from "@/app/hooks/branchHook/useBranch";
import { logger } from "../../../utilsComponents/console";

const BranchPage = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // ── API Hooks ───────────────────────────────────────────────
  const { data, isLoading, isError } = useBranches({
    page,
    search,
    limit: PAGE_SIZE,
  });

  const { mutate: remove, isPending: deleting } = useDeleteBranch();

  // ── Handlers ────────────────────────────────────────────────
  const handleCreate = () => router.push("/master/branch/add");

  const handleEdit = (id: string) => router.push(`/master/branch/edit/${id}`);



  // ── Search handler ──────────────────────────────────────────
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // reset to page 1 on new search
  };

  const handleDeleteClick = (id: string) => {
    setSelectedId(id);
    setOpen(true);
  };

  const confirmDelete = () => {
    if (selectedId) {
      remove(selectedId);
    }
    setOpen(false);
    setSelectedId(null);
  };

  // ── States ──────────────────────────────────────────────────
  if (isLoading) {
    return (
      <BackPanel>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400 text-sm">Loading branches...</p>
        </div>
      </BackPanel>
    );
  }

  if (isError) {
    return (
      <BackPanel>
        <div className="flex items-center justify-center h-64">
          <p className="text-red-400 text-sm">
            Failed to load branches. Try again.
          </p>
        </div>
      </BackPanel>
    );
  }

  const branchList = Array.isArray(data) ? data : data?.data ?? [];
  const total = (Array.isArray(data) ? data.length : data?.total) ?? 0;
  const totalPages = data?.page ?? 1;

  logger("branches", data);

  return (
    <BackPanel>
      <div className="p-6 space-y-6">
        {/* ── Header ─────────────────────────────────────────── */}
        <PageHeader
          title="Branches"
          description="Manage your inventory branches"
        //   actionLabel="+ Add Branch"
          onAction={handleCreate}
          btnClassName="px-4 py-2 rounded-md bg-black text-white text-sm hover:bg-gray-800"
        />

        {/* 🔥 Confirm Modal */}
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Branch?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                branch.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* ── Search Bar ─────────────────────────────────────── */}
        {/* <div className="bg-white rounded-lg p-4 flex flex-wrap gap-3 items-center shadow-sm">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={16}
            />
            <input
              placeholder="Search Branch..."
              value={search}
              onChange={handleSearch}
              className="w-full max-w-sm h-10 pl-9 pr-3 border rounded-md text-sm focus:ring-2 focus:ring-black outline-none"
            />
          </div>
        </div> */}

        {/* ── Table ──────────────────────────────────────────── */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="text-left px-5 py-3 font-semibold">#</th>
                <th className="text-left px-5 py-3 font-semibold">Name</th>
                <th className="text-left px-5 py-3 font-semibold">Code</th>
                  {/* <th className="text-right px-5 py-3 font-semibold">Actions</th> */}
              </tr>
            </thead>

            <tbody>
              {branchList.length > 0 ? (
                branchList.map((branch, index) => (
                  <tr
                    key={branch._id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    {/* Serial number */}
                    <td className="px-5 py-4 text-gray-400">
                      {listRowNumber(page, index)}
                    </td>

                    {/* Name */}
                    <td className="px-5 py-4 font-medium text-gray-800">
                      {branch.name}
                    </td>

                    {/* Code */}
                    <td className="px-5 py-4 text-gray-500">
                      {branch.code || "—"}
                    </td>

                    {/* Actions */}
                    {/* <td className="px-5 py-4 text-right space-x-2">
                      <Button
                        onClick={() => handleEdit(branch._id)}
                        className="p-2 rounded-md border hover:bg-gray-100"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </Button>

                      <Button
                        onClick={() => handleDeleteClick(branch._id)}
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
                    {search
                      ? `No branches found for "${search}"`
                      : "No branches yet"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* ── Pagination ───────────────────────────────────── */}
          {/* <div className="flex justify-between items-center p-4 border-t text-sm">
            <p className="text-gray-500">
              Showing {branchList.length} of {total} Branches
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
          </div> */}
        </div>
      </div>
    </BackPanel>
  );
};

export default React.memo(BranchPage);
