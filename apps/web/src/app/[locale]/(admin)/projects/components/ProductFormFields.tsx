"use client";

import { Controller } from "react-hook-form";
import type { Control, FieldErrors } from "react-hook-form";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";

import type { ProductStatus } from "../projects.types";

type ProductDialogFormValues = {
  name: string;
  technology: string;
  price: string;
  status: ProductStatus;
};

type ProductFormFieldsProps = {
  control: Control<ProductDialogFormValues>;
  errors: FieldErrors<ProductDialogFormValues>;
  t: (key: string) => string;
};

export function ProductFormFields({ control, errors, t }: ProductFormFieldsProps) {
  return (
    <Stack spacing={2} sx={{ pt: 1 }}>
      <Controller
        control={control}
        name="name"
        rules={{ required: t("validation.nameRequired") }}
        render={({ field }) => (
          <TextField
            {...field}
            autoFocus
            error={Boolean(errors.name)}
            helperText={errors.name?.message}
            label={t("dialog.fields.name")}
          />
        )}
      />

      <Controller
        control={control}
        name="technology"
        rules={{ required: t("validation.technologyRequired") }}
        render={({ field }) => (
          <TextField
            {...field}
            error={Boolean(errors.technology)}
            helperText={errors.technology?.message}
            label={t("dialog.fields.technology")}
          />
        )}
      />

      <Controller
        control={control}
        name="price"
        rules={{
          required: t("validation.priceRequired"),
          validate: (value) => Number(value) > 0 || t("validation.pricePositive"),
        }}
        render={({ field }) => (
          <TextField
            {...field}
            error={Boolean(errors.price)}
            helperText={errors.price?.message}
            inputProps={{ min: 0, step: 1 }}
            label={t("dialog.fields.price")}
            type="number"
          />
        )}
      />

      <FormControl>
        <InputLabel id="product-status-label">{t("dialog.fields.status")}</InputLabel>
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <Select {...field} label={t("dialog.fields.status")} labelId="product-status-label">
              <MenuItem value="active">{t("status.active")}</MenuItem>
              <MenuItem value="draft">{t("status.draft")}</MenuItem>
              <MenuItem value="archived">{t("status.archived")}</MenuItem>
            </Select>
          )}
        />
      </FormControl>
    </Stack>
  );
}
