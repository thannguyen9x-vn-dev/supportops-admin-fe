import type { ColumnDef, Table } from "@tanstack/react-table";

export type TableAlign = "inherit" | "left" | "center" | "right" | "justify";

export type AppTableColumnMeta = {
  align?: TableAlign;
  cellClassName?: string;
  headerClassName?: string;
  width?: number | string;
};

export type AppTableColumn<T> = ColumnDef<T, unknown>;

export type AppTableInstance<T> = Table<T>;

export type AppTableCellChange<T> = {
  columnId: string;
  row: T;
  rowId: string;
  value: unknown;
};

export type AppTableMeta<T> = {
  onCellChange?: (change: AppTableCellChange<T>) => Promise<void> | void;
};
