"use client";

import { useState } from "react";

import { TextField } from "@mui/material";

type EditableCellProps<TValue> = {
  onValueChange: (nextValue: TValue) => Promise<void> | void;
  parseValue?: (raw: string) => TValue;
  value: TValue;
};

export function EditableCell<TValue extends string | number>({
  onValueChange,
  parseValue,
  value,
}: EditableCellProps<TValue>) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));

  if (!isEditing) {
    return (
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        style={{
          background: "transparent",
          border: 0,
          cursor: "text",
          padding: 0,
          textAlign: "left",
          width: "100%",
        }}
      >
        {String(value)}
      </button>
    );
  }

  return (
    <TextField
      autoFocus
      fullWidth
      onBlur={() => {
        const nextValue = parseValue ? parseValue(draft) : (draft as TValue);
        void onValueChange(nextValue);
        setIsEditing(false);
        setDraft(String(nextValue));
      }}
      onChange={(event) => setDraft(event.target.value)}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setDraft(String(value));
          setIsEditing(false);
          return;
        }

        if (event.key === "Enter") {
          event.preventDefault();
          const nextValue = parseValue ? parseValue(draft) : (draft as TValue);
          void onValueChange(nextValue);
          setIsEditing(false);
          setDraft(String(nextValue));
        }
      }}
      size="small"
      value={draft}
      variant="standard"
    />
  );
}
