export const normalizeStateCode = (code?: string | number | null) => {
  const value = String(code ?? "").trim();
  if (!value) return "";
  return value.padStart(2, "0");
};

export const stateCodeFromGstin = (gstin?: string | null) => {
  const value = String(gstin ?? "").trim().toUpperCase();
  if (value.length < 2) return "";
  return normalizeStateCode(value.slice(0, 2));
};

export const resolveGstSupplyType = (
  supplierStateCode?: string | null,
  placeOfSupplyStateCode?: string | null
): "intra" | "inter" => {
  const supplier = normalizeStateCode(supplierStateCode);
  const supply = normalizeStateCode(placeOfSupplyStateCode);
  if (!supplier || !supply) return "intra";
  return supplier === supply ? "intra" : "inter";
};

export const calculateLineGst = ({
  taxableValue,
  taxPercent,
  supplierStateCode,
  placeOfSupplyStateCode,
}: {
  taxableValue: number;
  taxPercent: number;
  supplierStateCode?: string | null;
  placeOfSupplyStateCode?: string | null;
}) => {
  const taxable = Number(taxableValue) || 0;
  const rate = Number(taxPercent) || 0;

  if (taxable <= 0 || rate <= 0) {
    return { cgst: 0, sgst: 0, igst: 0, supplyType: "intra" as const };
  }

  const supplyType = resolveGstSupplyType(supplierStateCode, placeOfSupplyStateCode);

  if (supplyType === "inter") {
    const igst = Number(((taxable * rate) / 100).toFixed(2));
    return { cgst: 0, sgst: 0, igst, supplyType: "inter" as const };
  }

  const halfRate = rate / 2;
  const sgst = Number(((taxable * halfRate) / 100).toFixed(2));
  const cgst = Number(((taxable * halfRate) / 100).toFixed(2));
  return { cgst, sgst, igst: 0, supplyType: "intra" as const };
};

export const gstSupplyTypeLabel = (supplyType: "intra" | "inter") =>
  supplyType === "inter" ? "Inter-state (IGST)" : "Intra-state (CGST + SGST)";
