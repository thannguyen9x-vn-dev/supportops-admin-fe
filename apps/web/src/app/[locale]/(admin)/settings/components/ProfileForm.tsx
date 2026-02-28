"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@mui/material";
import type { Control, UseFormHandleSubmit } from "react-hook-form";

import { SelectOptionField, TextInputField } from "@supportops/ui-form";

import { createCountryOptions } from "@/shared/constants/countries";

import type { ProfileFormValues, SubmitState } from "../settings.types";

import styles from "../settings.module.css";

type ProfileFormProps = {
  control: Control<ProfileFormValues>;
  handleSubmit: UseFormHandleSubmit<ProfileFormValues>;
  onSubmit: (values: ProfileFormValues) => Promise<void>;
  submitState: SubmitState;
};

export function ProfileForm({ control, handleSubmit, onSubmit, submitState }: ProfileFormProps) {
  const t = useTranslations("pages.settings");
  const locale = useLocale();

  const countryOptions = useMemo(() => createCountryOptions({ locale }), [locale]);

  return (
    <section className={styles.card}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>{t("profile.generalInfoTitle")}</h3>
      </div>

      <form className={styles.formGrid} onSubmit={handleSubmit(onSubmit)}>
        <TextInputField
          control={control}
          label={t("profile.fields.firstName")}
          name="firstName"
          placeholder="Thomas"
          rules={{ required: t("validation.required") }}
        />
        <TextInputField
          control={control}
          label={t("profile.fields.birthday")}
          name="birthday"
          placeholder="12/08/1786"
        />

        <TextInputField
          control={control}
          label={t("profile.fields.lastName")}
          name="lastName"
          placeholder="Lean"
          rules={{ required: t("validation.required") }}
        />
        <TextInputField
          control={control}
          label={t("profile.fields.phoneNumber")}
          name="phoneNumber"
          placeholder="e.g. +(12)3456 789"
        />

        <TextInputField
          control={control}
          label={t("profile.fields.organization")}
          name="organization"
          placeholder="Themesberg"
        />
        <SelectOptionField
          control={control}
          label={t("profile.fields.country")}
          name="country"
          noOptionsText={t("countries.noOptions")}
          options={countryOptions}
          searchable
          searchInPopup
          searchPlaceholder={t("countries.searchPlaceholder")}
        />

        <TextInputField
          control={control}
          inputType="email"
          label={t("profile.fields.email")}
          name="email"
          placeholder="name@example.com"
          rules={{
            required: t("validation.required"),
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: t("validation.invalidEmail"),
            },
          }}
        />
        <TextInputField
          control={control}
          label={t("profile.fields.zipCode")}
          name="zipCode"
          placeholder="123456"
        />

        <TextInputField
          control={control}
          label={t("profile.fields.department")}
          name="department"
          placeholder="Marketing"
        />
        <TextInputField
          control={control}
          label={t("profile.fields.city")}
          name="city"
          placeholder="e.g. San Francisco"
        />

        <TextInputField
          className={styles.fullRow}
          control={control}
          label={t("profile.fields.address")}
          name="address"
          placeholder="e.g. California"
        />

        <div className={styles.formActions}>
          <Button disabled={submitState === "saving"} size="medium" type="submit" variant="contained">
            {submitState === "saving" ? t("action.saving") : t("action.update")}
          </Button>
        </div>
      </form>
    </section>
  );
}
