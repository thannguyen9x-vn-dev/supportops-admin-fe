'use client';

import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import { Button } from "@mui/material";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";

import { TextInputField } from "@supportops/ui-form";

import { AuthCard } from "../_components/AuthCard";
import styles from "../auth.module.css";

type ForgotFormValues = {
  email: string;
};

export default function ForgotPasswordPage() {
  const { locale } = useParams<{ locale: string }>();
  const t = useTranslations("auth.forgotPassword");
  const commonT = useTranslations("auth.common");
  const { control, handleSubmit } = useForm<ForgotFormValues>({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotFormValues) => {
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
          <LockResetOutlinedIcon
            sx={{ fontSize: 120, color: "#2563eb", mt: 2 }}
          />
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
