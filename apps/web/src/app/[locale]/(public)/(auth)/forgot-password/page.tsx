'use client';

import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import { Alert, Button } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { TextInputField } from "@supportops/ui-form";
import { authService } from "@/features/auth/services/auth.service";
import { ApiError } from "@/lib/api";

import { AuthCard } from "../../../../../components/auth/AuthCard";
import styles from "../auth.module.css";

type ForgotFormValues = {
  email: string;
};

export default function ForgotPasswordPage() {
  const { locale } = useParams<{ locale: string }>();
  const t = useTranslations("auth.forgotPassword");
  const commonT = useTranslations("auth.common");
  const [imageLoadError, setImageLoadError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError
  } = useForm<ForgotFormValues>({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotFormValues) => {
    setSubmitted(false);
    try {
      await authService.forgotPassword({ email: data.email });
      setSubmitted(true);
    } catch (error) {
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
                src="/images/auth/forgot-illustration.png"
                alt="Forgot password illustration"
                fill
                sizes="900px"
                className={styles.illustrationImage}
                onError={() => setImageLoadError(true)}
                priority
              />
            </div>
          ) : (
            <LockResetOutlinedIcon sx={{ fontSize: 120, color: "#2563eb", mt: 2 }} />
          )}
        </>
      }
      footer={
        <>
          <span>{t("footerPrompt")}</span>
          <Link href={`/${locale}/login`}>{t("footerAction")}</Link>
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
