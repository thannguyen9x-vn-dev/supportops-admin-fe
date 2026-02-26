"use client";

import type { ReactNode } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

type ConfirmDialogProps = {
  cancelLabel: string;
  confirmColor?: "error" | "primary" | "secondary" | "info" | "success" | "warning";
  confirmLabel: string;
  description?: ReactNode;
  isProcessing?: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  open: boolean;
  processingLabel?: string;
  title: ReactNode;
};

export function ConfirmDialog({
  cancelLabel,
  confirmColor = "primary",
  confirmLabel,
  description,
  isProcessing = false,
  onClose,
  onConfirm,
  open,
  processingLabel,
  title,
}: ConfirmDialogProps) {
  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>{title}</DialogTitle>
      {description ? (
        <DialogContent>
          <DialogContentText>{description}</DialogContentText>
        </DialogContent>
      ) : null}
      <DialogActions>
        <Button onClick={onClose} variant="text">
          {cancelLabel}
        </Button>
        <Button
          color={confirmColor}
          disabled={isProcessing}
          onClick={() => {
            void onConfirm();
          }}
          variant="contained"
        >
          {isProcessing ? (processingLabel ?? confirmLabel) : confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
