// utils/logger.ts

export const logger = (
  label: string,
  data?: any,
  enabled: boolean = true
) => {
  if (!enabled || process.env.NODE_ENV === "production") return;

  console.log(
    `%c${label}`,
    "color: #22c55e; font-weight: bold;",
    data
  );
};