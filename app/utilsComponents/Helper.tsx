// export // Helper to generate pages
// const getPages = () => {
//   const pages: (number | string)[] = [];
  

//   if (totalPages <= 5) {
//     for (let i = 1; i <= totalPages; i++) pages.push(i);
//   } else {
//     pages.push(1);

//     if (page > 3) pages.push("...");

//     for (let i = page - 1; i <= page + 1; i++) {
//       if (i > 1 && i < totalPages) pages.push(i);
//     }

//     if (page < totalPages - 2) pages.push("...");

//     pages.push(totalPages);
//   }

//   return pages;
// };