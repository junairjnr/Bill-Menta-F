import axiosInstance from "@/app/api/axios";
import { ApiResponse } from "@/app/types";

export type DocumentNumberType =
  | "sales_invoice"
  | "quotation"
  | "purchase_invoice"
  | "sales_return"
  | "purchase_return"
  | "receipt"
  | "payment"
  | "expense"
  | "journal";

export type NextDocumentNumber = {
  documentType: DocumentNumberType;
  nextNumber: string;
  salesType?: string;
};

export type NextDocumentNumberParams = {
  salesType?: "retail" | "wholesale";
  salesInvoiceId?: string;
};

export const documentNumberService = {
  getNext: async (
    documentType: DocumentNumberType,
    params?: NextDocumentNumberParams
  ) => {
    const res = await axiosInstance.get<ApiResponse<NextDocumentNumber>>(
      "/document-numbers/next",
      {
        params: {
          documentType,
          ...params,
        },
      }
    );
    return res.data.data;
  },
};
