"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { colors } from "./Colors";

type PageHeaderProps = {
  title: string;
  description?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  actions?: React.ReactNode;
  showBackButton?: boolean;
  className?: string;
  btnClassName?: string;
};

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  actions,
  showBackButton = false,
  className = "",
  btnClassName = "",
}) => {
  const router = useRouter();

  return (
    <div className={`flex justify-between items-center mb-6 ${className}`}>
      {/* 🔹 Left Section */}
      <div className="flex items-start gap-3">
        {showBackButton && (
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft size={16} />
          </Button>
        )}

        <div>
          <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>

          {description && (
            <div className="text-sm text-muted-foreground">{description}</div>
          )}
        </div>
      </div>

      {/* 🔹 Right Actions */}
      {actions ?? (actionLabel ? (
        <Button
          size="sm"
          onClick={onAction}
          className={`gap-2 ${btnClassName} ${colors.mainColor} text-white hover:bg-opacity-90 transition-all`}
        >
          <Plus className="w-4 h-4 font-bold" />
          {actionLabel}
        </Button>
      ) : null)}
    </div>
  );
};

export default React.memo(PageHeader);
