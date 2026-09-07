import { reportsService } from "@/app/services/reportsServices/reports.services";
import { accountingService } from "@/app/services/accountingServices/accounting.service";
import { salesService } from "@/app/services/salesInvoiceServices/salesInvoice.service";
import { salesReturnService } from "@/app/services/salesInvoiceServices/salesReturn.service";
import { purchaseService } from "@/app/services/purchaseServices/purchaseInvoice.service";
import { purchaseReturnService } from "@/app/services/purchaseServices/purchaseReturn.service";
import { itemService } from "@/app/services/masterServices/item/item.service";
import { customerService } from "@/app/services/masterServices/customer/customer.service";
import { warehouseService } from "@/app/services/warehouseServices/warehouse.service";
import { expenseService } from "@/app/services/expense/expense.service";
import {
  receiptService,
  vendorPaymentService,
} from "@/app/services/receiptPayment/receiptPayment.service";
import {
  resolveBalance,
  resolveCustomerName,
  resolvePartyName,
  resolvePaymentStatus,
  PAYMENT_STATUS_LABELS,
} from "@/app/utilsComponents/paymentConstants";
import { expenseCategoryLabel } from "@/app/utilsComponents/expenseConstants";
import { formatDate } from "@/app/utilsComponents/DateFormat";
import { itemPurchaseRate, itemSalesRate } from "@/app/utils/itemRates";
import type { ExportConfig } from "./types";
import {
  defineCol,
  fmtExportDate,
  fmtExportMoney,
  paginatedListFetcher,
  paginatedReportFetcher,
  fetchPaginatedExportRows,
  flattenSectionRows,
} from "./helpers";

const MOVEMENT_LABELS: Record<string, string> = {
  purchase_in: "Purchase In",
  purchase_return: "Purchase Return",
  sales_out: "Sales Out",
  sales_return: "Sales Return",
  transfer_in: "Transfer In",
  transfer_out: "Transfer Out",
  adjustment_in: "Adjustment In",
  adjustment_out: "Adjustment Out",
  opening_stock: "Opening Stock",
};

const SHOP_TYPE_LABELS: Record<string, string> = {
  sales: "Sales Invoice",
  sales_return: "Sales Return",
  purchase: "Purchase Invoice",
  purchase_return: "Purchase Return",
  receipt: "Receipt",
  payment: "Payment",
};

const exportRegistry: Record<string, ExportConfig> = {
  "sales-report": {
    title: "Sales Report",
    columns: [
      defineCol("slno", "Sl No", { default: true }),
      defineCol("invoiceNo", "Invoice No"),
      defineCol("invoiceDate", "Date"),
      defineCol("salesType", "Type"),
      defineCol("customer", "Customer"),
      defineCol("priceLevel", "Price Level"),
      defineCol("netAmount", "Net Amount", { align: "right" }),
      defineCol("tax", "Tax", { align: "right" }),
      defineCol("grandTotal", "Grand Total", { align: "right" }),
      defineCol("status", "Status"),
    ],
    fetchRows: paginatedReportFetcher(
      (p) => reportsService.getSalesReport(p),
      (inv) => ({
        invoiceNo: inv.invoiceNo,
        invoiceDate: fmtExportDate(inv.invoiceDate),
        salesType: inv.salesType,
        customer:
          typeof inv.customerId === "object"
            ? inv.customerId.name
            : inv.customerSnapshot?.name ?? "",
        priceLevel: inv.priceLevelSnapshot
          ? `${inv.priceLevelSnapshot.name} (${inv.priceLevelSnapshot.taxPercent}%)`
          : "",
        netAmount: fmtExportMoney(inv.netAmount),
        tax: fmtExportMoney(inv.totalTax),
        grandTotal: fmtExportMoney(inv.grandTotal),
        status: inv.status,
      })
    ),
  },

  "purchase-report": {
    title: "Purchase Report",
    columns: [
      defineCol("slno", "Sl No"),
      defineCol("invoiceNo", "Invoice No"),
      defineCol("date", "Date"),
      defineCol("vendor", "Vendor"),
      defineCol("warehouse", "Warehouse"),
      defineCol("netAmount", "Net Amount", { align: "right" }),
      defineCol("sgst", "SGST", { align: "right" }),
      defineCol("cgst", "CGST", { align: "right" }),
      defineCol("grandTotal", "Grand Total", { align: "right" }),
      defineCol("status", "Status"),
    ],
    fetchRows: paginatedReportFetcher(
      (p) => reportsService.getPurchaseReport(p),
      (inv) => ({
        invoiceNo: inv.invoiceNo,
        date: fmtExportDate(inv.purchaseDate),
        vendor:
          typeof inv.vendorId === "object" ? inv.vendorId.name : inv.vendorSnapshot?.name ?? "",
        warehouse: typeof inv.warehouseId === "object" ? inv.warehouseId.name : "",
        netAmount: fmtExportMoney(inv.netAmount),
        sgst: fmtExportMoney(inv.totalSGST),
        cgst: fmtExportMoney(inv.totalCGST),
        grandTotal: fmtExportMoney(inv.grandTotal),
        status: inv.status,
      })
    ),
  },

  "stock-report": {
    title: "Stock Report",
    columns: [
      defineCol("slno", "Sl No"),
      defineCol("item", "Item"),
      defineCol("code", "Code"),
      defineCol("hsn", "HSN CODE"),
      defineCol("category", "Category"),
      defineCol("uom", "UOM"),
      defineCol("warehouse", "Warehouse"),
      defineCol("qty", "Qty", { align: "right" }),
      defineCol("rate", "Rate", { align: "right" }),
      defineCol("sgst", "SGST", { align: "right" }),
      defineCol("cgst", "CGST", { align: "right" }),
      defineCol("stockValue", "Stock Value", { align: "right" }),
    ],
    fetchRows: (params, options) =>
      fetchPaginatedExportRows(
        (page, limit) =>
          reportsService.getStockReport({
            ...params,
            includeZero: params.includeZero === "true",
            page,
            limit,
          }),
        (row) => ({
          item: row.itemId?.name ?? "",
          code: row.itemId?.code ?? "",
          hsn: row.itemId?.hsn ?? "",
          category: row.itemId?.categoryId?.name ?? "",
          uom: row.uomId?.shortCode ?? row.uomId?.name ?? "",
          warehouse: row.warehouseId?.name ?? "",
          qty: String(row.qty ?? 0),
          rate: fmtExportMoney(row.rate ?? row.avgCost ?? 0),
          sgst: fmtExportMoney(row.sgst ?? 0),
          cgst: fmtExportMoney(row.cgst ?? 0),
          stockValue: fmtExportMoney(row.stockValue ?? row.qty * (row.rate ?? row.avgCost ?? 0)),
        }),
        options
      ),
  },

  "ledger-report": {
    title: "Ledger Report",
    columns: [
      defineCol("slno", "Sl No"),
      defineCol("date", "Date"),
      defineCol("movement", "Movement"),
      defineCol("warehouse", "Warehouse"),
      defineCol("reference", "Reference"),
      defineCol("qtyIn", "Qty In", { align: "right" }),
      defineCol("qtyOut", "Qty Out", { align: "right" }),
      defineCol("rate", "Rate", { align: "right" }),
      defineCol("value", "Value", { align: "right" }),
      defineCol("balance", "Balance", { align: "right" }),
    ],
    fetchRows: (params, options) => {
      if (!params.itemId) return Promise.resolve([]);
      return fetchPaginatedExportRows(
        (page, limit) =>
          reportsService.getLedgerReport({
            itemId: params.itemId,
            warehouseId: params.warehouseId,
            movementType: params.movementType,
            dateFrom: params.dateFrom,
            dateTo: params.dateTo,
            page,
            limit,
          }),
        (row) => {
          const meta = MOVEMENT_LABELS[row.movementType];
          const isIn = [
            "purchase_in",
            "sales_return",
            "transfer_in",
            "adjustment_in",
            "opening_stock",
          ].includes(row.movementType);
          return {
            date: fmtExportDate(row.createdAt),
            movement: meta ?? row.movementType,
            warehouse: row.warehouseId?.name ?? "",
            reference: row.referenceNo ?? row.notes ?? "—",
            qtyIn: isIn ? String(row.qty) : "—",
            qtyOut: !isIn ? String(row.qty) : "—",
            rate: fmtExportMoney(row.rate ?? 0),
            value: fmtExportMoney(row.value ?? 0),
            balance: String(row.balanceQty ?? 0),
          };
        },
        options
      );
    },
  },

  "shop-report": {
    title: "Shop Report",
    columns: [
      defineCol("slno", "Sl No"),
      defineCol("date", "Date"),
      defineCol("type", "Type"),
      defineCol("reference", "Reference"),
      defineCol("party", "Party"),
      defineCol("debit", "Debit", { align: "right" }),
      defineCol("credit", "Credit", { align: "right" }),
      defineCol("balance", "Balance", { align: "right" }),
      defineCol("status", "Status"),
    ],
    fetchRows: paginatedReportFetcher(
      (p) => reportsService.shopReport(p),
      (row) => ({
        date: fmtExportDate(row.date),
        type: SHOP_TYPE_LABELS[row.type] ?? row.type,
        reference: row.refNo,
        party: row.partyName ?? "—",
        debit: row.debit ? fmtExportMoney(row.debit) : "—",
        credit: row.credit ? fmtExportMoney(row.credit) : "—",
        balance: row.balance != null ? fmtExportMoney(row.balance) : "—",
        status: row.status ?? "—",
      })
    ),
  },

  "sales-history": {
    title: "Sales History",
    columns: [
      defineCol("slno", "Sl No"),
      defineCol("invoiceNo", "Invoice No"),
      defineCol("date", "Date"),
      defineCol("item", "Item"),
      defineCol("type", "Type"),
      defineCol("customer", "Customer"),
      defineCol("priceLevel", "Price Level"),
      defineCol("rate", "Rate", { align: "right" }),
      defineCol("qty", "Qty", { align: "right" }),
      defineCol("discount", "Disc %", { align: "right" }),
      defineCol("taxableValue", "Taxable Value", { align: "right" }),
      defineCol("sgst", "SGST", { align: "right" }),
      defineCol("cgst", "CGST", { align: "right" }),
      defineCol("total", "Total", { align: "right" }),
    ],
    fetchRows: paginatedReportFetcher(
      (p) => reportsService.getSalesHistory(p),
      (row) => ({
        invoiceNo: row.invoiceNo,
        date: fmtExportDate(row.invoiceDate),
        item: row.itemName ?? "",
        type: row.salesType,
        customer: row.customer?.name ?? "",
        priceLevel: row.priceLevel?.name ?? "",
        rate: fmtExportMoney(row.rate),
        qty: String(row.qty),
        discount: `${row.discount ?? 0}%`,
        taxableValue: fmtExportMoney(row.taxableValue),
        sgst: fmtExportMoney(row.sgst),
        cgst: fmtExportMoney(row.cgst),
        total: fmtExportMoney(row.total),
      })
    ),
  },

  "purchase-history": {
    title: "Purchase History",
    columns: [
      defineCol("slno", "Sl No"),
      defineCol("invoiceNo", "Invoice No"),
      defineCol("date", "Date"),
      defineCol("item", "Item"),
      defineCol("vendor", "Vendor"),
      defineCol("warehouse", "Warehouse"),
      defineCol("rate", "Rate", { align: "right" }),
      defineCol("qty", "Qty", { align: "right" }),
      defineCol("taxableValue", "Taxable Value", { align: "right" }),
      defineCol("sgst", "SGST", { align: "right" }),
      defineCol("cgst", "CGST", { align: "right" }),
      defineCol("total", "Total", { align: "right" }),
    ],
    fetchRows: paginatedReportFetcher(
      (p) => reportsService.getPurchaseHistory(p),
      (row) => ({
        invoiceNo: row.invoiceNo,
        date: fmtExportDate(row.purchaseDate),
        item: row.itemName ?? "",
        vendor: row.vendor?.name ?? "",
        warehouse: row.warehouse?.name ?? "",
        rate: fmtExportMoney(row.rate),
        qty: String(row.qty),
        taxableValue: fmtExportMoney(row.taxableValue),
        sgst: fmtExportMoney(row.sgst),
        cgst: fmtExportMoney(row.cgst),
        total: fmtExportMoney(row.total),
      })
    ),
  },

  "sales-return-history": {
    title: "Sales Return History",
    columns: [
      defineCol("slno", "Sl No"),
      defineCol("returnNo", "Return No"),
      defineCol("date", "Date"),
      defineCol("originalInvoice", "Original Invoice"),
      defineCol("item", "Item"),
      defineCol("type", "Type"),
      defineCol("customer", "Customer"),
      defineCol("qty", "Qty", { align: "right" }),
      defineCol("rate", "Rate", { align: "right" }),
      defineCol("total", "Total", { align: "right" }),
    ],
    fetchRows: paginatedReportFetcher(
      (p) => reportsService.getSalesReturnHistory(p),
      (row) => ({
        returnNo: row.returnNo,
        date: fmtExportDate(row.returnDate),
        originalInvoice: row.originalInvoiceNo,
        item: row.itemName ?? "",
        type: row.salesType,
        customer: row.customer?.name ?? "",
        qty: String(row.qty),
        rate: fmtExportMoney(row.rate),
        total: fmtExportMoney(row.total),
      })
    ),
  },

  "purchase-return-history": {
    title: "Purchase Return History",
    columns: [
      defineCol("slno", "Sl No"),
      defineCol("returnNo", "Return No"),
      defineCol("date", "Date"),
      defineCol("originalInvoice", "Original Invoice"),
      defineCol("item", "Item"),
      defineCol("vendor", "Vendor"),
      defineCol("qty", "Qty", { align: "right" }),
      defineCol("rate", "Rate", { align: "right" }),
      defineCol("total", "Total", { align: "right" }),
    ],
    fetchRows: paginatedReportFetcher(
      (p) => reportsService.getPurchaseReturnHistory(p),
      (row) => ({
        returnNo: row.returnNo,
        date: fmtExportDate(row.returnDate),
        originalInvoice: row.originalInvoiceNo,
        item: row.itemName ?? "",
        vendor: row.vendor?.name ?? "",
        qty: String(row.qty),
        rate: fmtExportMoney(row.rate),
        total: fmtExportMoney(row.total),
      })
    ),
  },

  "expense-report": {
    title: "Expense Report",
    columns: [
      defineCol("slno", "Sl No"),
      defineCol("date", "Date"),
      defineCol("expenseNo", "Expense No"),
      defineCol("category", "Category"),
      defineCol("title", "Title"),
      defineCol("amount", "Amount", { align: "right" }),
      defineCol("mode", "Mode"),
    ],
    fetchRows: paginatedReportFetcher(
      (p) => reportsService.getExpenseReport(p),
      (row) => ({
        date: fmtExportDate(row.date),
        expenseNo: row.expenseNo,
        category: expenseCategoryLabel(row.category),
        title: row.title,
        amount: fmtExportMoney(row.amount),
        mode: row.paymentMode?.replace(/_/g, " ") ?? "",
      })
    ),
  },

  "trial-balance": {
    title: "Trial Balance",
    columns: [
      defineCol("accountCode", "Code"),
      defineCol("accountName", "Account"),
      defineCol("accountType", "Type"),
      defineCol("debit", "Debit", { align: "right" }),
      defineCol("credit", "Credit", { align: "right" }),
    ],
    fetchRows: async () => {
      const data = await accountingService.getTrialBalance();
      return (data.rows ?? []).map((row) => ({
        accountCode: row.accountCode,
        accountName: row.accountName,
        accountType: row.accountType,
        debit: row.debitBalance ? fmtExportMoney(row.debitBalance) : "—",
        credit: row.creditBalance ? fmtExportMoney(row.creditBalance) : "—",
      }));
    },
  },

  "profit-loss": {
    title: "Profit & Loss",
    columns: [
      defineCol("section", "Section"),
      defineCol("account", "Account"),
      defineCol("amount", "Amount", { align: "right" }),
    ],
    fetchRows: async () => {
      const data = await accountingService.getProfitLoss();
      return flattenSectionRows(
        [
          { label: "Income", rows: data.income ?? [] },
          { label: "Expenses", rows: data.expenses ?? [] },
        ],
        fmtExportMoney
      );
    },
  },

  "balance-sheet": {
    title: "Balance Sheet",
    columns: [
      defineCol("section", "Section"),
      defineCol("account", "Account"),
      defineCol("amount", "Amount", { align: "right" }),
    ],
    fetchRows: async () => {
      const data = await accountingService.getBalanceSheet();
      return flattenSectionRows(
        [
          { label: "Assets", rows: data.assets ?? [] },
          { label: "Liabilities", rows: data.liabilities ?? [] },
          { label: "Equity", rows: data.equity ?? [] },
        ],
        fmtExportMoney
      );
    },
  },

  "customer-balances": {
    title: "Customer Outstanding",
    columns: [
      defineCol("slno", "Sl No"),
      defineCol("customer", "Customer"),
      defineCol("phone", "Phone"),
      defineCol("outstanding", "Outstanding", { align: "right" }),
    ],
    fetchRows: paginatedListFetcher(
      async () => {
        const data = await accountingService.getCustomerBalances();
        return { data, hasNext: false };
      },
      (row) => ({
        customer: row.name,
        phone: row.phone ?? "—",
        outstanding: fmtExportMoney(row.balance),
      })
    ),
  },

  sales: {
    title: "Sales Invoices",
    columns: [
      defineCol("slno", "Sl No"),
      defineCol("invoiceNo", "Invoice No"),
      defineCol("date", "Date"),
      defineCol("type", "Type"),
      defineCol("customer", "Customer"),
      defineCol("priceLevel", "Price Level"),
      defineCol("grandTotal", "Grand Total", { align: "right" }),
      defineCol("received", "Received", { align: "right" }),
      defineCol("balance", "Balance", { align: "right" }),
      defineCol("payment", "Payment"),
      defineCol("status", "Status"),
    ],
    fetchRows: paginatedListFetcher(
      (p) => salesService.getAll(p),
      (inv) => {
        const paid = inv.paidAmount ?? 0;
        const balance = resolveBalance(inv.grandTotal, paid, inv.balanceAmount);
        const payment = resolvePaymentStatus(inv.grandTotal, paid, inv.paymentStatus);
        return {
          invoiceNo: inv.invoiceNo,
          date: fmtExportDate(inv.invoiceDate),
          type: inv.salesType,
          customer: resolveCustomerName(inv),
          priceLevel: inv.priceLevelSnapshot?.name ?? "",
          grandTotal: fmtExportMoney(inv.grandTotal),
          received: fmtExportMoney(paid),
          balance: fmtExportMoney(balance),
          payment: PAYMENT_STATUS_LABELS[payment] ?? payment,
          status: inv.status,
        };
      }
    ),
  },

  "sales-returns": {
    title: "Sales Returns",
    columns: [
      defineCol("slno", "Sl No"),
      defineCol("returnNo", "Return No"),
      defineCol("date", "Date"),
      defineCol("originalInvoice", "Original Invoice"),
      defineCol("customer", "Customer"),
      defineCol("type", "Type"),
      defineCol("amount", "Amount", { align: "right" }),
      defineCol("status", "Status"),
    ],
    fetchRows: paginatedListFetcher(
      (p) => salesReturnService.getAll(p),
      (ret) => ({
        returnNo: ret.returnNo,
        date: fmtExportDate(ret.returnDate),
        originalInvoice: ret.originalInvoiceNo,
        customer: ret.customerId?.name ?? ret.customerSnapshot?.name ?? "",
        type: ret.salesType,
        amount: fmtExportMoney(ret.grandTotal),
        status: ret.status,
      })
    ),
  },

  "purchase-returns": {
    title: "Purchase Returns",
    columns: [
      defineCol("slno", "Sl No"),
      defineCol("returnNo", "Return No"),
      defineCol("date", "Date"),
      defineCol("originalInvoice", "Original Invoice"),
      defineCol("vendor", "Vendor"),
      defineCol("amount", "Amount", { align: "right" }),
      defineCol("status", "Status"),
    ],
    fetchRows: paginatedListFetcher(
      (p) => purchaseReturnService.getAll(p),
      (ret) => ({
        returnNo: ret.returnNo,
        date: fmtExportDate(ret.returnDate),
        originalInvoice: ret.originalInvoiceNo,
        vendor: ret.vendorId?.name ?? ret.vendorSnapshot?.name ?? "",
        amount: fmtExportMoney(ret.grandTotal),
        status: ret.status,
      })
    ),
  },

  purchase: {
    title: "Purchase Invoices",
    columns: [
      defineCol("slno", "Sl No"),
      defineCol("invoiceNo", "Invoice No"),
      defineCol("vendorInvoiceNo", "Vendor Invoice No"),
      defineCol("date", "Date"),
      defineCol("vendor", "Vendor"),
      defineCol("grandTotal", "Grand Total", { align: "right" }),
      defineCol("status", "Status"),
    ],
    fetchRows: paginatedListFetcher(
      (p) => purchaseService.getAll(p),
      (inv) => ({
        invoiceNo: inv.invoiceNo,
        vendorInvoiceNo: inv.vendorInvoiceNo ?? "—",
        date: fmtExportDate(inv.purchaseDate),
        vendor:
          typeof inv.vendorId === "object" ? inv.vendorId.name : inv.vendorSnapshot?.name ?? "",
        grandTotal: fmtExportMoney(inv.grandTotal),
        status: inv.status,
      })
    ),
  },

  products: {
    title: "Products",
    columns: [
      defineCol("slno", "Sl No"),
      defineCol("name", "Name"),
      defineCol("code", "Code"),
      defineCol("unit", "Unit"),
      defineCol("category", "Category"),
      defineCol("salesRate", "Sales Rate", { align: "right" }),
      defineCol("purchaseRate", "Purchase Rate", { align: "right" }),
    ],
    fetchRows: paginatedListFetcher(
      (p) => itemService.getAll(p),
      (item) => ({
        name: item.name,
        code: item.code ?? "",
        unit: typeof item.uomId === "object" ? item.uomId.shortCode ?? item.uomId.name : "",
        category: typeof item.categoryId === "object" ? item.categoryId.name : "",
        salesRate: fmtExportMoney(itemSalesRate(item)),
        purchaseRate: fmtExportMoney(itemPurchaseRate(item)),
      })
    ),
  },

  customers: {
    title: "Customers",
    columns: [
      defineCol("slno", "Sl No"),
      defineCol("name", "Name"),
      defineCol("partyType", "Party Type"),
      defineCol("customerType", "Customer Type"),
      defineCol("email", "Email"),
      defineCol("phone", "Phone"),
    ],
    fetchRows: paginatedListFetcher(
      (p) => customerService.getAll(p),
      (c) => ({
        name: c.name,
        partyType: c.type ?? "",
        customerType: c.customerType ?? "—",
        email: c.email ?? "—",
        phone: c.phone ?? "—",
      })
    ),
  },

  warehouses: {
    title: "Warehouses",
    columns: [
      defineCol("slno", "Sl No"),
      defineCol("name", "Name"),
      defineCol("code", "Code"),
      defineCol("location", "Location"),
      defineCol("status", "Status"),
    ],
    fetchRows: paginatedListFetcher(
      (p) => warehouseService.getAll(p),
      (w) => ({
        name: w.name,
        code: w.code ?? "",
        location: w.description ?? "—",
        status: w.isActive ? "Active" : "Inactive",
      })
    ),
  },

  expenses: {
    title: "Expenses",
    columns: [
      defineCol("slno", "Sl No"),
      defineCol("expenseNo", "Expense No"),
      defineCol("date", "Date"),
      defineCol("category", "Category"),
      defineCol("title", "Title"),
      defineCol("amount", "Amount", { align: "right" }),
      defineCol("mode", "Payment Mode"),
    ],
    fetchRows: paginatedListFetcher(
      (p) => expenseService.getAll(p),
      (e) => ({
        expenseNo: e.expenseNo,
        date: fmtExportDate(e.date),
        category: expenseCategoryLabel(e.category),
        title: e.title,
        amount: fmtExportMoney(e.amount),
        mode: e.paymentMode?.replace(/_/g, " ") ?? "",
      })
    ),
  },

  receipts: {
    title: "Receipts",
    columns: [
      defineCol("slno", "Sl No"),
      defineCol("receiptNo", "Receipt No"),
      defineCol("date", "Date"),
      defineCol("customer", "Customer"),
      defineCol("amount", "Amount", { align: "right" }),
      defineCol("mode", "Payment Mode"),
    ],
    fetchRows: paginatedListFetcher(
      (p) => receiptService.getAll(p),
      (r) => ({
        receiptNo: r.voucherNo,
        date: fmtExportDate(r.date),
        customer: resolvePartyName(r),
        amount: fmtExportMoney(r.totalAmount),
        mode: r.paymentMode?.replace(/_/g, " ") ?? "",
      })
    ),
  },

  payments: {
    title: "Vendor Payments",
    columns: [
      defineCol("slno", "Sl No"),
      defineCol("paymentNo", "Voucher No"),
      defineCol("date", "Date"),
      defineCol("vendor", "Vendor"),
      defineCol("amount", "Amount", { align: "right" }),
      defineCol("mode", "Payment Mode"),
    ],
    fetchRows: paginatedListFetcher(
      (p) => vendorPaymentService.getAll(p),
      (p) => ({
        paymentNo: p.voucherNo,
        date: fmtExportDate(p.date),
        vendor: resolvePartyName(p),
        amount: fmtExportMoney(p.totalAmount),
        mode: p.paymentMode?.replace(/_/g, " ") ?? "",
      })
    ),
  },

  journals: {
    title: "Journal Entries",
    columns: [
      defineCol("slno", "Sl No"),
      defineCol("journalNo", "Journal No"),
      defineCol("date", "Date"),
      defineCol("source", "Source"),
      defineCol("reference", "Reference"),
      defineCol("debit", "Debit", { align: "right" }),
      defineCol("credit", "Credit", { align: "right" }),
      defineCol("status", "Status"),
    ],
    fetchRows: paginatedListFetcher(
      (p) => accountingService.getJournals(p).then((res) => ({
        data: Array.isArray(res.data) ? res.data : [],
        hasNext: res.hasNext,
      })),
      (row) => ({
        journalNo: row.journalNo,
        date: formatDate(row.entryDate),
        source: row.referenceType?.replace(/_/g, " ") ?? "",
        reference: row.referenceNo ?? "—",
        debit: fmtExportMoney(row.totalDebit),
        credit: fmtExportMoney(row.totalCredit),
        status: row.status,
      })
    ),
  },

  "chart-of-accounts": {
    title: "Chart of Accounts",
    columns: [
      defineCol("code", "Code"),
      defineCol("name", "Name"),
      defineCol("type", "Type"),
      defineCol("subLedger", "Sub-ledger"),
    ],
    fetchRows: async () => {
      const accounts = await accountingService.getChartOfAccounts();
      return accounts.map((a) => ({
        code: a.code,
        name: a.name,
        type: a.accountType,
        subLedger: a.subLedger ?? "—",
      }));
    },
  },
};

export function getExportConfig(reportType: string): ExportConfig | undefined {
  return exportRegistry[reportType];
}

export function getExportColumns(reportType: string) {
  return getExportConfig(reportType)?.columns ?? [];
}

export { exportRegistry };
