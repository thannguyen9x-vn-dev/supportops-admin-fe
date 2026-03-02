"use client";

import { Checkbox } from "@mui/material";
import type { Row, Table } from "@tanstack/react-table";

export function CheckboxHeader<T>({ table }: { table: Table<T> }) {
  return (
    <Checkbox
      checked={table.getIsAllPageRowsSelected()}
      indeterminate={table.getIsSomePageRowsSelected()}
      inputProps={{ "aria-label": "Select all rows" }}
      onChange={table.getToggleAllPageRowsSelectedHandler()}
      size="small"
    />
  );
}

export function CheckboxCell<T>({ row }: { row: Row<T> }) {
  return (
    <Checkbox
      checked={row.getIsSelected()}
      disabled={!row.getCanSelect()}
      inputProps={{ "aria-label": `Select row ${row.id}` }}
      onChange={row.getToggleSelectedHandler()}
      size="small"
    />
  );
}
