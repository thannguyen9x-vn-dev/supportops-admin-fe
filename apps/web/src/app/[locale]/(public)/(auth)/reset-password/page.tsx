'use client';

import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import { Button, Checkbox, FormControlLabel } from "@mui/material";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";

import { TextInputField } from "@supportops/ui-form";

import { AuthCard } from "../_components/AuthCard";
import styles from "../auth.module.css";

type ResetFormValues = {
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
};

export default function ResetPasswordPage() {
  const { locale } = useParams<{ locale: string }>();
  const t = useTranslations("auth.resetPassword");
  const commonT = useTranslations("auth.common");
  const { control, handleSubmit, register } = useForm<ResetFormValues>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const onSubmit = (data: ResetFormValues) => {
    console.log(data);
  };

  return (
    <AuthCard
      title={t("title")}
      subtitle={t("subtitle")}
      illustration={
        <>
          <span className={styles.illustrationBadge}>{t("badge")}</span>
          <div className={styles.illustrationTitle}>{t("illustrationTitle")}</div>
          <div className={styles.illustrationText}>
            {t("illustrationText")}
          </div>
          <ShieldOutlinedIcon sx={{ fontSize: 120, color: "#2563eb", mt: 2 }} />
        </>
      }
      footer={
        <>
          <span>{t("footerPrompt")}</span>
          <Link href={`/${locale}/forgot-password`}>{t("footerAction")}</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.fields}>
          <TextInputField
            name="email"
            control={control}
            label={commonT("emailLabel")}
            placeholder={commonT("emailPlaceholder")}
            startIcon={<EmailOutlinedIcon fontSize="small" />}
            rules={{
              required: commonT("emailRequired"),
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: commonT("invalidEmail"),
              },
            }}
          />
          <TextInputField
            name="password"
            control={control}
            label={t("newPasswordLabel")}
            placeholder={t("newPasswordPlaceholder")}
            type="password"
            startIcon={<VpnKeyOutlinedIcon fontSize="small" />}
            rules={{
              required: commonT("passwordRequired"),
            }}
          />
          <TextInputField
            name="confirmPassword"
            control={control}
            label={t("confirmNewPasswordLabel")}
            placeholder={t("confirmNewPasswordPlaceholder")}
            type="password"
            startIcon={<VpnKeyOutlinedIcon fontSize="small" />}
            rules={{
              required: t("confirmNewPasswordRequired"),
            }}
          />
          <FormControlLabel
            control={<Checkbox size="small" {...register("acceptTerms")} />}
            label={
              <span>
                {commonT("acceptTerms")}{" "}
                <Link href={`/${locale}/terms`}>{commonT("termsAndConditions")}</Link>
              </span>
            }
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              borderRadius: 2,
              textTransform: "none",
              py: 1.2,
              fontWeight: 600,
              bgcolor: "#2563eb",
              "&:hover": { bgcolor: "#1d4ed8" },
            }}
          >
            {t("submit")}
          </Button>
        </div>
      </form>
    </AuthCard>
  );
}
