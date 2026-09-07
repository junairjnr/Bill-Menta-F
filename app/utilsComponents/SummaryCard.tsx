"use client";

import {
  Package,
  IndianRupee,
  FileText,
  Receipt,
  ShoppingBag,
  Building2,
  ArrowDownLeft,
  ArrowUpRight,
  Activity,
  Hash,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SummaryItem {
  label: string;
  value: string | number;
  highlight?: boolean;
  icon?: LucideIcon;
  tone?: Tone;
}

type Tone = "green" | "red" | "blue" | "amber" | "violet" | "cyan" | "indigo" | "rose";

const TONES: Record<Tone, { card: string; icon: string; iconColor: string; label: string }> = {
  green: {
    card: "border-emerald-100 bg-emerald-50/40",
    icon: "bg-emerald-100",
    iconColor: "text-emerald-600",
    label: "text-emerald-700/80",
  },
  red: {
    card: "border-red-100 bg-red-50/40",
    icon: "bg-red-100",
    iconColor: "text-red-600",
    label: "text-red-700/80",
  },
  blue: {
    card: "border-blue-100 bg-blue-50/40",
    icon: "bg-blue-100",
    iconColor: "text-blue-600",
    label: "text-blue-700/80",
  },
  amber: {
    card: "border-amber-100 bg-amber-50/40",
    icon: "bg-amber-100",
    iconColor: "text-amber-600",
    label: "text-amber-700/80",
  },
  violet: {
    card: "border-violet-100 bg-violet-50/40",
    icon: "bg-violet-100",
    iconColor: "text-violet-600",
    label: "text-violet-700/80",
  },
  cyan: {
    card: "border-cyan-100 bg-cyan-50/40",
    icon: "bg-cyan-100",
    iconColor: "text-cyan-600",
    label: "text-cyan-700/80",
  },
  indigo: {
    card: "border-indigo-100 bg-indigo-50/40",
    icon: "bg-indigo-100",
    iconColor: "text-indigo-600",
    label: "text-indigo-700/80",
  },
  rose: {
    card: "border-rose-100 bg-rose-50/40",
    icon: "bg-rose-100",
    iconColor: "text-rose-600",
    label: "text-rose-700/80",
  },
};

const TONE_CYCLE: Tone[] = ["blue", "green", "violet", "amber", "cyan", "rose", "indigo", "red"];

const LABEL_META: { match: RegExp; icon: LucideIcon; tone: Tone }[] = [
  { match: /grand total|total value/i, icon: IndianRupee, tone: "indigo" },
  { match: /net amount/i, icon: IndianRupee, tone: "blue" },
  { match: /sgst/i, icon: Receipt, tone: "amber" },
  { match: /cgst/i, icon: Receipt, tone: "cyan" },
  { match: /tax/i, icon: Receipt, tone: "violet" },
  { match: /retail/i, icon: ShoppingBag, tone: "violet" },
  { match: /wholesale/i, icon: Building2, tone: "cyan" },
  { match: /total in/i, icon: ArrowDownLeft, tone: "green" },
  { match: /total out/i, icon: ArrowUpRight, tone: "red" },
  { match: /movement/i, icon: Activity, tone: "blue" },
  { match: /invoice/i, icon: FileText, tone: "blue" },
  { match: /item/i, icon: Package, tone: "green" },
];

function resolveMeta(item: SummaryItem, index: number) {
  if (item.icon && item.tone) return { Icon: item.icon, tone: item.tone };
  const found = LABEL_META.find((m) => m.match.test(item.label));
  const tone = item.highlight ? "indigo" : (found?.tone ?? TONE_CYCLE[index % TONE_CYCLE.length]);
  const Icon = found?.icon ?? (item.highlight ? IndianRupee : Hash);
  return { Icon, tone };
}

export default function SummaryCard({
  items,
  loading,
}: {
  items: SummaryItem[];
  loading?: boolean;
}) {
  if (!items.length) return null;

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
        loading && "pointer-events-none opacity-60",
      )}
    >
      {items.map((item, i) => {
        const { Icon, tone } = resolveMeta(item, i);
        const t = TONES[tone];
        const isHL = item.highlight;

        return (
          <div
            key={i}
            className={cn(
              "flex items-center gap-2 rounded-lg border px-2.5 py-2 shadow-sm transition-shadow hover:shadow-md",
              isHL
                ? "border-indigo-200 bg-gradient-to-br from-indigo-50 to-violet-50"
                : t.card,
            )}
          >
            <div
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-md",
                isHL ? "bg-indigo-100" : t.icon,
              )}
            >
              <Icon
                className={cn("h-3.5 w-3.5", isHL ? "text-indigo-600" : t.iconColor)}
                strokeWidth={2.2}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  "truncate text-[10px] font-medium leading-tight",
                  isHL ? "text-indigo-600/80" : t.label,
                )}
              >
                {item.label}
              </p>
              <p
                className={cn(
                  "truncate text-sm font-bold leading-tight text-gray-900",
                  isHL && "text-indigo-900",
                )}
              >
                {item.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export type { SummaryItem, Tone };
