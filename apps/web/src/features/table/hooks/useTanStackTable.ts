"use client";

import { useMemo, useState } from "react";
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type {
  ColumnDef,
  PaginationState,
  RowSelectionState,
  Updater,
} from "@tanstack/react-table";

import type { AppTableMeta } from "../types";

type UseTanStackTableOptions<T> = {
  columns: ColumnDef<T, unknown>[];
  getRowId: (row: T) => string;
  initialRowsPerPage?: number;
  meta?: AppTableMeta<T>;
  rows: T[];
};

export function useTanStackTable<T>({
  columns,
  getRowId,
  initialRowsPerPage = 8,
  meta,
  rows,
}: UseTanStackTableOptions<T>) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialRowsPerPage,
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const availableIds = useMemo(() => new Set(rows.map(getRowId)), [getRowId, rows]);

  const sanitizedRowSelection = useMemo(() => {
    const next: RowSelectionState = {};

    Object.keys(rowSelection).forEach((id) => {
      if (rowSelection[id] && availableIds.has(id)) {
        next[id] = true;
      }
    });

    return next;
  }, [availableIds, rowSelection]);

  const safePagination = useMemo(() => {
    const maxPage = Math.max(0, Math.ceil(rows.length / pagination.pageSize) - 1);

    if (pagination.pageIndex <= maxPage) {
      return pagination;
    }

    return {
      ...pagination,
      pageIndex: maxPage,
    };
  }, [pagination, rows.length]);

  const handlePaginationChange = (updater: Updater<PaginationState>) => {
    setPagination((prev) =>
      typeof updater === "function" ? updater(prev) : updater,
    );
  };

  const handleRowSelectionChange = (updater: Updater<RowSelectionState>) => {
    setRowSelection((prev) =>
      typeof updater === "function" ? updater(prev) : updater,
    );
  };

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: rows,
    columns,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId,
    onPaginationChange: handlePaginationChange,
    onRowSelectionChange: handleRowSelectionChange,
    meta,
    state: {
      pagination: safePagination,
      rowSelection: sanitizedRowSelection,
    },
  });

  return {
    rowSelection: sanitizedRowSelection,
    setPagination,
    setRowSelection,
    table,
  };
}
