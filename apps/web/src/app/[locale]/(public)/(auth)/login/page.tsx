'use client';

import EmailIcon from "@mui/icons-material/Email";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import WifiOutlinedIcon from "@mui/icons-material/WifiOutlined";
import { Alert, Button, Checkbox, FormControlLabel } from "@mui/material";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

import { TextInputField } from "@supportops/ui-form";

import { authService } from "@/features/auth/services/auth.service";
import { ApiError } from "@/lib/api";
import { tokenManager } from "@/lib/auth/tokenManager";
import { AuthCard } from "../_components/AuthCard";
import styles from "../auth.module.css";

type LoginFormValues = {
  email: string;
  password: string;
  remember: boolean;
};

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locale } = useParams<{ locale: string }>();
  const t = useTranslations("auth.login");
  const commonT = useTranslations("auth.common");
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
      remember: true,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const { data: payload } = await authService.login({
        email: data.email,
        password: data.password,
      });

      tokenManager.setAccessToken(payload.accessToken);
      if (payload.refreshToken) {
        tokenManager.setRefreshToken(payload.refreshToken);
      }

      const nextPath = searchParams.get("next");
      if (nextPath?.startsWith("/")) {
        router.replace(`/${locale}${nextPath}`);
        return;
      }

      router.replace(`/${locale}/dashboard`);
    } catch (error: unknown) {
      const message = error instanceof ApiError ? error.message : "Unable to sign in";
      setError("root", { message });
    }
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
          <WifiOutlinedIcon sx={{ fontSize: 120, color: "#2563eb", mt: 2 }} />
        </>
      }
      footer={
        <>
          <span>{t("footerPrompt")}</span>
          <Link href={`/${locale}/register`}>{t("footerAction")}</Link>
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
            startIcon={<EmailIcon fontSize="small" />}
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
            label={commonT("passwordLabel")}
            placeholder={commonT("passwordPlaceholder")}
            type="password"
            startIcon={<LockOutlinedIcon fontSize="small" />}
            rules={{
              required: commonT("passwordRequired"),
            }}
          />
          <div className={styles.helperRow}>
            <FormControlLabel
              control={<Checkbox size="small" {...register("remember")} />}
              label={t("rememberMe")}
            />
            <Link href={`/${locale}/forgot-password`}>{t("forgotPassword")}</Link>
          </div>
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
          {errors.root?.message ? <Alert severity="error">{errors.root.message}</Alert> : null}
        </div>
      </form>
    </AuthCard>
  );
}
