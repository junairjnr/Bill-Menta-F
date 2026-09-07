"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  focusNextEnterNavField,
  getTodayISO,
  isSelectMenuOpen,
} from "@/app/utilsComponents/invoiceFormUtils";

type UseInvoiceFormShortcutsOptions = {
  onEnterAtLastField?: () => void;
};

export function useInvoiceFormShortcuts({
  onEnterAtLastField,
}: UseInvoiceFormShortcutsOptions = {}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [allowPastDates, setAllowPastDates] = useState(false);
  const today = useMemo(() => getTodayISO(), []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || !e.shiftKey) return;
      if (e.key.toLowerCase() !== "d") return;

      e.preventDefault();
      setAllowPastDates((prev) => {
        const next = !prev;
        toast.success(
          next
            ? "Past dates enabled — you can pick earlier invoice dates"
            : "Date locked to today only",
          { duration: 2500 }
        );
        return next;
      });
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const minDate = allowPastDates ? undefined : today;
  const maxDate = today;

  const handleFormKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key !== "Enter" || e.shiftKey || e.metaKey || e.ctrlKey) return;

      const target = e.target as HTMLElement;
      if (target.tagName === "TEXTAREA") return;
      if (isSelectMenuOpen(target)) return;

      const form = formRef.current;
      if (!form) return;

      const moved = focusNextEnterNavField(form, target);
      if (moved) {
        e.preventDefault();
        return;
      }

      if (target.closest("[data-enter-nav]") && onEnterAtLastField) {
        e.preventDefault();
        onEnterAtLastField();
      }
    },
    [onEnterAtLastField]
  );

  return {
    formRef,
    allowPastDates,
    today,
    minDate,
    maxDate,
    handleFormKeyDown,
    dateHint: allowPastDates
      ? "Past dates enabled · Ctrl+Shift+D to lock to today"
      : "To enable past dates · Ctrl+Shift+D",
  };
}


// import { Document, Image, Page, Text, View } from "@react-pdf/renderer";
// import type { InvoicePayload, InvoiceTerm } from "@/types/invoice.types";
// import {
//   amountToWords,
//   fmtInvoiceDate,
//   fmtMoney,
// } from "@/lib/invoice/formatters";
// import { colStyle, ITEM_COL, styles } from "@/lib/invoice/invoice-styles";

// type Props = {
//   data: InvoicePayload;
//   logoSrc: string;
//   qrDataUrl?: string;
// };

// function PageFooter({ company }: { company: InvoicePayload["company"] }) {
//   return (
//     <View fixed style={styles.footer}>
//       <View style={styles.footerTop}>
//         <View>
//           <Text style={styles.footerCompany}>{company.nameEn}</Text>
//           <Text style={styles.footerContact}>
//             {[company.phone, company.email, company.website]
//               .filter(Boolean)
//               .join("  ·  ")}
//           </Text>
//         </View>
//         <View style={styles.pageNumber}>
//           <Text
//             style={styles.pageText}
//             render={({ pageNumber, totalPages }) =>
//               `Page ${pageNumber} of ${totalPages}`
//             }
//           />
//         </View>
//       </View>
//       <View style={styles.footerLine} />
//       <Text style={styles.footerArabic}>{company.nameAr}</Text>
//     </View>
//   );
// }

// function InvoiceHeader({
//   company,
//   logoSrc,
//   invoiceNumber,
//   compact,
// }: {
//   company: InvoicePayload["company"];
//   logoSrc: string;
//   invoiceNumber: string;
//   compact?: boolean;
// }) {
//   return (
//     <View style={[styles.header, compact ? styles.headerCompact : {}]}>
//       <View style={styles.headerBrand}>
//         <Image src={logoSrc} style={compact ? styles.logoSm : styles.logo} />
//         <View>
//           <Text style={compact ? styles.companyNameSm : styles.companyName}>
//             {company.nameEn}
//           </Text>
//           {company.taglineEn ? (
//             <Text style={compact ? styles.companyTaglineSm : styles.companyTagline}>
//               {company.taglineEn}
//             </Text>
//           ) : null}
//           {company.addressEn ? (
//             <Text style={compact ? styles.companyAddressSm : styles.companyAddress}>
//               {company.addressEn}
//             </Text>
//           ) : null}
//           <Text style={compact ? styles.companyContactSm : styles.companyContact}>
//             {[company.phone, company.email].filter(Boolean).join("  ·  ")}
//           </Text>
//         </View>
//       </View>
//       <View style={styles.invoiceHeading}>
//         <Text style={compact ? styles.invoiceLabelSm : styles.invoiceLabel}>
//           TAX INVOICE
//         </Text>
//         <Text style={compact ? styles.invoiceLabelArSm : styles.invoiceLabelAr}>
//           فاتورة ضريبية
//         </Text>
//         <Text style={compact ? styles.invoiceNumberSm : styles.invoiceNumber}>
//           {invoiceNumber}
//         </Text>
//       </View>
//     </View>
//   );
// }

// function MetaRow({
//   label,
//   arabic,
//   value,
// }: {
//   label: string;
//   arabic: string;
//   value: string;
// }) {
//   return (
//     <View style={styles.metaRow}>
//       <View>
//         <Text style={styles.metaLabel}>{label}</Text>
//         <Text style={styles.metaArabic}>{arabic}</Text>
//       </View>
//       <Text style={styles.metaValue}>{value}</Text>
//     </View>
//   );
// }

// function TermsSection({
//   titleEn,
//   titleAr,
//   items,
// }: {
//   titleEn: string;
//   titleAr: string;
//   items: InvoiceTerm[];
// }) {
//   return (
//     <View style={styles.termsSection}>
//       <View style={styles.termsHeader}>
//         <Text style={styles.termsTitle}>{titleEn}</Text>
//         <Text style={styles.termsTitleAr}>{titleAr}</Text>
//       </View>
//       {items.map((item, index) => (
//         <View key={index} style={styles.termRow}>
//           <View style={styles.termEnglish}>
//             <View style={styles.numberCircle}>
//               <Text style={styles.numberText}>{index + 1}</Text>
//             </View>
//             <Text style={styles.termText}>{item.en}</Text>
//           </View>
//           <Text style={styles.termArabic}>{item.ar}</Text>
//         </View>
//       ))}
//     </View>
//   );
// }

// export default function InvoiceDocument({ data, logoSrc, qrDataUrl }: Props) {
//   const { order, company, bank, terms, currency, invoiceNumber } = data;
//   const addr = order.deliveryAddress;
//   const invoiceDate = fmtInvoiceDate(order.deliveredAt ?? order.createdAt);
//   const deliveryDate = order.deliveredAt
//     ? fmtInvoiceDate(order.deliveredAt)
//     : "—";

//   return (
//     <Document
//       title={`Invoice ${invoiceNumber}`}
//       author={company.nameEn}
//       subject="Tax Invoice"
//     >
//       {/* PAGE 1 */}
//       <Page size="A4" style={styles.page}>
//         <InvoiceHeader
//           company={company}
//           logoSrc={logoSrc}
//           invoiceNumber={invoiceNumber}
//         />

//         <View style={styles.infoGrid}>
//           <View style={styles.customerCard}>
//             <Text style={styles.sectionLabel}>BILL TO</Text>
//             <Text style={styles.sectionLabelAr}>بيانات العميل</Text>
//             <Text style={styles.customerName}>{addr.fullName}</Text>
//             <Text style={styles.customerAddress}>
//               {[addr.line1, addr.line2, addr.city, addr.state, addr.country, addr.zipCode]
//                 .filter(Boolean)
//                 .join(", ")}
//             </Text>
//             {addr.phone ? (
//               <Text style={styles.customerPhone}>{addr.phone}</Text>
//             ) : null}
//           </View>

//           <View style={styles.metaCard}>
//             <MetaRow label="Invoice No." arabic="رقم الفاتورة" value={invoiceNumber} />
//             <MetaRow label="Order No." arabic="رقم الطلب" value={order.orderNumber} />
//             <MetaRow label="Invoice Date" arabic="تاريخ الفاتورة" value={invoiceDate} />
//             <MetaRow label="Delivery Date" arabic="تاريخ التسليم" value={deliveryDate} />
//             <MetaRow
//               label="Payment"
//               arabic="الدفع"
//               value={order.paymentStatus?.toUpperCase() ?? "—"}
//             />
//           </View>
//         </View>

//         <View style={styles.productSection}>
//           <Text style={styles.tableTitleEn}>PRODUCT DETAILS</Text>
//           <Text style={styles.tableTitleAr}>تفاصيل المنتج</Text>
//           <View style={styles.table}>
//             <View style={styles.tableHeader}>
//               <Text style={[styles.tableHeaderText, colStyle(ITEM_COL.desc)]}>
//                 Description
//               </Text>
//               <Text style={[styles.tableHeaderText, colStyle(ITEM_COL.qty, "right")]}>
//                 Qty
//               </Text>
//               <Text style={[styles.tableHeaderText, colStyle(ITEM_COL.unit, "right")]}>
//                 Unit Price
//               </Text>
//               <Text style={[styles.tableHeaderText, colStyle(ITEM_COL.amt, "right")]}>
//                 Amount
//               </Text>
//             </View>
//             {order.items.map((item, index) => {
//               const amount = item.subtotal ?? item.price * item.quantity;
//               const isLast = index === order.items.length - 1;
//               return (
//                 <View
//                   key={`item-${index}-${item.sku?.trim() || item.name}`}
//                   wrap={false}
//                   style={[
//                     styles.tableRow,
//                     index % 2 === 1 ? styles.tableRowAlt : {},
//                     isLast ? styles.tableRowLast : {},
//                   ]}
//                 >
//                   <View style={colStyle(ITEM_COL.desc)}>
//                     <Text style={styles.productName}>{item.name}</Text>
//                     {item.sku ? (
//                       <Text style={styles.productSku}>SKU: {item.sku}</Text>
//                     ) : null}
//                   </View>
//                   <Text
//                     style={[
//                       styles.tableCell,
//                       styles.tableCellTop,
//                       colStyle(ITEM_COL.qty, "right"),
//                     ]}
//                   >
//                     {item.quantity}
//                   </Text>
//                   <Text
//                     style={[
//                       styles.tableCell,
//                       styles.tableCellTop,
//                       colStyle(ITEM_COL.unit, "right"),
//                     ]}
//                   >
//                     {fmtMoney(item.price, currency)}
//                   </Text>
//                   <Text
//                     style={[
//                       styles.tableCellBold,
//                       styles.tableCellTop,
//                       colStyle(ITEM_COL.amt, "right"),
//                     ]}
//                   >
//                     {fmtMoney(amount, currency)}
//                   </Text>
//                 </View>
//               );
//             })}
//           </View>
//         </View>

//         <View wrap={false}>
//         <View style={styles.warranty}>
//           <View style={styles.warrantyTitle}>
//             <Text style={styles.warrantyTitleText}>
//               WARRANTY & PRODUCT INFORMATION
//             </Text>
//             <Text style={styles.warrantyTitleArabic}>الضمان ومعلومات المنتج</Text>
//           </View>
//           <Text style={styles.warrantyText}>{terms.warranty}</Text>
//         </View>

//         <View style={styles.paymentGrid}>
//           <View style={styles.bankCard}>
//             <View style={styles.cardHeader}>
//               <Text style={styles.cardTitle}>BANK TRANSFER</Text>
//               <Text style={styles.cardTitleAr}>تفاصيل التحويل البنكي</Text>
//             </View>
//             {(
//               [
//                 ["Bank", bank.name],
//                 ["Beneficiary", bank.beneficiary],
//                 ["IBAN", bank.iban],
//                 ["SWIFT", bank.swift],
//                 ["Currency", bank.currency],
//               ] as const
//             ).map(([label, value]) => (
//               <View key={label} style={styles.bankRow}>
//                 <Text style={styles.bankLabel}>{label}</Text>
//                 <Text style={styles.bankValue}>{value}</Text>
//               </View>
//             ))}
//           </View>

//           <View style={styles.totalCard}>
//             <View style={styles.cardHeader}>
//               <Text style={styles.cardTitle}>PAYMENT SUMMARY</Text>
//               <Text style={styles.cardTitleAr}>ملخص الدفع</Text>
//             </View>
//             <View style={styles.totalRow}>
//               <Text style={styles.totalLabel}>Subtotal</Text>
//               <Text style={styles.totalValue}>
//                 {fmtMoney(order.subtotal, currency)}
//               </Text>
//             </View>
//             {order.discountAmount > 0 ? (
//               <View style={styles.totalRow}>
//                 <Text style={styles.totalLabel}>Discount</Text>
//                 <Text style={styles.totalValue}>
//                   - {fmtMoney(order.discountAmount, currency)}
//                 </Text>
//               </View>
//             ) : null}
//             {order.shippingCharge > 0 ? (
//               <View style={styles.totalRow}>
//                 <Text style={styles.totalLabel}>Shipping</Text>
//                 <Text style={styles.totalValue}>
//                   {fmtMoney(order.shippingCharge, currency)}
//                 </Text>
//               </View>
//             ) : null}
//             {order.taxAmount > 0 ? (
//               <View style={styles.totalRow}>
//                 <Text style={styles.totalLabel}>Tax</Text>
//                 <Text style={styles.totalValue}>
//                   {fmtMoney(order.taxAmount, currency)}
//                 </Text>
//               </View>
//             ) : null}
//             <View style={styles.grandTotal}>
//               <Text style={styles.grandTotalLabel}>TOTAL</Text>
//               <Text style={styles.grandTotalValue}>
//                 {fmtMoney(order.totalAmount, currency)}
//               </Text>
//             </View>
//             <Text style={styles.amountWordsLabel}>Amount in words</Text>
//             <Text style={styles.amountWords}>
//               {amountToWords(order.totalAmount)} Qatari Riyals
//             </Text>
//           </View>
//         </View>

//         <View style={styles.paymentReference}>
//           <Text style={styles.paymentReferenceTitle}>PAYMENT REFERENCE</Text>
//           <Text style={styles.paymentReferenceText}>
//             Payment reference: {invoiceNumber}
//           </Text>
//           <Text style={styles.paymentReferenceText}>
//             Order reference: {order.orderNumber}
//           </Text>
//           <Text style={styles.paymentStatus}>
//             PAYMENT STATUS: {order.paymentStatus?.toUpperCase() ?? "—"}
//           </Text>
//         </View>
//         </View>

//         <PageFooter company={company} />
//       </Page>

//       {/* PAGE 2 */}
//       <Page size="A4" style={styles.page}>
//         <InvoiceHeader
//           company={company}
//           logoSrc={logoSrc}
//           invoiceNumber={invoiceNumber}
//           compact
//         />

//         <View style={styles.termsIntro}>
//           <Text style={styles.termsIntroTitle}>TERMS & CONDITIONS</Text>
//           <Text style={styles.termsIntroArabic}>الأحكام والشروط</Text>
//           <Text style={styles.termsIntroText}>
//             The following terms apply to this invoice, order and supplied products.
//           </Text>
//         </View>

//         <TermsSection titleEn="Sales Terms" titleAr="شروط البيع" items={terms.sales} />
//         <TermsSection titleEn="Payment Terms" titleAr="شروط الدفع" items={terms.payment} />
//         <TermsSection titleEn="Delivery Terms" titleAr="شروط التسليم" items={terms.delivery} />

//         <View style={styles.signatureArea}>
//           <View style={styles.signatureBox}>
//             {qrDataUrl ? <Image src={qrDataUrl} style={styles.qr} /> : null}
//             <Text style={styles.qrText}>{invoiceNumber}</Text>
//           </View>
//           <View style={styles.signatureBox}>
//             <Text style={styles.signatureTitle}>CUSTOMER SIGNATURE</Text>
//             <Text style={styles.signatureArabic}>توقيع العميل</Text>
//             <View style={styles.signatureLine} />
//           </View>
//           <View style={[styles.signatureBox, styles.signatureBoxLast]}>
//             <Text style={styles.signatureTitle}>AUTHORIZED SIGNATURE</Text>
//             <Text style={styles.signatureArabic}>توقيع معتمد</Text>
//             <View style={styles.signatureLine} />
//             <Text style={styles.signatureCompany}>{company.nameEn}</Text>
//           </View>
//         </View>

//         <PageFooter company={company} />
//       </Page>
//     </Document>
//   );
// }