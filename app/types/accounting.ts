import type { PaginatedData } from "./index";

export type ChartOfAccount = {
  _id: string;
  code: string;
  name: string;
  accountType: string;
  subLedger?: string;
  isSystem?: boolean;
};

export type JournalLine = {
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  narration?: string;
  customerId?: string;
  vendorId?: string;
};

export type JournalEntry = {
  _id: string;
  journalNo: string;
  entryDate: string;
  referenceType: string;
  referenceNo?: string;
  narration?: string;
  totalDebit: number;
  totalCredit: number;
  status: string;
  isReversal?: boolean;
  lines?: JournalLine[];
};

export type LedgerTransaction = {
  date: string;
  journalNo: string;
  referenceType: string;
  referenceNo?: string;
  narration?: string;
  debit: number;
  credit: number;
  balance: number;
};

export type PartyBalance = {
  partyId: string;
  name: string;
  phone?: string;
  balance: number;
};

export type TrialBalanceRow = {
  accountCode: string;
  accountName: string;
  accountType: string;
  debitBalance: number;
  creditBalance: number;
};

export type TrialBalanceReport = {
  rows: TrialBalanceRow[];
  totals: { totalDebit: number; totalCredit: number };
};

export type PLItem = { accountCode: string; accountName: string; amount: number };

export type ProfitLossReport = {
  income: PLItem[];
  expenses: PLItem[];
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
};

export type BSItem = { accountCode: string; accountName: string; amount: number };

export type BalanceSheetReport = {
  assets: BSItem[];
  liabilities: BSItem[];
  equity: BSItem[];
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  retainedEarnings: number;
  totalLiabilitiesAndEquity: number;
};

export type SubLedgerReport = {
  transactions: LedgerTransaction[];
  closingBalance: number;
};

export type GeneralLedgerReport = {
  accountCode: string;
  transactions: LedgerTransaction[];
  closingBalance: number;
};

export type JournalList = PaginatedData<JournalEntry>;

export type ManualJournalLinePayload = {
  accountCode: string;
  debit?: number;
  credit?: number;
  customerId?: string;
  vendorId?: string;
  narration?: string;
};
