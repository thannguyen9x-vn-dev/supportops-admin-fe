"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, TextField, Typography } from "@mui/material";

interface EditableNumberCellProps {
  value: number;
  isEditing: boolean;
  onStartEdit: () => void;
  onCancel: () => void;
  onChange: (value: number) => void;
}

export function EditableNumberCell({ value, isEditing, onStartEdit, onCancel, onChange }: EditableNumberCellProps) {
  const [localValue, setLocalValue] = useState(String(value));

  useEffect(() => {
    setLocalValue(String(value));
  }, [value]);

  const formatted = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
      }).format(value),
    [value]
  );

  if (!isEditing) {
    return (
      <Box onClick={onStartEdit} onKeyDown={(event) => event.key === "Enter" && onStartEdit()} role="button" tabIndex={0}>
        <Typography variant="body2">{formatted}</Typography>
      </Box>
    );
  }

  return (
    <TextField
      autoFocus
      fullWidth
      onBlur={() => {
        const next = Number(localValue);
        if (!Number.isFinite(next)) {
          onCancel();
          return;
        }

        onChange(next);
      }}
      onChange={(event) => setLocalValue(event.target.value)}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          const next = Number(localValue);
          if (Number.isFinite(next)) {
            onChange(next);
          }
        }

        if (event.key === "Escape") {
          setLocalValue(String(value));
          onCancel();
        }
      }}
      size="small"
      type="number"
      value={localValue}
      variant="outlined"
    />
  );
}
