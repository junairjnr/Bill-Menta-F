import type { GroupBase, StylesConfig } from "react-select";
import type { SelectOption } from "./selectTypes";

export const getSelectStyles = <T extends SelectOption = SelectOption>(
  hasError: boolean,
  embedded = false
): StylesConfig<T, false, GroupBase<T>> => ({
  container: (base) => ({ ...base, flex: 1, minWidth: 0 }),
  control: (base, state) => ({
    ...base,
    minHeight: 36,
    border: "none",
    borderBottom: embedded
      ? "none"
      : `2px solid ${
          hasError ? "#ef4444" : state.isFocused ? "#2563eb" : "#d1d5db"
        }`,
    borderRadius: 0,
    boxShadow: "none",
    background: "transparent",
    cursor: "pointer",
    "&:hover": embedded
      ? {}
      : { borderBottomColor: hasError ? "#ef4444" : "#2563eb" },
  }),
  valueContainer: (base) => ({
    ...base,
    flex: 1,
    minWidth: 0,
    padding: "0 4px 4px 0",
  }),
  input: (base) => ({ ...base, margin: 0, padding: 0 }),
  placeholder: (base) => ({
    ...base,
    fontSize: 14,
    color: "#9ca3af",
  }),
  singleValue: (base) => ({
    ...base,
    fontSize: 14,
    color: "#111827",
  }),
  indicatorsContainer: (base) => ({
    ...base,
    flexShrink: 0,
    alignSelf: "stretch",
    display: "flex",
    alignItems: "center",
  }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (base) => ({
    ...base,
    padding: "0 0 0 4px",
    color: "#6b7280",
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  menu: (base) => ({
    ...base,
    fontSize: 13,
    borderRadius: 8,
    overflow: "hidden",
    boxShadow: "0 4px 16px rgba(0,0,0,.12)",
  }),
  option: (base, state) => ({
    ...base,
    fontSize: 13,
    backgroundColor: state.isSelected
      ? "#059669"
      : state.isFocused
        ? "#ecfdf5"
        : "#fff",
    color: state.isSelected ? "#fff" : "#111827",
    cursor: "pointer",
  }),
});
