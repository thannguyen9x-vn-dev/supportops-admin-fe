"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

import { useForm } from "react-hook-form";

import { FormDialog } from "@/features/common/components/dialogs/FormDialog";

import { ProductFormFields } from "./ProductFormFields";
import type { Product, ProductDraft, ProductStatus } from "../projects.types";

type ProductDialogFormValues = {
  name: string;
  technology: string;
  price: string;
  status: ProductStatus;
};

type ProductDialogProps = {
  initialProduct: Product | null;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (values: ProductDraft) => Promise<void>;
  open: boolean;
};

export function ProductDialog({
  initialProduct,
  isSaving,
  onClose,
  onSubmit,
  open,
}: ProductDialogProps) {
  const t = useTranslations("pages.projects");
  const isEdit = Boolean(initialProduct);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductDialogFormValues>({
    defaultValues: {
      name: "",
      technology: "",
      price: "",
      status: "draft",
    },
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    reset({
      name: initialProduct?.name ?? "",
      technology: initialProduct?.technology ?? "",
      price: initialProduct ? String(initialProduct.price) : "",
      status: initialProduct?.status ?? "draft",
    });
  }, [initialProduct, open, reset]);

  return (
    <FormDialog
      cancelLabel={t("dialog.cancel")}
      isSubmitting={isSaving}
      onClose={onClose}
      onSubmit={() => {
        void handleSubmit(async (values) => {
          await onSubmit({
            name: values.name.trim(),
            technology: values.technology.trim(),
            price: Number(values.price),
            status: values.status,
          });
        })();
      }}
      open={open}
      submitLabel={t("dialog.save")}
      submittingLabel={t("dialog.saving")}
      title={isEdit ? t("dialog.editTitle") : t("dialog.createTitle")}
    >
      <ProductFormFields control={control} errors={errors} t={t} />
    </FormDialog>
  );
}
