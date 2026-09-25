import {
  LayoutDashboard,
  Layers,
  Package,
  Users,
  Tag,
  ShoppingCart,
  FileText,
  ClipboardList,
  BarChart3,
  Wallet,
  Boxes,
  GitBranch,
  Calendar,
  Warehouse,
  Banknote,
  Settings,
  Shield,
  Building2,
  BookOpen,
  Scale,
  Percent,
  PieChart,
  UserCog,
} from "lucide-react";
import { ViewPermissionKey } from "../config/permissions";

interface MenuItem {
  name: string;
  path?: string;
  icon: React.ReactNode;
  permissionKey?: ViewPermissionKey;
  superAdminOnly?: boolean;
  subMenu?: {
    name: string;
    path: string;
    icon?: React.ReactNode;
    permissionKey?: ViewPermissionKey;
    superAdminOnly?: boolean;
  }[];
}

interface Section {
  title: string;
  items: MenuItem[];
}

export const sections: Section[] = [
  {
    title: "MAIN",
    items: [
      {
        name: "Dashboard",
        path: "/dashboard",
        icon: <LayoutDashboard size={18} />,
        permissionKey: "dashboard",
      },
    ],
  },
  {
    title: "MASTER",
    items: [
      {
        name: "Masters",
        icon: <Layers size={18} />,
        subMenu: [
          {
            name: "Product",
            path: "/master/product",
            icon: <Package size={16} />,
            permissionKey: "master.product",
          },
          {
            name: "Customer",
            path: "/master/customer",
            icon: <Users size={16} />,
            permissionKey: "master.customer",
          },
          {
            name: "Category",
            path: "/master/category",
            icon: <Tag size={16} />,
            permissionKey: "master.category",
          },
          { name: "UOM", path: "/master/uom", icon: <Boxes size={16} />, permissionKey: "master.uom" },
          {
            name: "Price Level",
            path: "/master/priceLevel",
            icon: <Boxes size={16} />,
            permissionKey: "master.priceLevel",
          },
          {
            name: "Tax Master",
            path: "/master/taxMaster",
            icon: <Percent size={16} />,
            permissionKey: "master.taxMaster",
          },
          {
            name: "Branch",
            path: "/master/branch",
            icon: <GitBranch size={16} />,
            permissionKey: "master.branch",
          },
          {
            name: "Financial Year",
            path: "/master/financialYear",
            icon: <Calendar size={16} />,
            permissionKey: "master.financialYear",
          },
          {
            name: "Warehouse",
            path: "/master/warehouse",
            icon: <Warehouse size={16} />,
            permissionKey: "master.warehouse",
          },
          {
            name: "Bank Account",
            path: "/master/bank",
            icon: <Banknote size={16} />,
            permissionKey: "master.bank",
          },
        ],
      },
    ],
  },
  {
    title: "SALES",
    items: [
      {
        name: "Sales",
        icon: <ShoppingCart size={18} />,
        subMenu: [
          {
            name: "Sales Invoice",
            path: "/sales/salesInvoice",
            icon: <FileText size={16} />,
            permissionKey: "sales.invoice",
          },
          {
            name: "Quotation",
            path: "/sales/quotation",
            icon: <FileText size={16} />,
            permissionKey: "sales.quotation",
          },
          {
            name: "Sales Return",
            path: "/sales/salesReturn",
            icon: <FileText size={16} />,
            permissionKey: "sales.return",
          },
        ],
      },
    ],
  },
  {
    title: "PURCHASE",
    items: [
      {
        name: "Purchase",
        icon: <ClipboardList size={18} />,
        subMenu: [
          {
            name: "Purchase Invoice",
            path: "/purchase/purchaseInvoice",
            icon: <FileText size={16} />,
            permissionKey: "purchase.invoice",
          },
          {
            name: "Purchase Return",
            path: "/purchase/purchaseReturn",
            icon: <FileText size={16} />,
            permissionKey: "purchase.return",
          },
        ],
      },
    ],
  },
  {
    title: "VOUCHERS",
    items: [
      {
        name: "Vouchers",
        icon: <Wallet size={18} />,
        subMenu: [
          {
            name: "Receipt Voucher",
            path: "/reciept/payments",
            icon: <FileText size={16} />,
            permissionKey: "receipt.voucher",
          },
          {
            name: "Payment Voucher",
            path: "/payment/vendor-payments",
            icon: <FileText size={16} />,
            permissionKey: "payment.voucher",
          },
        ],
      },
    ],
  },
  {
    title: "EXPENSE",
    items: [
      {
        name: "Expense",
        icon: <Banknote size={18} />,
        subMenu: [
          {
            name: "Expense Entry",
            path: "/expense",
            icon: <FileText size={16} />,
            permissionKey: "expense.voucher",
          },
          {
            name: "Expense Report",
            path: "/reports/expense",
            icon: <BarChart3 size={16} />,
            permissionKey: "reports.expense",
          },
        ],
      },
    ],
  },
  {
    title: "REPORTS",
    items: [
      {
        name: "Reports",
        icon: <BarChart3 size={18} />,
        subMenu: [
          {
            name: "Stock Report",
            path: "/reports/stockReport",
            icon: <Package size={16} />,
            permissionKey: "reports.stock",
          },
          {
            name: "Sales Report",
            path: "/reports/salesReport",
            icon: <ShoppingCart size={16} />,
            permissionKey: "reports.sales",
          },
          {
            name: "Purchase Report",
            path: "/reports/purchaseReport",
            icon: <ClipboardList size={16} />,
            permissionKey: "reports.purchase",
          },
          {
            name: "Ledger Report",
            path: "/reports/shop",
            icon: <FileText size={16} />,
            permissionKey: "reports.shop",
          },
          {
            name: "Purchase History",
            path: "/reports/purchaseHistory",
            icon: <FileText size={16} />,
            permissionKey: "reports.purchaseHistory",
          },
          {
            name: "Sales History",
            path: "/reports/salesHistory",
            icon: <FileText size={16} />,
            permissionKey: "reports.salesHistory",
          },
          {
            name: "Sales Return Report",
            path: "/reports/salesReturnReport",
            icon: <ShoppingCart size={16} />,
            permissionKey: "reports.salesReturnHistory",
          },
          {
            name: "Purchase Return Report",
            path: "/reports/purchaseReturnReport",
            icon: <ClipboardList size={16} />,
            permissionKey: "reports.purchaseReturnHistory",
          },
          {
            name: "Sales Return History",
            path: "/reports/salesReturnHistory",
            icon: <FileText size={16} />,
            permissionKey: "reports.salesReturnHistory",
          },
          {
            name: "Purchase Return History",
            path: "/reports/purchaseReturnHistory",
            icon: <FileText size={16} />,
            permissionKey: "reports.purchaseReturnHistory",
          },
        ],
      },
    ],
  },
  {
    title: "ACCOUNTING",
    items: [
      {
        name: "Accounting",
        icon: <BookOpen size={18} />,
        subMenu: [
          {
            name: "Journal Entries",
            path: "/accounting/entries",
            icon: <FileText size={16} />,
            permissionKey: "accounting.entries",
          },
          {
            name: "Customer Outstanding",
            path: "/accounting/customer-balance",
            icon: <Users size={16} />,
            permissionKey: "accounting.customerBalance",
          },
          {
            name: "Sub Ledgers",
            path: "/accounting/sub-ledgers",
            icon: <Wallet size={16} />,
            permissionKey: "accounting.subLedgers",
          },
          {
            name: "Trial Balance",
            path: "/accounting/trial-balance",
            icon: <Scale size={16} />,
            permissionKey: "accounting.trialBalance",
          },
          {
            name: "Profit & Loss",
            path: "/accounting/profit-loss",
            icon: <PieChart size={16} />,
            permissionKey: "accounting.profitLoss",
          },
          {
            name: "Balance Sheet",
            path: "/accounting/balance-sheet",
            icon: <BarChart3 size={16} />,
            permissionKey: "accounting.balanceSheet",
          },
          {
            name: "Chart of Accounts",
            path: "/accounting/chart-of-accounts",
            icon: <Layers size={16} />,
            permissionKey: "accounting.chartOfAccounts",
          },
        ],
      },
    ],
  },
  {
    title: "SETTINGS",
    items: [
      {
        name: "Settings",
        icon: <Settings size={18} />,
        subMenu: [
          {
            name: "Company",
            path: "/settings/company",
            icon: <Building2 size={16} />,
            permissionKey: "settings.company",
            superAdminOnly: true,
          },
          {
            name: "Users",
            path: "/settings/users",
            icon: <Users size={16} />,
            permissionKey: "settings.users",
          },
          {
            name: "Roles",
            path: "/settings/roles",
            icon: <UserCog size={16} />,
            permissionKey: "settings.roles",
          },
          {
            name: "Role Permissions",
            path: "/settings/permissions",
            icon: <Shield size={16} />,
            permissionKey: "settings.permissions",
            superAdminOnly: true,
          },
        ],
      },
    ],
  },
];
