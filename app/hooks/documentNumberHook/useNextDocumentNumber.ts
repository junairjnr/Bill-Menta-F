import { useQuery } from "@tanstack/react-query";
import {
  documentNumberService,
  type DocumentNumberType,
  type NextDocumentNumberParams,
} from "@/app/services/documentNumber/documentNumber.service";

export const useNextDocumentNumber = (
  documentType: DocumentNumberType,
  params?: NextDocumentNumberParams,
  enabled = true
) =>
  useQuery({
    queryKey: ["document-number", documentType, params],
    queryFn: () => documentNumberService.getNext(documentType, params),
    enabled,
    staleTime: 30_000,
  });
