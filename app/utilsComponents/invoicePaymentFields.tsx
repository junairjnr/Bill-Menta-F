"use client";

import FormSelect from "@/app/formComponents/FormSelect";
import SelectWithAddField from "@/app/formComponents/SelectWithAddField";
import { useBankAccounts } from "@/app/hooks/masterHooks/bankHook/useBank";
import {
  DEFAULT_INVOICE_PAYMENT_MODE,
  INVOICE_PAYMENT_MODES,
  invoicePaymentAccountLabel,
  needsBankAccount,
} from "./paymentConstants";

interface InvoicePaymentMethodSelectProps {
  label?: string;
  name: string;
  value: string;
  required?: boolean;
  disabled?: boolean;
  compact?: boolean;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
}

export function InvoicePaymentMethodSelect({
  label = "Payment Method",
  name,
  value,
  required,
  disabled,
  compact = false,
  onChange,
  onBlur,
}: InvoicePaymentMethodSelectProps) {
  const selectValue = value || DEFAULT_INVOICE_PAYMENT_MODE;

  if (compact) {
    return (
      <SelectWithAddField
        instanceId={name}
        value={selectValue}
        options={INVOICE_PAYMENT_MODES}
        disabled={disabled}
        onChange={(val) =>
          onChange({ target: { name, value: val } } as React.ChangeEvent<HTMLSelectElement>)
        }
        onBlur={() =>
          onBlur?.({ target: { name } } as React.FocusEvent<HTMLSelectElement>)
        }
      />
    );
  }

  return (
    <FormSelect
      label={label}
      name={name}
      value={selectValue}
      required={required}
      disabled={disabled}
      options={INVOICE_PAYMENT_MODES}
      onChange={onChange}
      onBlur={onBlur ?? (() => undefined)}
    />
  );
}

interface InvoicePaymentAccountSelectProps {
  paymentMode: string;
  name: string;
  value: string;
  required?: boolean;
  compact?: boolean;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
}

export function InvoicePaymentAccountSelect({
  paymentMode,
  name,
  value,
  required,
  compact = false,
  onChange,
  onBlur,
}: InvoicePaymentAccountSelectProps) {
  const { data: bankData } = useBankAccounts();
  const bankAccounts = bankData?.data ?? [];
  const bankOptions = bankAccounts.map((bank: any) => ({
    label: `${bank.accountName}${bank.bankName ? ` — ${bank.bankName}` : ""}`,
    value: bank._id,
  }));

  if (!needsBankAccount(paymentMode)) {
    if (compact) {
      return (
        <span className="block rounded-md border border-gray-200 bg-gray-50 px-2 py-1.5 text-xs text-gray-600">
          {invoicePaymentAccountLabel(paymentMode)}
        </span>
      );
    }
    return (
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">Account</label>
        <div className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700">
          {invoicePaymentAccountLabel(paymentMode)}
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <SelectWithAddField
        instanceId={name}
        value={value}
        options={bankOptions}
        placeholder="Select account"
        onChange={(val) =>
          onChange({ target: { name, value: val } } as React.ChangeEvent<HTMLSelectElement>)
        }
        onBlur={() =>
          onBlur?.({ target: { name } } as React.FocusEvent<HTMLSelectElement>)
        }
      />
    );
  }

  return (
    <FormSelect
      label="Account"
      name={name}
      value={value}
      required={required}
      placeholder="Select bank account"
      options={bankOptions}
      onChange={onChange}
      onBlur={onBlur ?? (() => undefined)}
    />
  );
}
