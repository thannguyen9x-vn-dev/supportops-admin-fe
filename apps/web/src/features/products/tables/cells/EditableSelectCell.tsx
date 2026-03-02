"use client";

import { Box, MenuItem, TextField, Typography } from "@mui/material";

interface SelectOption {
  label: string;
  value: string;
}

interface EditableSelectCellProps {
  value: string;
  options: SelectOption[];
  isEditing: boolean;
  onStartEdit: () => void;
  onCancel: () => void;
  onChange: (value: string) => void;
}

export function EditableSelectCell({ value, options, isEditing, onStartEdit, onCancel, onChange }: EditableSelectCellProps) {
  const label = options.find((option) => option.value === value)?.label || value;

  if (!isEditing) {
    return (
      <Box onClick={onStartEdit} onKeyDown={(event) => event.key === "Enter" && onStartEdit()} role="button" tabIndex={0}>
        <Typography variant="body2">{label}</Typography>
      </Box>
    );
  }

  return (
    <TextField
      autoFocus
      fullWidth
      onBlur={onCancel}
      onChange={(event) => onChange(event.target.value)}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          onCancel();
        }
      }}
      select
      size="small"
      value={value}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}
