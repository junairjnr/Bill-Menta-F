/** Count non-empty string filters and checked boolean filters. */
export function countActiveFilters(
  values: Record<string, string | boolean | undefined | null>,
): number {
  return Object.values(values).reduce<number>((count, value) => {
    if (typeof value === "boolean") return count + (value ? 1 : 0);
    if (typeof value === "string") return count + (value.trim() !== "" ? 1 : 0);
    return count;
  }, 0);
}
