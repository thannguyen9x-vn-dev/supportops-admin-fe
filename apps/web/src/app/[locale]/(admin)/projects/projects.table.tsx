"use client";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Chip, IconButton } from "@mui/material";
import { createColumnHelper } from "@tanstack/react-table";

import { EditableCell } from "@/features/table/components/EditableCell";
import type { AppTableColumn } from "@/features/table/types";

import type { Product } from "./projects.types";

type CreateProductColumnsParams = {
  formatDate: (value: Date) => string;
  onCellChange: (change: {
    columnId: string;
    row: Product;
    rowId: string;
    value: unknown;
  }) => Promise<void>;
  onEditProduct: (product: Product) => void;
  t: (key: string, values?: Record<string, string>) => string;
};

function getStatusColor(status: Product["status"]) {
  switch (status) {
    case "active":
      return "success";
    case "draft":
      return "warning";
    case "archived":
      return "default";
    default:
      return "default";
  }
}

const columnHelper = createColumnHelper<Product>();

export function createProductColumns({
  formatDate,
  onCellChange,
  onEditProduct,
  t,
}: CreateProductColumnsParams): AppTableColumn<Product>[] {
  return [
    columnHelper.accessor("name", {
      header: t("table.columns.name"),
      cell: (context) => context.getValue(),
    }),
    columnHelper.accessor("technology", {
      header: t("table.columns.technology"),
      cell: (context) => (
        <EditableCell
          onValueChange={async (value) => {
            await onCellChange({
              columnId: "technology",
              row: context.row.original,
              rowId: context.row.id,
              value,
            });
          }}
          value={context.getValue()}
        />
      ),
    }),
    columnHelper.accessor("displayId", {
      header: t("table.columns.id"),
      cell: (context) => context.getValue(),
    }),
    columnHelper.accessor("price", {
      header: t("table.columns.price"),
      cell: (context) => (
        <EditableCell
          onValueChange={async (value) => {
            await onCellChange({
              columnId: "price",
              row: context.row.original,
              rowId: context.row.id,
              value,
            });
          }}
          parseValue={(raw) => Number(raw)}
          value={context.getValue()}
        />
      ),
      meta: {
        align: "right",
      },
    }),
    columnHelper.accessor("status", {
      header: t("table.columns.status"),
      cell: (context) => (
        <Chip
          color={getStatusColor(context.getValue())}
          label={t(`status.${context.getValue()}`)}
          size="small"
          variant="outlined"
        />
      ),
    }),
    columnHelper.accessor("updatedAt", {
      header: t("table.columns.updatedAt"),
      cell: (context) => formatDate(new Date(context.getValue())),
    }),
    columnHelper.display({
      id: "action",
      header: t("table.columns.action"),
      cell: (context) => (
        <IconButton
          aria-label={t("table.editAria", { name: context.row.original.name })}
          onClick={() => onEditProduct(context.row.original)}
          size="small"
        >
          <EditOutlinedIcon fontSize="small" />
        </IconButton>
      ),
      meta: {
        align: "right",
      },
    }),
  ] as AppTableColumn<Product>[];
}
