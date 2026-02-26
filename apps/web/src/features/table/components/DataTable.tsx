"use client";

import type { ReactNode } from "react";

import {
  Checkbox,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { flexRender } from "@tanstack/react-table";

import type { AppTableColumnMeta, AppTableInstance } from "../types";

import styles from "./data-table.module.css";

type DataTableProps<T> = {
  ariaLabel: string;
  emptyState?: ReactNode;
  isLoading?: boolean;
  loadingState?: ReactNode;
  rowsPerPageOptions: number[];
  selectable?: boolean;
  selectAllAriaLabel?: string;
  selectRowAriaLabel?: (row: T) => string;
  table: AppTableInstance<T>;
  toolbar?: ReactNode;
};

function getAlign(meta: AppTableColumnMeta | undefined) {
  return meta?.align;
}

export function DataTable<T>({
  ariaLabel,
  emptyState,
  isLoading = false,
  loadingState,
  rowsPerPageOptions,
  selectable = false,
  selectAllAriaLabel,
  selectRowAriaLabel,
  table,
  toolbar,
}: DataTableProps<T>) {
  const totalRows = table.getPrePaginationRowModel().rows.length;

  return (
    <div className={styles.container}>
      {toolbar}

      {isLoading ? (
        <div className={styles.state}>{loadingState ?? <CircularProgress size={24} />}</div>
      ) : totalRows === 0 ? (
        <div className={styles.state}>{emptyState ?? null}</div>
      ) : (
        <>
          <TableContainer component={Paper} elevation={0} variant="outlined">
            <Table aria-label={ariaLabel} className={styles.table}>
              <TableHead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {selectable ? (
                      <TableCell padding="checkbox">
                        <Checkbox
                          aria-label={selectAllAriaLabel}
                          checked={table.getIsAllPageRowsSelected()}
                          indeterminate={table.getIsSomePageRowsSelected()}
                          onChange={(_, checked) => table.toggleAllPageRowsSelected(checked)}
                        />
                      </TableCell>
                    ) : null}

                    {headerGroup.headers.map((header) => {
                      const meta = header.column.columnDef.meta as AppTableColumnMeta | undefined;

                      return (
                        <TableCell
                          align={getAlign(meta)}
                          className={meta?.headerClassName}
                          key={header.id}
                          sx={{ width: meta?.width }}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHead>

              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow hover key={row.id} selected={row.getIsSelected()}>
                    {selectable ? (
                      <TableCell padding="checkbox">
                        <Checkbox
                          aria-label={selectRowAriaLabel?.(row.original)}
                          checked={row.getIsSelected()}
                          onChange={(_, checked) => row.toggleSelected(checked)}
                        />
                      </TableCell>
                    ) : null}

                    {row.getVisibleCells().map((cell) => {
                      const meta = cell.column.columnDef.meta as AppTableColumnMeta | undefined;

                      return (
                        <TableCell align={getAlign(meta)} className={meta?.cellClassName} key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={totalRows}
            onPageChange={(_, nextPage) => table.setPageIndex(nextPage)}
            onRowsPerPageChange={(event) => {
              table.setPageSize(Number(event.target.value));
              table.setPageIndex(0);
            }}
            page={table.getState().pagination.pageIndex}
            rowsPerPage={table.getState().pagination.pageSize}
            rowsPerPageOptions={rowsPerPageOptions}
          />
        </>
      )}
    </div>
  );
}
