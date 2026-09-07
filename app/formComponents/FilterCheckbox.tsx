"use client";

interface FilterCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export default function FilterCheckbox({
  label,
  checked,
  onChange,
  className = "",
}: FilterCheckboxProps) {
  return (
    <label
      className={`flex h-8 w-full cursor-pointer items-center gap-2 rounded-lg border border-input bg-transparent px-2.5 text-sm text-foreground transition-colors hover:bg-muted/30 ${className}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-3.5 rounded border-input accent-foreground"
      />
      <span className="truncate">{label}</span>
    </label>
  );
}
