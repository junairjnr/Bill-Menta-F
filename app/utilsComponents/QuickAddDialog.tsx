"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { FooterButton } from "@/app/utilsComponents/BackPanel";

interface QuickAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footerButtons: FooterButton[];
}

export default function QuickAddDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footerButtons,
}: QuickAddDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden border-0 p-0 shadow-2xl sm:max-w-3xl z-[200]">
        <DialogHeader className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-white px-6 py-4">
          <div className="flex items-center gap-3 pr-8">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm">
              <Plus className="h-4 w-4" />
            </div>
            <div className="min-w-0 text-left">
              <DialogTitle className="text-base font-semibold text-gray-900">
                {title}
              </DialogTitle>
              {description && (
                <DialogDescription className="mt-0.5 text-xs text-gray-500">
                  {description}
                </DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto bg-gray-50/60 px-4 py-4 sm:px-6">
          <div className="rounded-xl bg-white p-1 shadow-sm ring-1 ring-gray-100">
            {children}
          </div>
        </div>

        <DialogFooter className="gap-2 border-t bg-white px-6 py-4 sm:justify-end mb-0">
          {footerButtons.map((btn, i) => (
            <Button
              key={i}
              type={btn.type ?? "button"}
              form={btn.form}
              variant={
                btn.variant as "default" | "outline" | "destructive" | undefined
              }
              disabled={btn.disabled}
              onClick={btn.onClick}
              className={btn.className}
            >
              {btn.label}
            </Button>
          ))}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
