import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import type { SalesInvoicePrintData } from "./types";
import { fmtDisc, fmtNum } from "./formatters";

const LOGO_BLUE = "#0B2D5B";
const BLUE = LOGO_BLUE;
const BORDER = "#000000";

const styles = StyleSheet.create({
  page: {
    padding: 10,
    fontSize: 8,
    fontFamily: "Helvetica",
    color: "#111111",
  },
  outerBorder: {
    borderWidth: 1,
    borderColor: BORDER,
    flex: 1,
  },
  header: {
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 6,
    paddingHorizontal: 8,
    backgroundColor: "#FFFFFF",
  },
  logoImg: {
    width: 300,
    height: 56,
    objectFit: "contain",
    marginBottom: 4,
    backgroundColor: "#FFFFFF",
  },
  headerText: {
    alignItems: "center",
  },
  companyName: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: BLUE,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  headerLine: {
    fontSize: 8,
    marginBottom: 2,
    textAlign: "center",
  },
  sectionBar: {
    backgroundColor: BLUE,
    paddingVertical: 4,
    alignItems: "center",
  },
  sectionBarText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.5,
  },
  metaGrid: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  metaCol: {
    width: "50%",
    borderRightWidth: 1,
    borderRightColor: BORDER,
  },
  metaColLast: {
    width: "50%",
  },
  metaRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    minHeight: 16,
  },
  metaRowLast: {
    flexDirection: "row",
    minHeight: 16,
  },
  metaLabel: {
    width: "42%",
    padding: 3,
    fontFamily: "Helvetica-Bold",
    borderRightWidth: 1,
    borderRightColor: BORDER,
  },
  metaValue: {
    width: "58%",
    padding: 3,
  },
  billingGrid: {
    padding: 6,
  },
  billingRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  billingLabel: {
    width: 70,
    fontFamily: "Helvetica-Bold",
  },
  billingValue: {
    flex: 1,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: BLUE,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  tableHeaderCell: {
    color: "#FFFFFF",
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    paddingVertical: 4,
    paddingHorizontal: 2,
    borderRightWidth: 1,
    borderRightColor: BORDER,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    minHeight: 18,
  },
  tableFillerRow: {
    flexDirection: "row",
    minHeight: 14,
  },
  tableCell: {
    fontSize: 7,
    paddingVertical: 3,
    paddingHorizontal: 2,
    borderRightWidth: 1,
    borderRightColor: BORDER,
    textAlign: "center",
  },
  tableCellLeft: {
    textAlign: "left",
  },
  tableCellRight: {
    textAlign: "right",
  },
  tableTotalRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    backgroundColor: "#EEF3FA",
    minHeight: 18,
  },
  footer: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: BORDER,
    flex: 1,
  },
  footerLeft: {
    width: "58%",
    padding: 6,
    flex: 1,
  },
  footerRight: {
    width: "42%",
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    borderLeftWidth: 1,
    borderLeftColor: BORDER,
  },
  footerRightSummary: {
    flexGrow: 0,
  },
  wordsLabel: {
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  wordsValue: {
    marginBottom: 8,
    fontSize: 8,
  },
  bankBar: {
    backgroundColor: BLUE,
    paddingVertical: 3,
    paddingHorizontal: 6,
    marginBottom: 4,
  },
  bankBarText: {
    color: "#FFFFFF",
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
  },
  bankRow: {
    flexDirection: "row",
    marginBottom: 2,
  },
  bankLabel: {
    width: 55,
    fontFamily: "Helvetica-Bold",
  },
  termsTitle: {
    marginTop: 8,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  summaryLabel: {
    fontSize: 8,
  },
  summaryValue: {
    fontSize: 8,
    textAlign: "right",
  },
  grandTotalBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: BLUE,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginTop: 2,
  },
  grandTotalText: {
    color: "#FFFFFF",
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
  },
  signatory: {
    paddingHorizontal: 8,
    paddingBottom: 6,
    alignItems: "flex-end",
  },
  signatoryText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingTop: 4,
    minWidth: 120,
    textAlign: "center",
  },
});

const COL = {
  sl: "4%",
  desc: "24%",
  hsn: "7%",
  uom: "5%",
  rate: "8%",
  qty: "5%",
  disc: "5%",
  taxable: "10%",
  cgst: "9%",
  sgst: "9%",
  total: "10%",
};

/** Minimum filler rows so short invoices fill the table area without crowding the footer */
const MIN_ITEM_ROWS = 8;

function BlankTableRow() {
  return (
    <View style={styles.tableFillerRow}>
      <Text style={[styles.tableCell, { width: COL.sl }]} />
      <Text style={[styles.tableCell, { width: COL.desc }]} />
      <Text style={[styles.tableCell, { width: COL.hsn }]} />
      <Text style={[styles.tableCell, { width: COL.uom }]} />
      <Text style={[styles.tableCell, { width: COL.rate }]} />
      <Text style={[styles.tableCell, { width: COL.qty }]} />
      <Text style={[styles.tableCell, { width: COL.disc }]} />
      <Text style={[styles.tableCell, { width: COL.taxable }]} />
      <Text style={[styles.tableCell, { width: COL.cgst }]} />
      <Text style={[styles.tableCell, { width: COL.sgst }]} />
      <Text style={[styles.tableCell, { width: COL.total, borderRightWidth: 0 }]} />
    </View>
  );
}

function MetaRow({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  const Row = last ? styles.metaRowLast : styles.metaRow;
  return (
    <View style={Row}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

export default function SalesTaxInvoicePdf({ data }: { data: SalesInvoicePrintData }) {
  const isReturn = data.documentType === "return";
  const hasTax = (data.totalTax ?? 0) > 0;
  const isInterState = data.gstSupplyType === "inter";
  const docTitle = isReturn ? "TAX RETURN" : hasTax ? "TAX INVOICE" : "INVOICE";
  const refLabel = isReturn ? "Return No" : "Invoice No";
  const dateLabel = isReturn ? "Return Date" : "Invoice Date";
  const amountWordsLabel = isReturn
    ? "Total Return Amount in Words:"
    : "Total Invoice Amount in Words:";
  const totalQty = data.items.reduce((s, r) => s + r.qty, 0);
  const totalTaxable = data.items.reduce((s, r) => s + r.taxableValue, 0);
  const totalCgst = data.items.reduce((s, r) => s + r.cgst, 0);
  const totalSgst = data.items.reduce((s, r) => s + r.sgst, 0);
  const totalLine = data.items.reduce((s, r) => s + r.total, 0);
  const cashDiscountAmt =
    data.cashDiscountAmt > 0
      ? data.cashDiscountAmt
      : Math.max(0, Number((data.billTotal - data.grandTotal).toFixed(2)));

  const customerAddressLine = data.customerPhone
    ? `${data.customerAddress}, Contact No: ${data.customerPhone}`
    : data.customerAddress;

  return (
    <Document title={`${docTitle} ${data.invoiceNo}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.outerBorder}>
          {/* Company header */}
          <View style={styles.header}>
            {data.logoSrc ? <Image src={data.logoSrc} style={styles.logoImg} /> : null}
            <View style={styles.headerText}>
              {!data.logoSrc ? (
                <Text style={styles.companyName}>{data.companyName}</Text>
              ) : null}
              <Text style={styles.headerLine}>{data.companyAddress}</Text>
              <Text style={styles.headerLine}>{data.companyGstin}</Text>
              <Text style={styles.headerLine}>
                {data.companyEmail} | {data.companyPhone.replace("Phone: ", "")}
              </Text>
            </View>
          </View>

          {/* Tax invoice title */}
          <View style={styles.sectionBar}>
            <Text style={styles.sectionBarText}>{docTitle}</Text>
          </View>

          {/* Invoice / return meta */}
          <View style={styles.metaGrid}>
            <View style={styles.metaCol}>
              <MetaRow label={refLabel} value={data.invoiceNo} />
              <MetaRow label={dateLabel} value={data.invoiceDate} />
              {!isReturn ? (
                <MetaRow
                  label="Sale Mode"
                  value={data.saleMode === "cash" ? "Cash Sale" : "Credit Sale"}
                />
              ) : null}
              {isReturn && data.originalInvoiceNo ? (
                <MetaRow label="Original Invoice No" value={data.originalInvoiceNo} />
              ) : null}
              <MetaRow label="Place of Supply" value={data.placeOfSupply} />
              <MetaRow
                label="State"
                value={`${data.supplyState}, Code: ${data.supplyStateCode}`}
                last={!isReturn}
              />
              {isReturn ? (
                <MetaRow label="Date of Supply" value={data.dateOfSupply} last />
              ) : null}
            </View>
            {!isReturn ? (
              <View style={styles.metaColLast}>
                <MetaRow label="Transport Mode" value={data.transportMode} />
                <MetaRow label="Vehicle Number" value={data.vehicleNumber} />
                <MetaRow label="E-Way Bill No" value={data.ewayBillNo} />
                <MetaRow label="Date of Supply" value={data.dateOfSupply} last />
              </View>
            ) : (
              <View style={styles.metaColLast}>
                <MetaRow label="Transport Mode" value={data.transportMode} />
                <MetaRow label="Vehicle Number" value={data.vehicleNumber} />
                <MetaRow label="E-Way Bill No" value={data.ewayBillNo} last />
              </View>
            )}
          </View>

          {/* Billing address */}
          <View style={styles.sectionBar}>
            <Text style={styles.sectionBarText}>Billing Address</Text>
          </View>
          <View style={styles.billingGrid}>
            <View style={styles.billingRow}>
              <Text style={styles.billingLabel}>Name:</Text>
              <Text style={styles.billingValue}>{data.customerName}</Text>
            </View>
            <View style={styles.billingRow}>
              <Text style={styles.billingLabel}>Address:</Text>
              <Text style={styles.billingValue}>{customerAddressLine}</Text>
            </View>
            <View style={styles.billingRow}>
              <Text style={styles.billingLabel}>GSTIN:</Text>
              <Text style={styles.billingValue}>{data.customerGstin}</Text>
            </View>
            <View style={styles.billingRow}>
              <Text style={styles.billingLabel}>State:</Text>
              <Text style={styles.billingValue}>
                {data.customerState}, Code: {data.customerStateCode}
              </Text>
            </View>
          </View>

          {/* Items table header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { width: COL.sl }]}>Sl.No</Text>
            <Text style={[styles.tableHeaderCell, { width: COL.desc }]}>Product Description</Text>
            <Text style={[styles.tableHeaderCell, { width: COL.hsn }]}>HSN</Text>
            <Text style={[styles.tableHeaderCell, { width: COL.uom }]}>UOM</Text>
            <Text style={[styles.tableHeaderCell, { width: COL.rate }]}>Rate</Text>
            <Text style={[styles.tableHeaderCell, { width: COL.qty }]}>Qty</Text>
            <Text style={[styles.tableHeaderCell, { width: COL.disc }]}>Disc</Text>
            <Text style={[styles.tableHeaderCell, { width: COL.taxable }]}>Taxable Value</Text>
            <Text style={[styles.tableHeaderCell, { width: COL.cgst }]}>CGST 9%</Text>
            <Text style={[styles.tableHeaderCell, { width: COL.sgst }]}>SGST 9%</Text>
            <Text style={[styles.tableHeaderCell, { width: COL.total, borderRightWidth: 0 }]}>
              Total
            </Text>
          </View>

          {/* Item rows */}
          {data.items.map((row) => (
            <View key={row.slNo} style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: COL.sl }]}>{row.slNo}</Text>
              <Text style={[styles.tableCell, styles.tableCellLeft, { width: COL.desc }]}>
                {row.description}
              </Text>
              <Text style={[styles.tableCell, { width: COL.hsn }]}>{row.hsn}</Text>
              <Text style={[styles.tableCell, { width: COL.uom }]}>{row.uom}</Text>
              <Text style={[styles.tableCell, styles.tableCellRight, { width: COL.rate }]}>
                {fmtNum(row.rate)}
              </Text>
              <Text style={[styles.tableCell, { width: COL.qty }]}>{row.qty}</Text>
              <Text style={[styles.tableCell, { width: COL.disc }]}>{fmtDisc(row.discount)}</Text>
              <Text style={[styles.tableCell, styles.tableCellRight, { width: COL.taxable }]}>
                {fmtNum(row.taxableValue)}
              </Text>
              <Text style={[styles.tableCell, styles.tableCellRight, { width: COL.cgst }]}>
                {fmtNum(row.cgst)}
              </Text>
              <Text style={[styles.tableCell, styles.tableCellRight, { width: COL.sgst }]}>
                {fmtNum(row.sgst)}
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.tableCellRight,
                  { width: COL.total, borderRightWidth: 0 },
                ]}
              >
                {fmtNum(row.total)}
              </Text>
            </View>
          ))}

          {/* Blank filler rows to fill table area when few items */}
          {Array.from({ length: Math.max(0, MIN_ITEM_ROWS - data.items.length) }).map((_, i) => (
            <BlankTableRow key={`filler-${i}`} />
          ))}

          {/* Table totals row */}
          <View style={styles.tableTotalRow}>
            <Text style={[styles.tableCell, styles.tableCellLeft, { width: COL.sl }]} />
            <Text
              style={[
                styles.tableCell,
                styles.tableCellLeft,
                { width: COL.desc, fontFamily: "Helvetica-Bold" },
              ]}
            >
              Total
            </Text>
            <Text style={[styles.tableCell, { width: COL.hsn }]} />
            <Text style={[styles.tableCell, { width: COL.uom }]} />
            <Text style={[styles.tableCell, { width: COL.rate }]} />
            <Text style={[styles.tableCell, { width: COL.qty, fontFamily: "Helvetica-Bold" }]}>
              {totalQty}
            </Text>
            <Text style={[styles.tableCell, { width: COL.disc }]} />
            <Text
              style={[
                styles.tableCell,
                styles.tableCellRight,
                { width: COL.taxable, fontFamily: "Helvetica-Bold" },
              ]}
            >
              {fmtNum(totalTaxable)}
            </Text>
            <Text
              style={[
                styles.tableCell,
                styles.tableCellRight,
                { width: COL.cgst, fontFamily: "Helvetica-Bold" },
              ]}
            >
              {fmtNum(totalCgst)}
            </Text>
            <Text
              style={[
                styles.tableCell,
                styles.tableCellRight,
                { width: COL.sgst, fontFamily: "Helvetica-Bold" },
              ]}
            >
              {fmtNum(totalSgst)}
            </Text>
            <Text
              style={[
                styles.tableCell,
                styles.tableCellRight,
                { width: COL.total, borderRightWidth: 0, fontFamily: "Helvetica-Bold" },
              ]}
            >
              {fmtNum(totalLine)}
            </Text>
          </View>

          {/* Footer — keep summary block together on print */}
          <View style={styles.footer} wrap={false}>
            <View style={styles.footerLeft}>
              <Text style={styles.wordsLabel}>{amountWordsLabel}</Text>
              <Text style={styles.wordsValue}>{data.amountInWords}</Text>

              {data.bank && (
                <>
                  <View style={styles.bankBar}>
                    <Text style={styles.bankBarText}>Bank Details</Text>
                  </View>
                  <View style={styles.bankRow}>
                    <Text style={styles.bankLabel}>Bank</Text>
                    <Text>{data.bank.bankName}</Text>
                  </View>
                  <View style={styles.bankRow}>
                    <Text style={styles.bankLabel}>Bank Name</Text>
                    <Text>{data.bank.accountName}</Text>
                  </View>
                  <View style={styles.bankRow}>
                    <Text style={styles.bankLabel}>Bank A/C</Text>
                    <Text>{data.bank.accountNumber}</Text>
                  </View>
                  <View style={styles.bankRow}>
                    <Text style={styles.bankLabel}>Bank IFSC</Text>
                    <Text>{data.bank.ifscCode}</Text>
                  </View>
                </>
              )}

              <Text style={styles.termsTitle}>Terms & Conditions</Text>
              <Text>{data.terms || " "}</Text>
            </View>

            <View style={styles.footerRight}>
              <View style={styles.footerRightSummary}>
                <SummaryRow label="Subtotal" value={fmtNum(data.lineNetAmount)} />
                {hasTax && (
                  <>
                    {isInterState ? (
                      <SummaryRow label="IGST" value={fmtNum(data.totalIGST ?? 0)} />
                    ) : (
                      <>
                        <SummaryRow label="CGST" value={fmtNum(data.totalCGST)} />
                        <SummaryRow label="SGST" value={fmtNum(data.totalSGST)} />
                      </>
                    )}
                    <SummaryRow label="Total Tax Amount" value={fmtNum(data.totalTax)} />
                  </>
                )}
                <SummaryRow label="Total" value={fmtNum(data.total)} />
                <SummaryRow
                  label="Rounded"
                  value={
                    data.roundOff >= 0
                      ? `+${fmtNum(data.roundOff)}`
                      : fmtNum(data.roundOff)
                  }
                />
                <SummaryRow label="Bill Total" value={fmtNum(data.billTotal)} />
                {cashDiscountAmt > 0 && (
                  <SummaryRow
                    label="Discount"
                    value={`- ${fmtNum(cashDiscountAmt)}`}
                  />
                )}
                <View style={styles.grandTotalBar}>
                  <Text style={styles.grandTotalText}>AMOUNT TO COLLECT</Text>
                  <Text style={styles.grandTotalText}>{fmtNum(data.grandTotal)}</Text>
                </View>
              </View>
              <View style={styles.signatory}>
                <Text style={styles.signatoryText}>Authorized Signatory</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
