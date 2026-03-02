"use client";

import { flexRender, type Table as TanStackTable } from "@tanstack/react-table";
import type { ReactNode } from "react";

import { cn } from "../../utils/cn";
import { DataTablePagination } from "./DataTablePagination";
import { DataTableToolbar } from "./DataTableToolbar";

interface DataTableProps<T> {
  table: TanStackTable<T>;
  totalRows?: number;
  isLoading?: boolean;
  selectedCount?: number;
  dirtyRowCount?: number;
  onBulkDelete?: () => void;
  onSaveAll?: () => void;
  onDiscardAll?: () => void;
  onExport?: () => void;
  onRowClick?: (row: T) => void;
  highlightDirtyRows?: boolean;
  dirtyRowIds?: Set<string>;
  emptyState?: ReactNode;
  rowClassName?: (row: T) => string;
}

export function DataTable<T>({
  table,
  totalRows,
  isLoading,
  selectedCount = 0,
  dirtyRowCount = 0,
  onBulkDelete,
  onSaveAll,
  onDiscardAll,
  onExport,
  onRowClick,
  highlightDirtyRows,
  dirtyRowIds,
  emptyState,
  rowClassName
}: DataTableProps<T>) {
  const rows = table.getRowModel().rows;

  return (
    <div className="space-y-4">
      <DataTableToolbar
        dirtyRowCount={dirtyRowCount}
        onBulkDelete={onBulkDelete}
        onDiscardAll={onDiscardAll}
        onExport={onExport}
        onSaveAll={onSaveAll}
        selectedCount={selectedCount}
        table={table}
      />

      <div className={cn("overflow-hidden rounded-md border", isLoading ? "pointer-events-none opacity-60" : "")}>
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    className="px-4 py-3 text-left font-medium text-gray-500"
                    key={header.id}
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="py-16 text-center text-gray-400" colSpan={table.getAllColumns().length}>
                  {emptyState ?? "No data found"}
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const isDirty = highlightDirtyRows && dirtyRowIds?.has(row.id);

                return (
                  <tr
                    className={cn(
                      "border-b transition-colors hover:bg-gray-50/60",
                      row.getIsSelected() ? "bg-blue-50/50" : "",
                      isDirty ? "border-l-4 border-l-yellow-400 bg-yellow-50/50" : "",
                      onRowClick ? "cursor-pointer" : "",
                      rowClassName?.(row.original)
                    )}
                    key={row.id}
                    onClick={() => onRowClick?.(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td className="px-4 py-3" key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <DataTablePagination table={table} totalRows={totalRows} />
    </div>
  );
}
