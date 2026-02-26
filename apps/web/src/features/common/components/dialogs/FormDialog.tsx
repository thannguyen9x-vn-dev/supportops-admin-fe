"use client";

import type { ReactNode } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

type FormDialogProps = {
  cancelLabel: string;
  children: ReactNode;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: () => void;
  open: boolean;
  submitLabel: string;
  submittingLabel?: string;
  title: ReactNode;
};

export function FormDialog({
  cancelLabel,
  children,
  isSubmitting = false,
  onClose,
  onSubmit,
  open,
  submitLabel,
  submittingLabel,
  title,
}: FormDialogProps) {
  return (
    <Dialog fullWidth maxWidth="sm" onClose={onClose} open={open}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="text">
          {cancelLabel}
        </Button>
        <Button disabled={isSubmitting} onClick={onSubmit} variant="contained">
          {isSubmitting ? (submittingLabel ?? submitLabel) : submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
