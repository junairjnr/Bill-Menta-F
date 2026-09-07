// "use client";

// import React, { useMemo, useState } from "react";
// import { Pencil, Trash2, Search } from "lucide-react";
// import { useRouter } from "next/navigation";
// import BackPanel from "@/app/utils/BackPanel";
// import { Button } from "@/components/ui/button";
// import PageHeader from "@/app/utils/PageHeader";

// type CategoryType = {
//   id: number;
//   name: string;
//   category: string;
// };

// const INITIAL_CATEGORY: CategoryType[] = [
//   { id: 1, name: "iPhone 15", category: "Mobile" },
//   { id: 2, name: "Samsung S24", category: "Mobile" },
//   { id: 3, name: "OnePlus 12", category: "Mobile" },
//   {
//     id: 4,
//     name: "AirPods Pro",
//     category: "Accessories",
//   },
//   {
//     id: 5,
//     name: "Fast Charger 30W",
//     category: "Accessories",
//   },
// ];

// const Product = () => {
//   const [products, setProducts] = useState(INITIAL_CATEGORY);
//   const [searchName, setSearchName] = useState("");
//   const [searchId, setSearchId] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);

//   const router = useRouter();
//   const pageSize = 5;

//   const handleDelete = (id: number) => {
//     setProducts((prev) => prev.filter((p) => p.id !== id));
//   };

//   const handleCreate = () => {
//     router.push("/master/category/add");
//   };

//   const filteredProducts = useMemo(() => {
//     return products.filter((p) => {
//       const nameMatch = p.name.toLowerCase().includes(searchName.toLowerCase());
//       const idMatch = searchId ? p.id.toString().includes(searchId) : true;
//       return nameMatch && idMatch;
//     });
//   }, [products, searchName, searchId]);

//   const totalPages = Math.ceil(filteredProducts.length / pageSize);

//   const paginatedProducts = useMemo(() => {
//     const start = (currentPage - 1) * pageSize;
//     return filteredProducts.slice(start, start + pageSize);
//   }, [filteredProducts, currentPage]);

//   return (
//     <BackPanel>
//       <div className="p-6 space-y-6">
//         {/* 🔷 Header */}

//         <PageHeader
//           title="Category"
//           description="Manage your inventory and category"
//           actionLabel="+ Add Category"
//           onAction={handleCreate}
//           btnClassName="px-4 py-2 rounded-md bg-black text-white text-sm hover:bg-gray-800"
//         />

//         {/* 🔷 Filter Bar */}
//         <div className="bg-white  rounded-lg p-4 flex flex-wrap gap-3 items-center shadow-sm">
//           <div className="relative flex-1">
//             <Search
//               className="absolute left-3 top-2.5 text-gray-400"
//               size={16}
//             />
//             <input
//               placeholder="Search products..."
//               value={searchName}
//               onChange={(e) => setSearchName(e.target.value)}
//               className="w-[25%] h-10 pl-9 pr-3 border rounded-md text-sm focus:ring-2 focus:ring-black outline-none"
//             />
//           </div>

//           <input
//             placeholder="ID"
//             value={searchId}
//             onChange={(e) => setSearchId(e.target.value)}
//             className="h-10 px-3 border rounded-md text-sm w-28"
//           />

//           {/* <Button className="h-10 px-4 border rounded-md text-sm hover:bg-gray-50">
//             Status
//           </Button>

//           <Button className="h-10 px-4 border rounded-md text-sm hover:bg-gray-50">
//             Category
//           </Button>

//           <Button className="h-10 px-4 border rounded-md text-sm hover:bg-gray-50">
//             Filter
//           </Button> */}
//         </div>

//         {/* 🔷 Table */}
//         <div className="bg-white  rounded-xl shadow-sm overflow-hidden">
//           <table className="w-full text-sm">
//             <thead className="bg-gray-300 text-gray-800">
//               <tr>
//                 <th className="text-left px-5 py-3">Category Name</th>
//                 <th className="text-left px-5 py-3">Active</th>
//               </tr>
//             </thead>

//             <tbody>
//               {paginatedProducts.map((p) => (
//                 <tr key={p.id} className="border-t hover:bg-gray-50 transition">
//                   <td className="px-5 py-4 font-medium">{p.name}</td>
//                   <td className="px-5 py-4 text-gray-500">{p.category}</td>

//                   <td className="px-5 py-4 text-right space-x-2">
//                     <Button className="p-2 rounded-md border hover:bg-gray-100">
//                       <Pencil size={14} />
//                     </Button>

//                     <Button
//                       onClick={() => handleDelete(p.id)}
//                       className="p-2 rounded-md border text-red-500 hover:bg-red-50"
//                     >
//                       <Trash2 size={14} />
//                     </Button>
//                   </td>
//                 </tr>
//               ))}

//               {paginatedProducts.length === 0 && (
//                 <tr>
//                   <td colSpan={5} className="text-center py-10 text-gray-400">
//                     No products found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>

//           {/* 🔷 Footer Pagination */}
//           <div className="flex justify-between items-center p-4 border-t text-sm">
//             <p className="text-gray-500">
//               Showing {paginatedProducts.length} of {filteredProducts.length}
//             </p>

//             <div className="flex gap-2">
//               <Button
//                 onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//                 className="px-3 py-1 border rounded-md hover:bg-gray-50"
//               >
//                 Prev
//               </Button>

//               {[...Array(totalPages)].map((_, i) => (
//                 <Button
//                   key={i}
//                   onClick={() => setCurrentPage(i + 1)}
//                   className={`px-3 py-1 rounded-md border ${
//                     currentPage === i + 1
//                       ? "bg-black text-white"
//                       : "hover:bg-gray-50"
//                   }`}
//                 >
//                   {i + 1}
//                 </Button>
//               ))}

//               <Button
//                 onClick={() =>
//                   setCurrentPage((p) => Math.min(p + 1, totalPages))
//                 }
//                 className="px-3 py-1 border rounded-md hover:bg-gray-50"
//               >
//                 Next
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </BackPanel>
//   );
// };

// export default Product;
"use client";

import React, { useState } from "react";
import { Pencil, Trash2, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import BackPanel from "@/app/utilsComponents/BackPanel";
import { Button } from "@/components/ui/button";
import PageHeader from "@/app/utilsComponents/PageHeader";
import { PAGE_SIZE, listRowNumber } from "@/app/config/pagination";
import {
  useItemCategories,
  useDeleteItemCategory,
} from "@/app/hooks/masterHooks/itemCategoryHook/useItemCategory";
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

const CategoryPage = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // ── API Hooks ───────────────────────────────────────────────
  const { data, isLoading, isError } = useItemCategories({
    page,
    search,
    limit: PAGE_SIZE,
  });

  const { mutate: remove, isPending: deleting } = useDeleteItemCategory();

  // ── Handlers ────────────────────────────────────────────────
  const handleCreate = () => router.push("/master/category/add");

  const handleEdit = (id: string) => router.push(`/master/category/edit/${id}`);

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    remove(id);
  };

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
          <p className="text-gray-400 text-sm">Loading categories...</p>
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

  const categories = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.page ?? 1;

  return (
    <BackPanel>
      <div className="p-6 space-y-6">
        {/* ── Header ─────────────────────────────────────────── */}
        <PageHeader
          title="Category"
          description="Manage your inventory categories"
          actionLabel="Add Category"
          onAction={handleCreate}
          btnClassName="px-4 py-2 rounded-md bg-black text-white text-sm hover:bg-gray-800"
        />

        {/* 🔥 Confirm Modal */}
        {/* <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Category?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                category.
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
        </AlertDialog> */}

        {/* ── Search Bar ─────────────────────────────────────── */}
        <div className="bg-white rounded-lg p-4 flex flex-wrap gap-3 items-center shadow-sm">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={16}
            />
            <input
              placeholder="Search categories..."
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
                <th className="text-left px-5 py-3 font-semibold">
                  Category Name
                </th>
                <th className="text-left px-5 py-3 font-semibold">
                  Description
                </th>
                <th className="text-left px-5 py-3 font-semibold">Status</th>
                {/* <th className="text-right px-5 py-3 font-semibold">Actions</th> */}
              </tr>
            </thead>

            <tbody>
              {categories.length > 0 ? (
                categories.map((cat, index) => (
                  <tr
                    key={cat._id}
                    onClick={() => router.push(`/master/category/${cat._id}`)}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    {/* Serial number */}
                    <td className="px-5 py-4 text-gray-400">
                      {listRowNumber(page, index)}
                    </td>

                    {/* Name */}
                    <td className="px-5 py-4 font-medium text-gray-800">
                      {cat.name}
                    </td>

                    {/* Description */}
                    <td className="px-5 py-4 text-gray-500">
                      {cat.description || "—"}
                    </td>

                    {/* Status badge */}
                    <td className="px-5 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          cat.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {cat.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Actions */}
                    {/* <td className="px-5 py-4 text-right space-x-2">
                      <Button
                        onClick={() => handleEdit(cat._id)}
                        className="p-2 rounded-md border hover:bg-gray-100"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </Button>

                      <Button
                        onClick={() => handleDeleteClick(cat._id)}
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
                      ? `No categories found for "${search}"`
                      : "No categories yet"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* ── Pagination ───────────────────────────────────── */}
          <div className="flex justify-between items-center p-4 border-t text-sm">
            <p className="text-gray-500">
              Showing {categories.length} of {total} categories
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

export default React.memo(CategoryPage);
