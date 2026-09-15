import type { FooterButton } from "@/app/utilsComponents/BackPanel";
import { colors } from "@/app/utilsComponents/Colors";

export const UOM_FORM_ID = "uom-form";
export const PRODUCT_FORM_ID = "product-form";
export const CATEGORY_FORM_ID = "category-form";
export const CUSTOMER_FORM_ID = "customer-form";
export const PRICE_LEVEL_FORM_ID = "price-level-form";
export const TAX_MASTER_FORM_ID = "tax-master-form";
export const WAREHOUSE_FORM_ID = "warehouse-form";
export const BANK_FORM_ID = "bank-form";
export const BRANCH_FORM_ID = "branch-form";
export const FINANCIAL_YEAR_FORM_ID = "financial-year-form";
export const PURCHASE_INVOICE_FORM_ID = "purchase-invoice-form";
export const SALES_INVOICE_FORM_ID = "sales-invoice-form";
export const PURCHASE_RETURN_FORM_ID = "purchase-return-form";
export const SALES_RETURN_FORM_ID = "sales-return-form";
export const VOUCHER_FORM_ID = "voucher-form";
export const EXPENSE_FORM_ID = "expense-form";
export const USER_FORM_ID = "user-form";
export const ROLE_FORM_ID = "role-form";
export const COMPANY_FORM_ID = "company-form";

const primaryBtn = `rounded-lg px-6 py-2 text-sm  font-semibold text-white shadow-sm hover:bg-emerald-900 ${colors.mainColor}`;
const cancelBtn = "rounded-lg px-6 py-2 text-sm font-semibold";

export const footerPrimaryBtn = primaryBtn;
export const footerReturnBtn =
  "rounded-lg px-6 py-2 text-sm font-semibold text-white shadow-sm bg-orange-600 hover:bg-orange-700";
export const footerOutlineBtn = `${cancelBtn} border border-gray-300 bg-white text-gray-700 hover:bg-gray-50`;

type FormFooterOptions = {
  isEdit?: boolean;
  isPending?: boolean;
  onCancel: () => void;
};

export function uomFormFooterButtons({
  isEdit = false,
  isPending = false,
  onCancel,
}: FormFooterOptions): FooterButton[] {
  return [
    {
      label: "Cancel",
      variant: "outline",
      disabled: isPending,
      onClick: onCancel,
      className: cancelBtn,
    },
    {
      label: isPending ? "Saving..." : isEdit ? "Update UOM" : "Save UOM",
      type: "submit",
      form: UOM_FORM_ID,
      disabled: isPending,
      className: primaryBtn,
    },
  ];
}

export function productFormFooterButtons({
  isEdit = false,
  isPending = false,
  onCancel,
}: FormFooterOptions): FooterButton[] {
  return [
    {
      label: "Cancel",
      variant: "outline",
      disabled: isPending,
      onClick: onCancel,
      className: cancelBtn,
    },
    {
      label: isPending ? "Saving..." : isEdit ? "Update Product" : "Save Product",
      type: "submit",
      form: PRODUCT_FORM_ID,
      disabled: isPending,
      className: primaryBtn,
    },
  ];
}

export function categoryFormFooterButtons({
  isEdit = false,
  isPending = false,
  onCancel,
}: FormFooterOptions): FooterButton[] {
  return [
    {
      label: "Cancel",
      variant: "outline",
      disabled: isPending,
      onClick: onCancel,
      className: cancelBtn,
    },
    {
      label: isPending ? "Saving..." : isEdit ? "Update Category" : "Save Category",
      type: "submit",
      form: CATEGORY_FORM_ID,
      disabled: isPending,
      className: primaryBtn,
    },
  ];
}

export function expenseFormFooterButtons({
  isEdit = false,
  isPending = false,
  onCancel,
}: FormFooterOptions): FooterButton[] {
  return [
    {
      label: "Cancel",
      variant: "outline",
      disabled: isPending,
      onClick: onCancel,
      className: cancelBtn,
    },
    {
      label: isPending ? "Saving..." : isEdit ? "Update Expense" : "Save Expense",
      type: "submit",
      form: EXPENSE_FORM_ID,
      disabled: isPending,
      className: primaryBtn,
    },
  ];
}

export function customerFormFooterButtons({
  isEdit = false,
  isPending = false,
  onCancel,
}: FormFooterOptions): FooterButton[] {
  return [
    {
      label: "Cancel",
      variant: "outline",
      disabled: isPending,
      onClick: onCancel,
      className: cancelBtn,
    },
    {
      label: isPending ? "Saving..." : isEdit ? "Update Party" : "Save Party",
      type: "submit",
      form: CUSTOMER_FORM_ID,
      disabled: isPending,
      className: primaryBtn,
    },
  ];
}

export function priceLevelFormFooterButtons({
  isEdit = false,
  isPending = false,
  onCancel,
}: FormFooterOptions): FooterButton[] {
  return [
    {
      label: "Cancel",
      variant: "outline",
      disabled: isPending,
      onClick: onCancel,
      className: cancelBtn,
    },
    {
      label: isPending ? "Saving..." : isEdit ? "Update Price Level" : "Save Price Level",
      type: "submit",
      form: PRICE_LEVEL_FORM_ID,
      disabled: isPending,
      className: primaryBtn,
    },
  ];
}

export function taxMasterFormFooterButtons({
  isEdit = false,
  isPending = false,
  onCancel,
}: FormFooterOptions): FooterButton[] {
  return [
    {
      label: "Cancel",
      variant: "outline",
      disabled: isPending,
      onClick: onCancel,
      className: cancelBtn,
    },
    {
      label: isPending ? "Saving..." : isEdit ? "Update Tax Master" : "Save Tax Master",
      type: "submit",
      form: TAX_MASTER_FORM_ID,
      disabled: isPending,
      className: primaryBtn,
    },
  ];
}

export function warehouseFormFooterButtons({
  isEdit = false,
  isPending = false,
  onCancel,
}: FormFooterOptions): FooterButton[] {
  return [
    {
      label: "Cancel",
      variant: "outline",
      disabled: isPending,
      onClick: onCancel,
      className: cancelBtn,
    },
    {
      label: isPending ? "Saving..." : isEdit ? "Update Warehouse" : "Save Warehouse",
      type: "submit",
      form: WAREHOUSE_FORM_ID,
      disabled: isPending,
      className: primaryBtn,
    },
  ];
}

export function bankFormFooterButtons({
  isEdit = false,
  isPending = false,
  onCancel,
}: FormFooterOptions): FooterButton[] {
  return [
    {
      label: "Cancel",
      variant: "outline",
      disabled: isPending,
      onClick: onCancel,
      className: cancelBtn,
    },
    {
      label: isPending ? "Saving..." : isEdit ? "Update Bank Account" : "Save Bank Account",
      type: "submit",
      form: BANK_FORM_ID,
      disabled: isPending,
      className: primaryBtn,
    },
  ];
}

export function branchFormFooterButtons({
  isEdit = false,
  isPending = false,
  onCancel,
}: FormFooterOptions): FooterButton[] {
  return [
    {
      label: "Cancel",
      variant: "outline",
      disabled: isPending,
      onClick: onCancel,
      className: cancelBtn,
    },
    {
      label: isPending ? "Saving..." : isEdit ? "Update Branch" : "Save Branch",
      type: "submit",
      form: BRANCH_FORM_ID,
      disabled: isPending,
      className: primaryBtn,
    },
  ];
}

export function financialYearFormFooterButtons({
  isEdit = false,
  isPending = false,
  onCancel,
}: FormFooterOptions): FooterButton[] {
  return [
    {
      label: "Cancel",
      variant: "outline",
      disabled: isPending,
      onClick: onCancel,
      className: cancelBtn,
    },
    {
      label: isPending ? "Saving..." : isEdit ? "Update Financial Year" : "Save Financial Year",
      type: "submit",
      form: FINANCIAL_YEAR_FORM_ID,
      disabled: isPending,
      className: primaryBtn,
    },
  ];
}

export function purchaseInvoiceFormFooterButtons({
  isPending = false,
  onCancel,
}: Omit<FormFooterOptions, "isEdit">): FooterButton[] {
  return [
    {
      label: "Cancel",
      variant: "outline",
      disabled: isPending,
      onClick: onCancel,
      className: cancelBtn,
    },
    {
      label: isPending ? "Saving..." : "Save Invoice",
      type: "submit",
      form: PURCHASE_INVOICE_FORM_ID,
      disabled: isPending,
      className: primaryBtn,
    },
  ];
}

export function salesInvoiceFormFooterButtons({
  isPending = false,
  onCancel,
}: Omit<FormFooterOptions, "isEdit">): FooterButton[] {
  return [
    {
      label: "Cancel",
      variant: "outline",
      disabled: isPending,
      onClick: onCancel,
      className: cancelBtn,
    },
    {
      label: isPending ? "Saving..." : "Save Invoice",
      type: "submit",
      form: SALES_INVOICE_FORM_ID,
      disabled: isPending,
      className: primaryBtn,
    },
  ];
}

export function purchaseReturnFormFooterButtons({
  isPending = false,
  onCancel,
}: Omit<FormFooterOptions, "isEdit">): FooterButton[] {
  return [
    {
      label: "Cancel",
      variant: "outline",
      disabled: isPending,
      onClick: onCancel,
      className: cancelBtn,
    },
    {
      label: isPending ? "Saving..." : "Save Return",
      type: "submit",
      form: PURCHASE_RETURN_FORM_ID,
      disabled: isPending,
      className: primaryBtn,
    },
  ];
}

export function salesReturnFormFooterButtons({
  isPending = false,
  onCancel,
}: Omit<FormFooterOptions, "isEdit">): FooterButton[] {
  return [
    {
      label: "Cancel",
      variant: "outline",
      disabled: isPending,
      onClick: onCancel,
      className: cancelBtn,
    },
    {
      label: isPending ? "Saving..." : "Save Return",
      type: "submit",
      form: SALES_RETURN_FORM_ID,
      disabled: isPending,
      className: primaryBtn,
    },
  ];
}

export function receiptVoucherFormFooterButtons({
  isPending = false,
  onCancel,
}: Omit<FormFooterOptions, "isEdit">): FooterButton[] {
  return [
    {
      label: "Cancel",
      variant: "outline",
      disabled: isPending,
      onClick: onCancel,
      className: cancelBtn,
    },
    {
      label: isPending ? "Saving..." : "Save Receipt",
      type: "submit",
      form: VOUCHER_FORM_ID,
      disabled: isPending,
      className: primaryBtn,
    },
  ];
}

export function vendorPaymentFormFooterButtons({
  isPending = false,
  onCancel,
}: Omit<FormFooterOptions, "isEdit">): FooterButton[] {
  return [
    {
      label: "Cancel",
      variant: "outline",
      disabled: isPending,
      onClick: onCancel,
      className: cancelBtn,
    },
    {
      label: isPending ? "Saving..." : "Save Payment",
      type: "submit",
      form: VOUCHER_FORM_ID,
      disabled: isPending,
      className: primaryBtn,
    },
  ];
}

export function printFooterButton(onPrint: () => void): FooterButton {
  return {
    label: "Print Invoice",
    variant: "outline",
    onClick: onPrint,
    className: footerOutlineBtn,
  };
}

export function userFormFooterButtons({
  isEdit = false,
  isPending = false,
  onCancel,
}: FormFooterOptions): FooterButton[] {
  return [
    {
      label: "Cancel",
      variant: "outline",
      disabled: isPending,
      onClick: onCancel,
      className: cancelBtn,
    },
    {
      label: isPending ? "Saving..." : isEdit ? "Update User" : "Save User",
      type: "submit",
      form: USER_FORM_ID,
      disabled: isPending,
      className: primaryBtn,
    },
  ];
}

export function roleFormFooterButtons({
  isEdit = false,
  isPending = false,
  onCancel,
}: FormFooterOptions): FooterButton[] {
  return [
    {
      label: "Cancel",
      variant: "outline",
      disabled: isPending,
      onClick: onCancel,
      className: cancelBtn,
    },
    {
      label: isPending ? "Saving..." : isEdit ? "Update Role" : "Save Role",
      type: "submit",
      form: ROLE_FORM_ID,
      disabled: isPending,
      className: primaryBtn,
    },
  ];
}
