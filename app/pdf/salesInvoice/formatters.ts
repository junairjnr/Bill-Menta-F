const ones = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];

const tens = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];

const toWords = (n: number): string => {
  if (n === 0) return "";
  if (n < 20) return ones[n];
  if (n < 100)
    return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
  if (n < 1000)
    return (
      ones[Math.floor(n / 100)] +
      " Hundred" +
      (n % 100 ? " " + toWords(n % 100) : "")
    );
  if (n < 100000)
    return (
      toWords(Math.floor(n / 1000)) +
      " Thousand" +
      (n % 1000 ? " " + toWords(n % 1000) : "")
    );
  if (n < 10000000)
    return (
      toWords(Math.floor(n / 100000)) +
      " Lakh" +
      (n % 100000 ? " " + toWords(n % 100000) : "")
    );
  return (
    toWords(Math.floor(n / 10000000)) +
    " Crore" +
    (n % 10000000 ? " " + toWords(n % 10000000) : "")
  );
};

/** Invoice-style amount in words: "Four Thousand One Hundred - Seventy Six Only" */
export const invoiceAmountInWords = (amount: number): string => {
  const rounded = Math.round(amount);
  if (rounded === 0) return "Zero Only";

  const major = Math.floor(rounded / 100) * 100;
  const minor = rounded % 100;

  if (minor === 0) return `${toWords(major)} Only`;
  if (major === 0) return `${toWords(minor)} Only`;
  return `${toWords(major)} - ${toWords(minor)} Only`;
};

export const fmtInvoiceDate = (value: string | Date): string => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

export const fmtNum = (value: number, decimals = 2): string => {
  return value.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

export const fmtDisc = (value: number): string => {
  if (!value) return "0.0%";
  return `${value.toFixed(1)}%`;
};

export const orDash = (value?: string | null): string => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "—";
};
