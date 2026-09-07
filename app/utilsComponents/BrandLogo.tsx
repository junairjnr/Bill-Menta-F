"use client";

import { BRAND } from "@/app/config/brand";

type BrandLogoProps = {
  width?: number;
  className?: string;
};

export default function BrandLogo({ width = 280, className = "" }: BrandLogoProps) {
  return (
    <div
      className={`flex justify-center rounded-md bg-white px-3 py-2 ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={encodeURI(BRAND.logo)}
        alt={BRAND.name}
        style={{ width, maxWidth: "100%", height: "auto" }}
        className="object-contain"
      />
    </div>
  );
}
