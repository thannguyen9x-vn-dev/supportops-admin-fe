"use client";

import type { ColumnDef, RowSelectionState } from "@tanstack/react-table";

import type { AppTableMeta } from "../types";

import { useTanStackTable } from "./useTanStackTable";

type UseClientTableOptions<T> = {
  columns: ColumnDef<T, unknown>[];
  getRowId: (row: T) => string;
  initialRowsPerPage?: number;
  meta?: AppTableMeta<T>;
  rows: T[];
};

export function useClientTable<T>({
  columns,
  getRowId,
  initialRowsPerPage = 8,
  meta,
  rows,
}: UseClientTableOptions<T>) {
  const { rowSelection, setRowSelection, table } = useTanStackTable({
    columns,
    getRowId,
    initialRowsPerPage,
    meta,
    rows,
  });

  const selectedIds = new Set(Object.keys(rowSelection));

  const toggleSelectRow = (rowId: string, checked: boolean) => {
    setRowSelection((prev) => ({
      ...prev,
      [rowId]: checked,
    }));
  };

  const toggleSelectAllOnPage = (checked: boolean) => {
    table.toggleAllPageRowsSelected(checked);
  };

  const setSelectedIds = (nextIds: Set<string>) => {
    setRowSelection(() => {
      const next: RowSelectionState = {};

      nextIds.forEach((id) => {
        next[id] = true;
      });

      return next;
    });
  };

  return {
    page: table.getState().pagination.pageIndex,
    pagedRows: table.getRowModel().rows.map((row) => row.original),
    rowsPerPage: table.getState().pagination.pageSize,
    safePage: table.getState().pagination.pageIndex,
    selectedIds,
    selectedCount: selectedIds.size,
    setPage: table.setPageIndex,
    setRowsPerPage: table.setPageSize,
    setSelectedIds,
    table,
    toggleSelectAllOnPage,
    toggleSelectRow,
    totalRows: rows.length,
  };
}
