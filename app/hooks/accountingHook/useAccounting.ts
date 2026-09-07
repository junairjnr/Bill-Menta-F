import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { accountingService } from "@/app/services/accountingServices/accounting.service";
import type { ManualJournalLinePayload } from "@/app/types/accounting";

const keys = {
  coa: ["accounting", "coa"] as const,
  journals: (params?: Record<string, string | number | undefined>) =>
    ["accounting", "journals", params] as const,
  journal: (id: string) => ["accounting", "journal", id] as const,
  trialBalance: ["accounting", "trial-balance"] as const,
  profitLoss: ["accounting", "profit-loss"] as const,
  balanceSheet: ["accounting", "balance-sheet"] as const,
  customerBalances: ["accounting", "customer-balances"] as const,
  vendorBalances: ["accounting", "vendor-balances"] as const,
  subLedger: (partyId: string, partyType: string) =>
    ["accounting", "sub-ledger", partyId, partyType] as const,
  generalLedger: (accountCode: string) =>
    ["accounting", "general-ledger", accountCode] as const,
};

export const useChartOfAccounts = () =>
  useQuery({ queryKey: keys.coa, queryFn: () => accountingService.getChartOfAccounts() });

export const useSeedChartOfAccounts = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => accountingService.seedChartOfAccounts(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.coa });
      toast.success("Chart of accounts seeded");
    },
    onError: (e: Error) => toast.error(e.message || "Seed failed"),
  });
};

export const useJournals = (params?: Record<string, string | number | undefined>) =>
  useQuery({
    queryKey: keys.journals(params),
    queryFn: () =>
      accountingService.getJournals(
        Object.fromEntries(
          Object.entries(params ?? {}).filter(([, v]) => v !== undefined && v !== "")
        ) as Record<string, string | number>
      ),
  });

export const useJournal = (id: string) =>
  useQuery({
    queryKey: keys.journal(id),
    queryFn: () => accountingService.getJournal(id),
    enabled: !!id,
  });

export const useCreateJournal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      entryDate: string;
      referenceNo?: string;
      narration?: string;
      lines: ManualJournalLinePayload[];
    }) => accountingService.createJournal(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["accounting", "journals"] });
      toast.success("Journal entry posted");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to post journal"),
  });
};

export const useReverseJournal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => accountingService.reverseJournal(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["accounting"] });
      toast.success("Journal reversed");
    },
    onError: (e: Error) => toast.error(e.message || "Reverse failed"),
  });
};

export const useTrialBalance = () =>
  useQuery({ queryKey: keys.trialBalance, queryFn: () => accountingService.getTrialBalance() });

export const useProfitLoss = () =>
  useQuery({ queryKey: keys.profitLoss, queryFn: () => accountingService.getProfitLoss() });

export const useBalanceSheet = () =>
  useQuery({ queryKey: keys.balanceSheet, queryFn: () => accountingService.getBalanceSheet() });

export const useCustomerBalances = () =>
  useQuery({
    queryKey: keys.customerBalances,
    queryFn: () => accountingService.getCustomerBalances(),
  });

export const useVendorBalances = () =>
  useQuery({
    queryKey: keys.vendorBalances,
    queryFn: () => accountingService.getVendorBalances(),
  });

export const useSubLedger = (partyId: string, partyType: "customer" | "vendor") =>
  useQuery({
    queryKey: keys.subLedger(partyId, partyType),
    queryFn: () => accountingService.getSubLedger({ partyId, partyType }),
    enabled: !!partyId,
  });

export const useGeneralLedger = (accountCode: string) =>
  useQuery({
    queryKey: keys.generalLedger(accountCode),
    queryFn: () => accountingService.getGeneralLedger(accountCode),
    enabled: !!accountCode,
  });
