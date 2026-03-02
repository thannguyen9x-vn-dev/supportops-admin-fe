"use client";

import type { Table } from "@tanstack/react-table";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

interface TableToolbarProps<T> {
  table?: Table<T>;
  selectedCount: number;
  hasEdits: boolean;
  isSavingAll?: boolean;
  onBulkDelete?: () => void;
  onSaveAll: () => void;
  onDiscardAll: () => void;
}

export function TableToolbar<T>({
  selectedCount,
  hasEdits,
  isSavingAll = false,
  onBulkDelete,
  onSaveAll,
  onDiscardAll
}: TableToolbarProps<T>) {
  const t = useTranslations("pages.projects.tableToolbar");

  return (
    <Stack alignItems="center" direction="row" justifyContent="space-between" spacing={2} sx={{ pb: 1.5 }}>
      <Box>
        {selectedCount > 0 ? (
          <Stack alignItems="center" direction="row" spacing={1}>
            <Typography color="primary" variant="body2">
              {t("selectedCount", { count: selectedCount })}
            </Typography>
            {onBulkDelete ? (
              <Button color="error" onClick={onBulkDelete} size="small" variant="text">
                {t("bulkDelete")}
              </Button>
            ) : null}
          </Stack>
        ) : null}
      </Box>

      <Box>
        {hasEdits ? (
          <Stack alignItems="center" direction="row" spacing={1}>
            <Typography color="warning.main" variant="body2">
              {t("unsavedChanges")}
            </Typography>
            <Button disabled={isSavingAll} onClick={onDiscardAll} size="small" variant="outlined">
              {t("discardAll")}
            </Button>
            <Button disabled={isSavingAll} onClick={onSaveAll} size="small" variant="contained">
              {t("saveAll")}
            </Button>
          </Stack>
        ) : null}
      </Box>
    </Stack>
  );
}
