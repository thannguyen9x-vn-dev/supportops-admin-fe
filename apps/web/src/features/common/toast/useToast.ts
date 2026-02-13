"use client";

import { useContext } from "react";

import { ToastContext } from "@/features/common/toast/ToastProvider";

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return context;
}
