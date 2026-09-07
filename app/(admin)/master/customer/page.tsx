// // // 'use client'

// // // import React, { useState } from "react";

// // // // 🔹 Type
// // // export type ProductType = {
// // //   id: number;
// // //   name: string;
// // //   category: string;
// // //   price: number;
// // //   stock: number;
// // // };

// // // // 🔹 Initial Data
// // // const INITIAL_PRODUCTS: ProductType[] = [
// // //   { id: 1, name: "iPhone 15", category: "Mobile", price: 79999, stock: 12 },
// // //   { id: 2, name: "Samsung S24", category: "Mobile", price: 74999, stock: 8 },
// // //   { id: 3, name: "OnePlus 12", category: "Mobile", price: 64999, stock: 15 },
// // //   { id: 4, name: "AirPods Pro", category: "Accessories", price: 24999, stock: 20 },
// // //   { id: 5, name: "Fast Charger 30W", category: "Accessories", price: 1499, stock: 50 },
// // // ];

// // // // 🔹 Props
// // // type ProductRowProps = {
// // //   product: ProductType;
// // //   onEdit: (product: ProductType) => void;
// // //   onDelete: (id: number) => void;
// // // };

// // // // 🔹 Row Component
// // // const ProductRow = React.memo(({ product, onEdit, onDelete }: ProductRowProps) => {
// // //   return (
// // //     <tr className="border-b hover:bg-gray-50 transition">
// // //       <td className="p-4">{product.id}</td>
// // //       <td className="p-4 font-medium">{product.name}</td>
// // //       <td className="p-4">{product.category}</td>
// // //       <td className="p-4">₹{product.price}</td>
// // //       <td className="p-4">
// // //         <span
// // //           className={`px-2 py-1 rounded text-xs font-medium ${
// // //             product.stock > 10
// // //               ? "bg-green-100 text-green-600"
// // //               : "bg-red-100 text-red-600"
// // //           }`}
// // //         >
// // //           {product.stock}
// // //         </span>
// // //       </td>

// // //       {/* 🔹 Actions */}
// // //       <td className="p-4 flex gap-2">
// // //         <Button
// // //           onClick={() => onEdit(product)}
// // //           className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
// // //         >
// // //           Edit
// // //         </Button>

// // //         <button
// // //           onClick={() => onDelete(product.id)}
// // //           className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
// // //         >
// // //           Delete
// // //         </button>
// // //       </td>
// // //     </tr>
// // //   );
// // // });

// // // ProductRow.displayName = "ProductRow";

// // // // 🔹 Main Component
// // // const Product: React.FC = () => {
// // //   const [products, setProducts] = useState<ProductType[]>(INITIAL_PRODUCTS);

// // //   // 🔸 Handlers
// // //   const handleDelete = (id: number) => {
// // //     setProducts((prev) => prev.filter((p) => p.id !== id));
// // //   };

// // //   const handleEdit = (product: ProductType) => {
// // //     console.log("Edit:", product);
// // //     // later → open modal
// // //   };

// // //   const handleCreate = () => {
// // //     console.log("Create new product");
// // //     // later → open modal
// // //   };

// // //   return (
// // //     <div className="w-full px-6 py-6">

// // //       {/* 🔹 Header */}
// // //       <div className="flex justify-between items-center mb-6">
// // //         <h1 className="text-2xl font-semibold">Products</h1>

// // //         <button
// // //           onClick={handleCreate}
// // //           className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
// // //         >
// // //           + Create Product
// // //         </button>
// // //       </div>

// // //       {/* 🔹 Table */}
// // //       <div className="w-full overflow-x-auto bg-white rounded-xl shadow-sm border">
// // //         <table className="w-full text-left">

// // //           <thead className="bg-gray-100 text-sm uppercase">
// // //             <tr>
// // //               <th className="p-4">ID</th>
// // //               <th className="p-4">Name</th>
// // //               <th className="p-4">Category</th>
// // //               <th className="p-4">Price</th>
// // //               <th className="p-4">Stock</th>
// // //               <th className="p-4">Actions</th>
// // //             </tr>
// // //           </thead>

// // //           <tbody>
// // //             {products.length > 0 ? (
// // //               products.map((product) => (
// // //                 <ProductRow
// // //                   key={product.id}
// // //                   product={product}
// // //                   onEdit={handleEdit}
// // //                   onDelete={handleDelete}
// // //                 />
// // //               ))
// // //             ) : (
// // //               <tr>
// // //                 <td colSpan={6} className="text-center p-6 text-gray-500">
// // //                   No products found
// // //                 </td>
// // //               </tr>
// // //             )}
// // //           </tbody>

// // //         </table>
// // //       </div>

// // //       {/* 🔹 Pagination Placeholder */}
// // //       <div className="mt-4 flex justify-end text-sm text-gray-500">
// // //         Pagination coming soon...
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default React.memo(Product);

// // // "use client";

// // // import React, { useMemo, useState } from "react";
// // // import { Pencil, Trash2 } from "lucide-react";

// // // import {
// // //   Table,
// // //   TableBody,
// // //   TableCell,
// // //   TableHead,
// // //   TableHeader,
// // //   TableRow,
// // // } from "@/components/ui/table";

// // // import { Button } from "@/components/ui/button";
// // // import { Badge } from "@/components/ui/badge";
// // // import { Card, CardContent } from "@/components/ui/card";
// // // import PageHeader from "@/app/utils/TitleWButton";

// // // import {
// // //   Pagination,
// // //   PaginationContent,
// // //   PaginationItem,
// // //   PaginationLink,
// // //   PaginationNext,
// // //   PaginationPrevious,
// // // } from "@/components/ui/pagination";
// // // import { useRouter } from "next/navigation";
// // // import BackPanel from "@/app/utils/BackPanel";

// // // // 🔹 Type
// // // export type ProductType = {
// // //   id: number;
// // //   name: string;
// // //   category: string;
// // //   price: number;
// // //   stock: number;
// // // };

// // // // 🔹 Data
// // // const INITIAL_PRODUCTS: ProductType[] = [
// // //   { id: 1, name: "iPhone 15", category: "Mobile", price: 79999, stock: 12 },
// // //   { id: 2, name: "Samsung S24", category: "Mobile", price: 74999, stock: 8 },
// // //   { id: 3, name: "OnePlus 12", category: "Mobile", price: 64999, stock: 15 },
// // //   {
// // //     id: 4,
// // //     name: "AirPods Pro",
// // //     category: "Accessories",
// // //     price: 24999,
// // //     stock: 20,
// // //   },
// // //   {
// // //     id: 5,
// // //     name: "Fast Charger 30W",
// // //     category: "Accessories",
// // //     price: 1499,
// // //     stock: 50,
// // //   },
// // // ];

// // // // 🔹 Row Component
// // // const ProductRow = React.memo(
// // //   ({
// // //     product,
// // //     onEdit,
// // //     onDelete,
// // //   }: {
// // //     product: ProductType;
// // //     onEdit: (product: ProductType) => void;
// // //     onDelete: (id: number) => void;
// // //   }) => {
// // //     return (
// // //       // <TableRow className="hover:bg-muted/40 transition-colors">
// // //       //   <TableCell>
// // //       //     <Badge variant="secondary">#{product.id}</Badge>
// // //       //   </TableCell>

// // //       //   <TableCell className="font-medium">{product.name}</TableCell>

// // //       //   <TableCell className="text-muted-foreground">
// // //       //     {product.category}
// // //       //   </TableCell>

// // //       //   <TableCell className="font-medium">
// // //       //     ₹{product.price.toLocaleString("en-IN")}
// // //       //   </TableCell>

// // //       //   <TableCell>
// // //       //     <Badge variant={product.stock > 10 ? "default" : "destructive"}>
// // //       //       {product.stock} pcs
// // //       //     </Badge>
// // //       //   </TableCell>

// // //       //   <TableCell className="flex justify-end gap-2">
// // //       //     <Button size="icon" variant="outline" onClick={() => onEdit(product)}>
// // //       //       <Pencil size={16} />
// // //       //     </Button>

// // //       //     <Button
// // //       //       size="icon"
// // //       //       variant="destructive"
// // //       //       onClick={() => onDelete(product.id)}
// // //       //     >
// // //       //       <Trash2 size={16} />
// // //       //     </Button>
// // //       //   </TableCell>
// // //       // </TableRow>
// // //       <TableRow className="hover:bg-muted/40 transition-colors border-b">
// // //         {/* ID */}
// // //         <TableCell className="w-20">
// // //           <Badge variant="secondary">#{product.id}</Badge>
// // //         </TableCell>

// // //         {/* Name */}
// // //         <TableCell className="font-medium">{product.name}</TableCell>

// // //         {/* Category */}
// // //         <TableCell className="text-muted-foreground">
// // //           {product.category}
// // //         </TableCell>

// // //         {/* Price */}
// // //         <TableCell className="font-medium">
// // //           ₹{product.price.toLocaleString("en-IN")}
// // //         </TableCell>

// // //         {/* Stock */}
// // //         <TableCell>
// // //           <Badge
// // //             variant={product.stock > 10 ? "default" : "destructive"}
// // //             className={product.stock > 10 ? "text-green-500" : "text-red-500"}
// // //           >
// // //             {product.stock} pcs
// // //           </Badge>
// // //         </TableCell>

// // //         {/* Actions */}
// // //         <TableCell className="text-right pr-6">
// // //           <div className="flex justify-end gap-2">
// // //             <Button
// // //               size="icon"
// // //               variant="outline"
// // //               onClick={() => onEdit(product)}
// // //               className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
// // //             >
// // //               <Pencil size={16} />
// // //             </Button>

// // //             <Button
// // //               size="icon"
// // //               variant="destructive"
// // //               onClick={() => onDelete(product.id)}
// // //               className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
// // //             >
// // //               <Trash2 size={16} />
// // //             </Button>
// // //           </div>
// // //         </TableCell>
// // //       </TableRow>
// // //     );
// // //   }
// // // );

// // // ProductRow.displayName = "ProductRow";

// // // // 🔹 Main Component
// // // const Product = () => {
// // //   const [products, setProducts] = useState<ProductType[]>(INITIAL_PRODUCTS);
// // //   const [searchName, setSearchName] = useState("");
// // //   const [searchId, setSearchId] = useState("");

// // //   // 🔸 Pagination state
// // //   const [currentPage, setCurrentPage] = useState(1);
// // //   const pageSize = 5;
// // //   const router = useRouter();
// // //   // 🔸 Handlers
// // //   const handleDelete = (id: number) => {
// // //     setProducts((prev) => prev.filter((p) => p.id !== id));
// // //   };

// // //   const handleEdit = (product: ProductType) => {
// // //     console.log("Edit:", product);
// // //   };

// // //   const handleCreate = () => {
// // //     console.log("Create new product");
// // //     router.push("/master/product/add");
// // //   };

// // //   // 🔹 Filter logic (optimized)
// // //   const filteredProducts = useMemo(() => {
// // //     return products.filter((product) => {
// // //       const matchName = product.name
// // //         .toLowerCase()
// // //         .includes(searchName.toLowerCase());

// // //       const matchId = searchId
// // //         ? product.id.toString().includes(searchId)
// // //         : true;

// // //       return matchName && matchId;
// // //     });
// // //   }, [products, searchName, searchId]);

// // //   // 🔹 Pagination logic
// // //   const totalPages = Math.ceil(filteredProducts.length / pageSize);

// // //   const paginatedProducts = useMemo(() => {
// // //     const start = (currentPage - 1) * pageSize;
// // //     return filteredProducts.slice(start, start + pageSize);
// // //   }, [filteredProducts, currentPage]);

// // //   // 🔹 Reset page on filter change
// // //   React.useEffect(() => {
// // //     setCurrentPage(1);
// // //   }, [searchName, searchId]);

// // //   return (
// // //     <BackPanel>
// // //       <div className="w-full px-6 py-6 ">
// // //         <PageHeader
// // //           title="Products"
// // //           description="Manage your inventory and products"
// // //           actionLabel="+ Create Product"
// // //           onAction={handleCreate}
// // //           btnClassName="border bg-gray-500 text-white hover:bg-gray-600"
// // //         />

// // //         {/* 🔍 Filters */}
// // //         <div className="flex flex-col md:flex-row gap-3 mb-5">
// // //           <input
// // //             placeholder="Search by name..."
// // //             value={searchName}
// // //             onChange={(e) => setSearchName(e.target.value)}
// // //             className="h-10  rounded-md border px-3 text-sm outline-none focus:ring-2 focus:ring-gray-400"
// // //           />

// // //           <input
// // //             placeholder="Filter by ID..."
// // //             value={searchId}
// // //             onChange={(e) => setSearchId(e.target.value)}
// // //             className="h-10 w-full md:max-w-37.5 rounded-md border px-3 text-sm outline-none focus:ring-2 focus:ring-gray-400"
// // //           />
// // //         </div>

// // //         {/* 📦 Table */}
// // //         <Card className="w-full ring-0">
// // //           <CardContent>
// // //             <Table>
// // //               <TableHeader className="bg-muted/40">
// // //                 <TableRow className="border-b">
// // //                   <TableHead className="w-20 text-left">ID</TableHead>
// // //                   <TableHead className="text-left">Name</TableHead>
// // //                   <TableHead className="text-left">Category</TableHead>
// // //                   <TableHead className="text-left">Price</TableHead>
// // //                   <TableHead className="text-left">Stock</TableHead>
// // //                   <TableHead className="text-right pr-10">Actions</TableHead>
// // //                 </TableRow>
// // //               </TableHeader>

// // //               <TableBody>
// // //                 {paginatedProducts.length > 0 ? (
// // //                   paginatedProducts.map((product) => (
// // //                     <ProductRow
// // //                       key={product.id}
// // //                       product={product}
// // //                       onEdit={handleEdit}
// // //                       onDelete={handleDelete}
// // //                     />
// // //                   ))
// // //                 ) : (
// // //                   <TableRow>
// // //                     <TableCell
// // //                       colSpan={6}
// // //                       className="text-center py-10 text-muted-foreground"
// // //                     >
// // //                       No matching products found
// // //                     </TableCell>
// // //                   </TableRow>
// // //                 )}
// // //               </TableBody>
// // //             </Table>
// // //           </CardContent>
// // //         </Card>

// // //         {/* 🔢 Pagination */}
// // //         {totalPages >= 0 && (
// // //           <div className="mt-6 flex justify-end">
// // //             <Pagination>
// // //               <PaginationContent>
// // //                 <PaginationItem>
// // //                   <PaginationPrevious
// // //                     onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
// // //                     className={
// // //                       currentPage === 1
// // //                         ? "pointer-events-none opacity-50"
// // //                         : "cursor-pointer"
// // //                     }
// // //                   />
// // //                 </PaginationItem>

// // //                 {[...Array(totalPages)].map((_, i) => (
// // //                   <PaginationItem key={i}>
// // //                     <PaginationLink
// // //                       isActive={currentPage === i + 1}
// // //                       onClick={() => setCurrentPage(i + 1)}
// // //                       className="cursor-pointer"
// // //                     >
// // //                       {i + 1}
// // //                     </PaginationLink>
// // //                   </PaginationItem>
// // //                 ))}

// // //                 <PaginationItem>
// // //                   <PaginationNext
// // //                     onClick={() =>
// // //                       setCurrentPage((p) => Math.min(p + 1, totalPages))
// // //                     }
// // //                     className={
// // //                       currentPage === totalPages
// // //                         ? "pointer-events-none opacity-50"
// // //                         : "cursor-pointer"
// // //                     }
// // //                   />
// // //                 </PaginationItem>
// // //               </PaginationContent>
// // //             </Pagination>
// // //           </div>
// // //         )}
// // //       </div>
// // //     </BackPanel>
// // //   );
// // // };

// // // export default React.memo(Product);
// // "use client";

// // import React, { useMemo, useState } from "react";
// // import { Pencil, Trash2 } from "lucide-react";
// // import { useRouter } from "next/navigation";
// // import BackPanel from "@/app/utils/BackPanel";

// // // 🔹 Type
// // type ProductType = {
// //   id: number;
// //   name: string;
// //   category: string;
// //   price: number;
// //   stock: number;
// // };

// // // 🔹 Data
// // const INITIAL_PRODUCTS: ProductType[] = [
// //   { id: 1, name: "iPhone 15", category: "Mobile", price: 79999, stock: 12 },
// //   { id: 2, name: "Samsung S24", category: "Mobile", price: 74999, stock: 8 },
// //   { id: 3, name: "OnePlus 12", category: "Mobile", price: 64999, stock: 15 },
// //   { id: 4, name: "AirPods Pro", category: "Accessories", price: 24999, stock: 20 },
// //   { id: 5, name: "Fast Charger 30W", category: "Accessories", price: 1499, stock: 50 },
// // ];

// // const Product = () => {
// //   const [products, setProducts] = useState(INITIAL_PRODUCTS);
// //   const [searchName, setSearchName] = useState("");
// //   const [searchId, setSearchId] = useState("");
// //   const [currentPage, setCurrentPage] = useState(1);

// //   const pageSize = 5;
// //   const router = useRouter();

// //   const handleDelete = (id: number) => {
// //     setProducts((prev) => prev.filter((p) => p.id !== id));
// //   };

// //   const handleCreate = () => {
// //     router.push("/master/product/add");
// //   };

// //   // 🔹 Filter
// //   const filteredProducts = useMemo(() => {
// //     return products.filter((p) => {
// //       const nameMatch = p.name.toLowerCase().includes(searchName.toLowerCase());
// //       const idMatch = searchId ? p.id.toString().includes(searchId) : true;
// //       return nameMatch && idMatch;
// //     });
// //   }, [products, searchName, searchId]);

// //   // 🔹 Pagination
// //   const totalPages = Math.ceil(filteredProducts.length / pageSize);

// //   const paginatedProducts = useMemo(() => {
// //     const start = (currentPage - 1) * pageSize;
// //     return filteredProducts.slice(start, start + pageSize);
// //   }, [filteredProducts, currentPage]);

// //   return (
// //     <BackPanel>
// //       <div className="p-6 space-y-6">

// //         {/* 🔷 Header */}
// //         <div className="flex justify-between items-center">
// //           <div>
// //             <h1 className="text-2xl font-semibold">Products</h1>
// //             <p className="text-sm text-gray-500">
// //               Manage your inventory and products
// //             </p>
// //           </div>

// //           <button
// //             onClick={handleCreate}
// //             className="px-4 py-2 rounded-md bg-black text-white text-sm hover:bg-gray-800"
// //           >
// //             + Create Product
// //           </button>
// //         </div>

// //         {/* 🔷 Filters */}
// //         <div className="bg-white border rounded-lg p-4 flex flex-col md:flex-row gap-3 shadow-sm">
// //           <input
// //             placeholder="Search by name..."
// //             value={searchName}
// //             onChange={(e) => setSearchName(e.target.value)}
// //             className="h-10 px-3 border rounded-md text-sm focus:ring-2 focus:ring-black outline-none w-full"
// //           />

// //           <input
// //             placeholder="Filter by ID..."
// //             value={searchId}
// //             onChange={(e) => setSearchId(e.target.value)}
// //             className="h-10 px-3 border rounded-md text-sm focus:ring-2 focus:ring-black outline-none w-full md:w-40"
// //           />
// //         </div>

// //         {/* 🔷 Table Section */}
// //         <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
// //           <table className="w-full text-sm">
// //             <thead className="bg-gray-50 text-gray-600">
// //               <tr>
// //                 <th className="text-left px-4 py-3">ID</th>
// //                 <th className="text-left px-4 py-3">Name</th>
// //                 <th className="text-left px-4 py-3">Category</th>
// //                 <th className="text-left px-4 py-3">Price</th>
// //                 <th className="text-left px-4 py-3">Stock</th>
// //                 <th className="text-right px-4 py-3">Actions</th>
// //               </tr>
// //             </thead>

// //             <tbody>
// //               {paginatedProducts.length > 0 ? (
// //                 paginatedProducts.map((p) => (
// //                   <tr key={p.id} className="border-t hover:bg-gray-50">
// //                     <td className="px-4 py-3 font-medium">#{p.id}</td>
// //                     <td className="px-4 py-3">{p.name}</td>
// //                     <td className="px-4 py-3 text-gray-500">{p.category}</td>
// //                     <td className="px-4 py-3 font-medium">
// //                       ₹{p.price.toLocaleString("en-IN")}
// //                     </td>

// //                     <td className="px-4 py-3">
// //                       <span
// //                         className={`px-2 py-1 text-xs rounded ${
// //                           p.stock > 10
// //                             ? "bg-green-100 text-green-600"
// //                             : "bg-red-100 text-red-600"
// //                         }`}
// //                       >
// //                         {p.stock} pcs
// //                       </span>
// //                     </td>

// //                     <td className="px-4 py-3 text-right space-x-2">
// //                       <button className="p-2 rounded bg-green-500 text-white hover:bg-green-600">
// //                         <Pencil size={14} />
// //                       </button>

// //                       <button
// //                         onClick={() => handleDelete(p.id)}
// //                         className="p-2 rounded bg-red-500 text-white hover:bg-red-600"
// //                       >
// //                         <Trash2 size={14} />
// //                       </button>
// //                     </td>
// //                   </tr>
// //                 ))
// //               ) : (
// //                 <tr>
// //                   <td colSpan={6} className="text-center py-10 text-gray-400">
// //                     No products found
// //                   </td>
// //                 </tr>
// //               )}
// //             </tbody>
// //           </table>
// //         </div>

// //         {/* 🔷 Pagination */}
// //         <div className="flex justify-end gap-2">
// //           <button
// //             onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
// //             className="px-3 py-1 border rounded text-sm"
// //           >
// //             Prev
// //           </button>

// //           {[...Array(totalPages)].map((_, i) => (
// //             <button
// //               key={i}
// //               onClick={() => setCurrentPage(i + 1)}
// //               className={`px-3 py-1 border rounded text-sm ${
// //                 currentPage === i + 1 ? "bg-black text-white" : ""
// //               }`}
// //             >
// //               {i + 1}
// //             </button>
// //           ))}

// //           <button
// //             onClick={() =>
// //               setCurrentPage((p) => Math.min(p + 1, totalPages))
// //             }
// //             className="px-3 py-1 border rounded text-sm"
// //           >
// //             Next
// //           </button>
// //         </div>
// //       </div>
// //     </BackPanel>
// //   );
// // };

// // export default Product;

// "use client";

// import React, { useMemo, useState } from "react";
// import { Pencil, Trash2, Search } from "lucide-react";
// import { useRouter } from "next/navigation";
// import BackPanel from "@/app/utilsComponents/BackPanel";
// import { Button } from "@/components/ui/button";
// import PageHeader from "@/app/utilsComponents/PageHeader";

// type ProductType = {
//   id: number;
//   name: string;
//   category: string;
//   price: number;
//   stock: number;
// };

// const INITIAL_PRODUCTS: ProductType[] = [
//   { id: 1, name: "iPhone 15", category: "Mobile", price: 79999, stock: 12 },
//   { id: 2, name: "Samsung S24", category: "Mobile", price: 74999, stock: 8 },
//   { id: 3, name: "OnePlus 12", category: "Mobile", price: 64999, stock: 15 },
//   {
//     id: 4,
//     name: "AirPods Pro",
//     category: "Accessories",
//     price: 24999,
//     stock: 20,
//   },
//   {
//     id: 5,
//     name: "Fast Charger 30W",
//     category: "Accessories",
//     price: 1499,
//     stock: 2,
//   },
// ];

// const Product = () => {
//   const [products, setProducts] = useState(INITIAL_PRODUCTS);
//   const [searchName, setSearchName] = useState("");
//   const [searchId, setSearchId] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);

//   const router = useRouter();
//   const pageSize = 5;

//   const handleDelete = (id: number) => {
//     setProducts((prev) => prev.filter((p) => p.id !== id));
//   };

//   const handleCreate = () => {
//     router.push("/master/customer/add");
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

//   const getStockBadge = (stock: number) => {
//     if (stock === 0) return "bg-red-100 text-red-600";
//     if (stock <= 5) return "bg-yellow-100 text-yellow-700";
//     return "bg-green-100 text-green-600";
//   };

//   const getStockText = (stock: number) => {
//     if (stock === 0) return "Out of Stock";
//     if (stock <= 5) return "Low Stock";
//     return "In Stock";
//   };

//   return (
//     <BackPanel>
//       <div className="p-6 space-y-6">
//         {/* 🔷 Header */}
//         {/* <div className="flex justify-between items-center">
//           <div>
//             <h1 className="text-2xl font-semibold">Products List</h1>
//             <p className="text-sm text-gray-500">
//               Manage your products and inventory
//             </p>
//           </div>

//           <div className="flex gap-2">
//             <Button variant={"outline"} className="px-4 py-2 border rounded-md text-sm hover:bg-gray-50">
//               Import
//             </Button>
//             <Button variant={"outline"} className="px-4 py-2 border rounded-md text-sm hover:bg-gray-50">
//               Export
//             </Button>
//             <Button
//               onClick={handleCreate}
//               className="px-4 py-2 rounded-md bg-black text-white text-sm hover:bg-gray-800"
//             >
//               + Add Product
//             </Button>
//           </div>
//         </div> */}

//         <PageHeader
//           title="Products"
//           description="Manage your inventory and products"
//           actionLabel="+ Add Product"
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
//                 <th className="text-left px-5 py-3">Product</th>
//                 <th className="text-left px-5 py-3">Category</th>
//                 <th className="text-left px-5 py-3">Price</th>
//                 <th className="text-left px-5 py-3">Stock</th>
//                 <th className="text-right px-5 py-3">Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {paginatedProducts.map((p) => (
//                 <tr key={p.id} className="border-t hover:bg-gray-50 transition">
//                   <td className="px-5 py-4 font-medium">{p.name}</td>
//                   <td className="px-5 py-4 text-gray-500">{p.category}</td>
//                   <td className="px-5 py-4 font-medium">
//                     ₹{p.price.toLocaleString("en-IN")}
//                   </td>

//                   <td className="px-5 py-4">
//                     <span
//                       className={`px-2 py-1 text-xs rounded-full ${getStockBadge(
//                         p.stock
//                       )}`}
//                     >
//                       {getStockText(p.stock)}
//                     </span>
//                   </td>

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
import ReportExport from "@/app/utilsComponents/ReportExport";
import { ListFilterBar } from "@/app/utilsComponents/report-ui";
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
import {
  useCustomers,
  useDeleteCustomer,
} from "@/app/hooks/masterHooks/customerHook/useCustomer";

const ProductPage = () => {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // ✅ API Hooks
  const { data, isLoading, isError } = useCustomers({
    page,
    search,
    limit: PAGE_SIZE,
  });

  const { mutate: remove, isPending: deleting } = useDeleteCustomer();

  // ✅ Handlers
  const handleCreate = () => router.push("/master/customer/add");

  const handleView = (id: string) => router.push(`/master/customer/${id}`);

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
          <p className="text-gray-400 text-sm">Loading customers...</p>
        </div>
      </BackPanel>
    );
  }

  if (isError) {
    return (
      <BackPanel>
        <div className="flex justify-center items-center h-64">
          <p className="text-red-400 text-sm">Failed to load customers</p>
        </div>
      </BackPanel>
    );
  }

  const customers = data?.data ?? [];
  const total = data?.total ?? 0;
  // const totalPages = data?.page ?? 1;
  const totalPages = data?.totalPages ?? 1;

  return (
    <BackPanel>
      <div className="p-6 space-y-6">
        {/* 🔷 Header */}
        <PageHeader
          title="Customers"
          description="Manage your customers"
          actionLabel="Add Customer"
          onAction={handleCreate}
          btnClassName="px-4 py-2 bg-black text-white rounded-md text-sm"
        />

        {/* 🔥 Delete Modal */}
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Customer?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
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

        {/* 🔷 Search */}
        <ListFilterBar trailing={<ReportExport variant="inline" reportType="customers" params={{ search }} />}>
          <div className="relative w-full max-w-sm">
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={16}
            />
            <input
              placeholder="Search customers..."
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
                <th className="px-5 py-3 text-left">Party Type</th>
                <th className="px-5 py-3 text-left">Customer Type</th>
                <th className="px-5 py-3 text-left">Email</th>
                <th className="px-5 py-3 text-left">Phone</th>
                {/* <th className="px-5 py-3 text-left">Action</th> */}
              </tr>
            </thead>

            <tbody>
              {customers?.length > 0 ? (
                customers?.map((customer: any, index: number) => (
                  <tr
                    key={customer._id}
                    onClick={() => handleView(customer._id)}
                    className="border-t hover:bg-gray-50"
                  >
                    {/* Serial */}
                    <td className="px-5 py-4 text-gray-400">
                      {listRowNumber(page, index)}
                    </td>

                    {/* Name */}
                    <td className="px-5 py-4 font-medium">{customer.name}</td>
                    {/* Party Type (sales / purchase) */}
                    <td className="px-5 py-4 font-medium">
                      {customer?.type === "purchase"
                        ? "Vendor"
                        : "Sales Customer"}
                    </td>
                    {/* Customer Type (retail / wholesale) */}
                    <td className="px-5 py-4 capitalize text-gray-600">
                      {customer?.type === "purchase"
                        ? "—"
                        : customer?.customerType || "—"}
                    </td>
                    {/* Email */}
                    <td className="px-5 py-4 font-medium">
                      {customer.email || "—"}
                    </td>

                    {/* Phone */}
                    <td className="px-5 py-4 text-gray-500">
                      {customer.phone || "—"}
                    </td>

                    {/* Actions */}
                    {/* <td className="px-5 py-4 text-right space-x-2">
                      <Button
                        onClick={() => handleEdit(customer._id)}
                        className="p-2 border rounded-md"
                      >
                        <Pencil size={14} />
                      </Button>

                      <Button
                        onClick={() => handleDeleteClick(customer._id)}
                        className="p-2 border rounded-md text-red-500"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </td> */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">
                    No Customer found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* 🔷 Pagination */}
          <div className="flex justify-between items-center p-4 border-t text-sm">
            <p className="text-gray-500">
              Showing {customers.length} of {total}
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
