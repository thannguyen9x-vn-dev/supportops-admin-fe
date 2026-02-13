'use client';

import EmailIcon from "@mui/icons-material/Email";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { Button, Checkbox, FormControlLabel } from "@mui/material";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";

import { TextInputField } from "@supportops/ui-form";

import { AuthCard } from "../../../../../components/auth/AuthCard";
import styles from "../auth.module.css";

type RegisterFormValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
};

export default function RegisterPage() {
  const { locale } = useParams<{ locale: string }>();
  const t = useTranslations("auth.register");
  const commonT = useTranslations("auth.common");
  const { control, handleSubmit, register } = useForm<RegisterFormValues>({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
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
          <PersonOutlineIcon sx={{ fontSize: 120, color: "#1d4ed8", mt: 2 }} />
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
            name="fullName"
            control={control}
            label={t("fullNameLabel")}
            placeholder={t("fullNamePlaceholder")}
            startIcon={<PersonOutlineIcon fontSize="small" />}
            rules={{
              required: t("fullNameRequired"),
            }}
          />
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
            placeholder={t("passwordPlaceholder")}
            type="password"
            startIcon={<LockOutlinedIcon fontSize="small" />}
            rules={{
              required: commonT("passwordRequired"),
            }}
          />
          <TextInputField
            name="confirmPassword"
            control={control}
            label={t("confirmPasswordLabel")}
            placeholder={t("confirmPasswordPlaceholder")}
            type="password"
            startIcon={<LockOutlinedIcon fontSize="small" />}
            rules={{
              required: t("confirmPasswordRequired"),
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
