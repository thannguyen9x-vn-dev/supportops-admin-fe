"use client";

import { Button, Stack } from "@mui/material";

interface ActionsCellProps {
  hasChanges: boolean;
  isSaving?: boolean;
  onEdit: () => void;
  onSave: () => void;
  onDiscard: () => void;
}

export function ActionsCell({ hasChanges, isSaving = false, onEdit, onSave, onDiscard }: ActionsCellProps) {
  if (hasChanges) {
    return (
      <Stack direction="row" spacing={1}>
        <Button disabled={isSaving} onClick={onSave} size="small" variant="contained">
          Save
        </Button>
        <Button color="inherit" disabled={isSaving} onClick={onDiscard} size="small" variant="outlined">
          Discard
        </Button>
      </Stack>
    );
  }

  return (
    <Button disabled={isSaving} onClick={onEdit} size="small" variant="text">
      Edit
    </Button>
  );
}
