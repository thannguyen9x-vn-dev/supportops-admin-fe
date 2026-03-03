'use client';

import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import { Alert, Button } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { TextInputField } from "@supportops/ui-form";
import { authService } from "@/features/auth/services/auth.service";
import { ApiError } from "@/lib/api";
import { buildPasswordRules, getPasswordRequirementState } from "@/lib/validation/passwordPolicy";
import { PasswordRequirementChecklist } from "@/components/password/PasswordRequirementChecklist";

import { AuthCard } from "../../../../../components/auth/AuthCard";
import styles from "../auth.module.css";

type ResetFormValues = {
  password: string;
  confirmPassword: string;
};

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const { locale } = useParams<{ locale: string }>();
  const t = useTranslations("auth.resetPassword");
  const commonT = useTranslations("auth.common");
  const [imageLoadError, setImageLoadError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError
  } = useForm<ResetFormValues>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  const token = searchParams.get("token") ?? "";

  const password = useWatch({
    control,
    name: "password"
  });
  const passwordRequirements = getPasswordRequirementState(password ?? "");

  const onSubmit = async (data: ResetFormValues) => {
    setSubmitted(false);

    if (!token) {
      setError("root", { message: t("missingToken") });
      return;
    }

    try {
      await authService.resetPassword({
        token,
        newPassword: data.password,
        confirmPassword: data.confirmPassword
      });
      setSubmitted(true);
    } catch (error: unknown) {
      const message = error instanceof ApiError ? error.message : t("submitError");
      setError("root", { message });
    }
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
            name="password"
            control={control}
            label={t("newPasswordLabel")}
            placeholder={t("newPasswordPlaceholder")}
            type="password"
            autoComplete="new-password"
            startIcon={<VpnKeyOutlinedIcon fontSize="small" />}
            rules={buildPasswordRules<ResetFormValues, "password">({
              required: commonT("passwordRequired"),
              min: commonT("passwordMin"),
              max: commonT("passwordMax"),
              format: commonT("passwordFormat")
            })}
          />
          <PasswordRequirementChecklist
            className={styles.passwordChecklist}
            items={[
              {
                key: "minLength",
                label: t("passwordRequirements.minLength"),
                met: passwordRequirements.minLength
              },
              {
                key: "lowercase",
                label: t("passwordRequirements.lowercase"),
                met: passwordRequirements.lowercase
              },
              {
                key: "uppercase",
                label: t("passwordRequirements.uppercase"),
                met: passwordRequirements.uppercase
              },
              {
                key: "number",
                label: t("passwordRequirements.number"),
                met: passwordRequirements.number
              },
              {
                key: "specialCharacter",
                label: t("passwordRequirements.specialCharacter"),
                met: passwordRequirements.specialCharacter
              }
            ]}
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
              validate: (value: string) => value === password || commonT("passwordMismatch")
            }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isSubmitting}
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
          {submitted ? <Alert severity="success">{t("submitSuccess")}</Alert> : null}
          {errors.root?.message ? <Alert severity="error">{errors.root.message}</Alert> : null}
        </div>
      </form>
    </AuthCard>
  );
}
