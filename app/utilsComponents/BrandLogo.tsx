"use client";

import { BRAND } from "@/app/config/brand";

type BrandLogoVariant = "default" | "onDark" | "sidebar";

type BrandLogoProps = {
  width?: number;
  className?: string;
  variant?: BrandLogoVariant;
};

const variantConfig: Record<
  BrandLogoVariant,
  {
    wrapper: string;
    img: string;
    blendMode?: React.CSSProperties["mixBlendMode"];
    defaultWidth: number;
  }
> = {
  default: {
    wrapper: "rounded-xl bg-white px-3 py-2 shadow-sm ring-1 ring-black/5",
    img: "object-contain",
    blendMode: "multiply",
    defaultWidth: 260,
  },
  onDark: {
    wrapper:
      "rounded-2xl bg-white/20 px-4 py-4 shadow-lg ring-1 ring-white/25 backdrop-blur-sm isolate",
    img: "object-contain drop-shadow-md",
    blendMode: "multiply",
    defaultWidth: 300,
  },
  sidebar: {
    wrapper: "min-w-0 flex-1 justify-start bg-transparent px-0 py-0",
    img: "max-h-9 w-auto object-contain object-left",
    blendMode: "multiply",
    defaultWidth: 132,
  },
};

export function BrandTitle({
  className = "",
  size = "md",
  light = false,
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  light?: boolean;
}) {
  const sizeClass = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  }[size];

  if (light) {
    return (
      <p
        className={`${sizeClass} font-extrabold tracking-tight leading-tight text-white ${className}`}
      >
        Bill <span className="text-emerald-200">Menta</span>
      </p>
    );
  }

  return (
    <p
      className={`${sizeClass} font-extrabold tracking-tight leading-tight ${className}`}
    >
      <span className="text-[#1E2235]">Bill</span>
      <span className="text-[#00D1C1]"> Menta</span>
    </p>
  );
}

export default function BrandLogo({
  width,
  className = "",
  variant = "default",
}: BrandLogoProps) {
  const config = variantConfig[variant];
  const resolvedWidth = width ?? config.defaultWidth;

  return (
    <div className={`flex justify-center ${config.wrapper} ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={encodeURI(BRAND.logo)}
        alt={BRAND.name}
        style={{
          width: variant === "sidebar" ? undefined : resolvedWidth,
          maxWidth: "100%",
          height: "auto",
          mixBlendMode: config.blendMode,
        }}
        className={config.img}
      />
    </div>
  );
}
