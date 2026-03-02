"use client";

import { useEffect, useState } from "react";
import { Box, TextField, Typography } from "@mui/material";

interface EditableTextCellProps {
  value: string;
  isEditing: boolean;
  subtitle?: string | null;
  onStartEdit: () => void;
  onCancel: () => void;
  onChange: (value: string) => void;
}

export function EditableTextCell({ value, isEditing, subtitle, onStartEdit, onCancel, onChange }: EditableTextCellProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  if (!isEditing) {
    return (
      <Box onClick={onStartEdit} onKeyDown={(event) => event.key === "Enter" && onStartEdit()} role="button" tabIndex={0}>
        <Typography fontWeight={600} variant="body2">
          {value}
        </Typography>
        {subtitle ? (
          <Typography color="text.secondary" variant="caption">
            {subtitle}
          </Typography>
        ) : null}
      </Box>
    );
  }

  return (
    <TextField
      autoFocus
      fullWidth
      onBlur={() => onChange(localValue)}
      onChange={(event) => setLocalValue(event.target.value)}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          onChange(localValue);
        }

        if (event.key === "Escape") {
          setLocalValue(value);
          onCancel();
        }
      }}
      size="small"
      value={localValue}
      variant="outlined"
    />
  );
}
