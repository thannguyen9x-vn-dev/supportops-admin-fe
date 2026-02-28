"use client";

import { useMemo, useState } from "react";
import { useFormatter, useTranslations } from "next-intl";

import { Alert, Button } from "@mui/material";

import { useDialogState } from "@/features/common/hooks/useDialogState";
import { useToast } from "@/features/common/toast/useToast";
import { DataTable } from "@/features/table/components/DataTable";
import { useClientTable } from "@/features/table/hooks/useClientTable";

import { DeleteProductsDialog } from "./components/DeleteProductsDialog";
import { ProductDialog } from "./components/ProductDialog";
import { ProductsToolbar } from "./components/ProductsToolbar";
import { useProjects } from "./hooks/useProjects";
import { createProductColumns } from "./projects.table";
import type { Product, ProductStatus } from "./projects.types";
import styles from "./projects.module.css";

export function ProjectsPageClient() {
  const t = useTranslations("pages.projects");
  const format = useFormatter();
  const toast = useToast();

  const { data, loadState, reload, removeProducts, saveProduct } = useProjects();

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProductStatus | "all">("all");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const productDialog = useDialogState<Product>();
  const deleteDialog = useDialogState();

  const filteredData = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return data.filter((product) => {
      const matchQuery =
        normalizedQuery.length === 0 ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.technology.toLowerCase().includes(normalizedQuery) ||
        product.id.includes(normalizedQuery) ||
        product.displayId.toLowerCase().includes(normalizedQuery);
      const matchStatus = statusFilter === "all" || product.status === statusFilter;

      return matchQuery && matchStatus;
    });
  }, [data, query, statusFilter]);

  const columns = useMemo(
    () =>
      createProductColumns({
        formatDate: (value) =>
          format.dateTime(value, { dateStyle: "medium" }),
        onCellChange: async ({ columnId, row, value }) => {
          const next =
            columnId === "price"
              ? { ...row, price: Number(value) }
              : columnId === "technology"
                ? { ...row, technology: String(value) }
                : row;

          await saveProduct({
            name: next.name,
            price: next.price,
            status: next.status,
            technology: next.technology,
          }, row.id);
          toast.success(t("state.updated"));
        },
        onEditProduct: (product) => {
          productDialog.open(product);
        },
        t,
      }),
    [format, productDialog, saveProduct, t, toast],
  );

  const table = useClientTable<Product>({
    columns,
    getRowId: (row) => row.id,
    initialRowsPerPage: 8,
    rows: filteredData,
  });

  const selectedIds = table.selectedIds;
  const selectedCount = table.selectedCount;

  const handleSaveProduct = async (values: {
    name: string;
    technology: string;
    price: number;
    status: ProductStatus;
  }) => {
    setIsSaving(true);

    try {
      await saveProduct(values, productDialog.payload?.id);
      toast.success(productDialog.payload ? t("state.updated") : t("state.created"));
      productDialog.close();
    } catch {
      toast.error(t("state.saveError"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSelected = async () => {
    const ids = [...selectedIds];
    if (ids.length === 0) {
      return;
    }

    setIsDeleting(true);
    try {
      await removeProducts(ids);
      table.setSelectedIds(new Set());
      deleteDialog.close();
      toast.success(t("state.deleted", { count: ids.length }));
    } catch {
      toast.error(t("state.deleteError"));
    } finally {
      setIsDeleting(false);
    }
  };

  if (loadState === "error") {
    return (
      <div className={styles.centeredState}>
        <Alert severity="error">{t("state.error")}</Alert>
        <Button onClick={() => void reload()} variant="contained">
          {t("action.retry")}
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <ProductsToolbar
        onAddProduct={() => {
          productDialog.open();
        }}
        onDeleteSelected={() => deleteDialog.open()}
        query={query}
        selectedCount={selectedCount}
        setQuery={(value) => {
          setQuery(value);
          table.setPage(0);
        }}
        setStatusFilter={(value) => {
          setStatusFilter(value);
          table.setPage(0);
        }}
        statusFilter={statusFilter}
      />

      <DataTable
        ariaLabel={t("table.ariaLabel")}
        emptyState={<Alert severity="info">{t("state.empty")}</Alert>}
        isLoading={loadState === "loading"}
        loadingState={t("state.loading")}
        rowsPerPageOptions={[8, 12, 20]}
        selectable
        selectAllAriaLabel={t("table.selectAll")}
        selectRowAriaLabel={(row) => t("table.selectRow", { name: row.name })}
        table={table.table}
      />

      <ProductDialog
        initialProduct={productDialog.payload}
        isSaving={isSaving}
        onClose={productDialog.close}
        onSubmit={handleSaveProduct}
        open={productDialog.isOpen}
      />

      <DeleteProductsDialog
        isDeleting={isDeleting}
        onClose={deleteDialog.close}
        onConfirm={handleDeleteSelected}
        open={deleteDialog.isOpen}
        selectedCount={selectedCount}
      />
    </div>
  );
}
