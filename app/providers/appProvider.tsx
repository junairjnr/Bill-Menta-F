"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "../api/queryClient";
import { Toaster } from "react-hot-toast";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          // success: {
          //   style: {
          //     background: "#22c55e",
          //     color: "#fff",
          //   },
          // },
          error: {
            // style: {
            //   background: "#ef4444",
            //   color: "#fff",
            // },
          },
        }}
      />
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}
