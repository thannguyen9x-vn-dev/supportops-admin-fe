'use client';

import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import { Button, Checkbox, FormControlLabel } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { TextInputField } from "@supportops/ui-form";

import { AuthCard } from "../../../../../components/auth/AuthCard";
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
  const [imageLoadError, setImageLoadError] = useState(false);
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
      maxWidth={1040}
      title={t("title")}
      subtitle={t("subtitle")}
      titleSx={{ fontSize: { xs: "1.9rem", md: "1.9rem" } }}
      illustrationPanelSx={{
        background: "#FFFFFF",
        backgroundColor: "#FFFFFF",
        color: "text.primary",
      }}
      formPanelSx={{
        background: "#FFFFFF",
        backgroundColor: "#FFFFFF",
        backgroundImage: "none",
        justifyContent: { xs: "flex-start", md: "center" },
      }}
      illustration={
        <>
          {!imageLoadError ? (
            <div className={styles.illustrationImageWrap}>
              <Image
                src="/images/auth/reset-password.png"
                alt="Reset password illustration"
                fill
                sizes="900px"
                className={styles.illustrationImage}
                onError={() => setImageLoadError(true)}
                priority
              />
            </div>
          ) : (
            <ShieldOutlinedIcon sx={{ fontSize: 120, color: "#2563eb", mt: 2 }} />
          )}
        </>
      }
      footer={
        <>
          <span>{t("footerPrompt")}</span>
          <Link href={`/${locale}/forgot-password`}>{t("footerAction")}</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <input
          type="text"
          name="reset-username"
          autoComplete="username"
          tabIndex={-1}
          aria-hidden="true"
          style={{ position: "absolute", opacity: 0, pointerEvents: "none", height: 0, width: 0 }}
        />
        <input
          type="password"
          name="reset-password"
          autoComplete="new-password"
          tabIndex={-1}
          aria-hidden="true"
          style={{ position: "absolute", opacity: 0, pointerEvents: "none", height: 0, width: 0 }}
        />
        <div className={styles.fields}>
          <TextInputField
            name="email"
            control={control}
            label={commonT("emailLabel")}
            placeholder={commonT("emailPlaceholder")}
            autoComplete="off"
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
            autoComplete="new-password"
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
            autoComplete="new-password"
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
