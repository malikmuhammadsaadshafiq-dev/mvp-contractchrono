"use client";

import { useEffect } from "react";
import { X, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
}

export function Toast({ message, type = "info", onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-2 fade-in duration-200">
      <div className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-md shadow-lg border",
        "bg-bg-raised border-border-default",
        type === "success" && "border-success/30",
        type === "error" && "border-error/30"
      )}>
        {type === "success" && <CheckCircle2 className="w-4 h-4 text-success" />}
        {type === "error" && <AlertCircle className="w-4 h-4 text-error" />}
        <span className="text-sm text-text-primary">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 p-1 hover:bg-bg-active rounded-md transition-colors"
        >
          <X className="w-3.5 h-3.5 text-text-secondary" />
        </button>
      </div>
    </div>
  );
}