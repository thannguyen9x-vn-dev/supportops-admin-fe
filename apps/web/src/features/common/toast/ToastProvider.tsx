"use client";

import { createContext, useCallback, useMemo, useState } from "react";
import type { AlertColor } from "@mui/material";

import { AppToast } from "@/features/common/components/AppToast";

type ToastState = {
  autoHideDuration: number;
  message: string;
  open: boolean;
  severity: AlertColor;
  toastKey: number;
};

type ShowToastOptions = {
  autoHideDuration?: number;
};

type ToastContextValue = {
  error: (message: string, options?: ShowToastOptions) => void;
  info: (message: string, options?: ShowToastOptions) => void;
  show: (severity: AlertColor, message: string, options?: ShowToastOptions) => void;
  success: (message: string, options?: ShowToastOptions) => void;
  warning: (message: string, options?: ShowToastOptions) => void;
};

const DEFAULT_AUTO_HIDE_DURATION = 3000;

const INITIAL_TOAST_STATE: ToastState = {
  autoHideDuration: DEFAULT_AUTO_HIDE_DURATION,
  message: "",
  open: false,
  severity: "success",
  toastKey: 0,
};

export const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState>(INITIAL_TOAST_STATE);

  const show = useCallback(
    (severity: AlertColor, message: string, options?: ShowToastOptions) => {
      setToast((prev) => ({
        autoHideDuration: options?.autoHideDuration ?? DEFAULT_AUTO_HIDE_DURATION,
        message,
        open: true,
        severity,
        toastKey: prev.toastKey + 1,
      }));
    },
    [],
  );

  const success = useCallback(
    (message: string, options?: ShowToastOptions) => {
      show("success", message, options);
    },
    [show],
  );

  const error = useCallback(
    (message: string, options?: ShowToastOptions) => {
      show("error", message, options);
    },
    [show],
  );

  const info = useCallback(
    (message: string, options?: ShowToastOptions) => {
      show("info", message, options);
    },
    [show],
  );

  const warning = useCallback(
    (message: string, options?: ShowToastOptions) => {
      show("warning", message, options);
    },
    [show],
  );

  const closeToast = useCallback(() => {
    setToast((prev) => ({
      ...prev,
      open: false,
    }));
  }, []);

  const value = useMemo<ToastContextValue>(
    () => ({
      error,
      info,
      show,
      success,
      warning,
    }),
    [error, info, show, success, warning],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <AppToast
        autoHideDuration={toast.autoHideDuration}
        message={toast.message}
        onClose={closeToast}
        open={toast.open}
        severity={toast.severity}
        toastKey={toast.toastKey}
      />
    </ToastContext.Provider>
  );
}
