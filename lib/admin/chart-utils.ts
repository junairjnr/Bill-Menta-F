export const CHART_COLORS = {
  primary: "#059669",
  secondary: "#2563EB",
  tertiary: "#7C3AED",
  quaternary: "#F59E0B",
  grid: "#E5E7EB",
  track: "#F3F4F6",
};

export const PIE_PALETTE = [
  "#059669",
  "#2563EB",
  "#7C3AED",
  "#F59E0B",
  "#EC4899",
  "#14B8A6",
  "#6366F1",
  "#EF4444",
];

export const chartMargin = { top: 8, right: 8, left: 0, bottom: 0 };

export const axisTickStyle = {
  fill: "#9CA3AF",
  fontSize: 11,
};

export const tooltipStyle = {
  contentStyle: {
    borderRadius: 8,
    border: "1px solid #E5E7EB",
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    fontSize: 12,
  },
};

export function formatTrend(value: number, direction: "up" | "down"): string {
  const sign = direction === "up" ? "+" : "-";
  return `${sign}${value}%`;
}

export function toSeriesData(values: number[]): { index: number; value: number }[] {
  return values.map((value, index) => ({ index, value }));
}
