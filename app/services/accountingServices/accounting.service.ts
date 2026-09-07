import axiosInstance from "@/app/api/axios";
import { ApiResponse } from "@/app/types";
import type {
  BalanceSheetReport,
  ChartOfAccount,
  GeneralLedgerReport,
  JournalEntry,
  JournalList,
  ManualJournalLinePayload,
  PartyBalance,
  ProfitLossReport,
  SubLedgerReport,
  TrialBalanceReport,
} from "@/app/types/accounting";

export const accountingService = {
  getChartOfAccounts: async () => {
    const res = await axiosInstance.get<ApiResponse<ChartOfAccount[]>>(
      "/accounting/chart-of-accounts"
    );
    return res.data.data;
  },

  seedChartOfAccounts: async () => {
    const res = await axiosInstance.post<ApiResponse<unknown>>(
      "/accounting/chart-of-accounts/seed"
    );
    return res.data.data;
  },

  getJournals: async (params?: Record<string, string | number>) => {
    const res = await axiosInstance.get<ApiResponse<JournalList>>(
      "/accounting/journals",
      { params }
    );
    return res.data.data;
  },

  getJournal: async (id: string) => {
    const res = await axiosInstance.get<ApiResponse<JournalEntry>>(
      `/accounting/journals/${id}`
    );
    return res.data.data;
  },

  createJournal: async (body: {
    entryDate: string;
    referenceNo?: string;
    narration?: string;
    lines: ManualJournalLinePayload[];
  }) => {
    const res = await axiosInstance.post<ApiResponse<JournalEntry>>(
      "/accounting/journals",
      body
    );
    return res.data.data;
  },

  reverseJournal: async (id: string) => {
    const res = await axiosInstance.post<ApiResponse<JournalEntry>>(
      `/accounting/journals/${id}/reverse`,
      {}
    );
    return res.data.data;
  },

  getTrialBalance: async () => {
    const res = await axiosInstance.get<ApiResponse<TrialBalanceReport>>(
      "/accounting/reports/trial-balance"
    );
    return res.data.data;
  },

  getProfitLoss: async () => {
    const res = await axiosInstance.get<ApiResponse<ProfitLossReport>>(
      "/accounting/reports/profit-loss"
    );
    return res.data.data;
  },

  getBalanceSheet: async () => {
    const res = await axiosInstance.get<ApiResponse<BalanceSheetReport>>(
      "/accounting/reports/balance-sheet"
    );
    return res.data.data;
  },

  getCustomerBalances: async () => {
    const res = await axiosInstance.get<ApiResponse<PartyBalance[]>>(
      "/accounting/reports/customer-balances"
    );
    return res.data.data;
  },

  getVendorBalances: async () => {
    const res = await axiosInstance.get<ApiResponse<PartyBalance[]>>(
      "/accounting/reports/vendor-balances"
    );
    return res.data.data;
  },

  getSubLedger: async (params: { partyId: string; partyType: "customer" | "vendor" }) => {
    const res = await axiosInstance.get<ApiResponse<SubLedgerReport>>(
      "/accounting/reports/sub-ledger",
      { params }
    );
    return res.data.data;
  },

  getGeneralLedger: async (accountCode: string) => {
    const res = await axiosInstance.get<ApiResponse<GeneralLedgerReport>>(
      `/accounting/reports/general-ledger/${accountCode}`
    );
    return res.data.data;
  },
};
