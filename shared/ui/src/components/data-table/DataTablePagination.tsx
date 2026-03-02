"use client";

import type { Table } from "@tanstack/react-table";

interface DataTablePaginationProps<T> {
  table: Table<T>;
  totalRows?: number;
  pageSizeOptions?: number[];
}

export function DataTablePagination<T>({
  table,
  totalRows,
  pageSizeOptions = [10, 20, 30, 50, 100]
}: DataTablePaginationProps<T>) {
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const total = totalRows ?? table.getRowCount();
  const pageCount = table.getPageCount();

  const from = total === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, total);

  return (
    <div className="flex items-center justify-between gap-4 px-2">
      <div className="text-sm text-gray-500">Showing {from}-{to} of {total}</div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Rows</span>
        <select
          className="rounded border px-2 py-1 text-sm"
          onChange={(event) => table.setPageSize(Number(event.target.value))}
          value={pageSize}
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-1">
        <button className="rounded border px-2 py-1 text-sm disabled:opacity-30" disabled={!table.getCanPreviousPage()} onClick={() => table.firstPage()} type="button">««</button>
        <button className="rounded border px-2 py-1 text-sm disabled:opacity-30" disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()} type="button">«</button>
        <span className="px-2 text-sm">Page {pageIndex + 1} of {pageCount}</span>
        <button className="rounded border px-2 py-1 text-sm disabled:opacity-30" disabled={!table.getCanNextPage()} onClick={() => table.nextPage()} type="button">»</button>
        <button className="rounded border px-2 py-1 text-sm disabled:opacity-30" disabled={!table.getCanNextPage()} onClick={() => table.lastPage()} type="button">»»</button>
      </div>
    </div>
  );
}
