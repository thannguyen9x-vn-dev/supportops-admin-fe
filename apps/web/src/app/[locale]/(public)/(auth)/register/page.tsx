'use client';

import EmailIcon from "@mui/icons-material/Email";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { Alert, Button, Checkbox, FormControlLabel } from "@mui/material";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { registerSchema } from "@supportops/contracts";
import { TextInputField } from "@supportops/ui-form";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { ApiError } from "@/lib/api";
import { AuthCard } from "../_components/AuthCard";
import styles from "../auth.module.css";

type RegisterFormValues = {
  fullName: string;
  organizationName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
};

export default function RegisterPage() {
  const router = useRouter();
  const { locale } = useParams<{ locale: string }>();
  const { register: registerAuth } = useAuth();
  const t = useTranslations("auth.register");
  const commonT = useTranslations("auth.common");
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
  } = useForm<RegisterFormValues>({
    defaultValues: {
      fullName: "",
      organizationName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    const [firstNameRaw, ...rest] = data.fullName.trim().split(/\s+/);
    const firstName = firstNameRaw || data.fullName.trim();
    const lastName = rest.join(" ");
    const validated = registerSchema.safeParse({
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
      firstName,
      lastName: lastName || firstName,
      organizationName: data.organizationName,
    });

    if (!validated.success) {
      const issues = validated.error.issues as Array<{ path: Array<string | number>; message: string }>;
      issues.forEach((issue) => {
        const field = issue.path[0];
        if (field === "firstName" || field === "lastName") {
          setError("fullName", { message: t("fullNameRequired") });
          return;
        }

        if (
          field === "email" ||
          field === "password" ||
          field === "confirmPassword" ||
          field === "organizationName"
        ) {
          setError(field, { message: issue.message });
        }
      });
      return;
    }

    try {
      await registerAuth({
        email: data.email,
        password: data.password,
        firstName,
        lastName: lastName || firstName,
        organizationName: data.organizationName,
      });
      router.replace(`/${locale}/dashboard`);
    } catch (error) {
      const message = error instanceof ApiError ? error.message : t("genericError");
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
            name="organizationName"
            control={control}
            label={t("organizationLabel")}
            placeholder={t("organizationPlaceholder")}
            startIcon={<PersonOutlineIcon fontSize="small" />}
            rules={{
              required: t("organizationRequired"),
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
          {errors.root?.message ? <Alert severity="error">{errors.root.message}</Alert> : null}
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
            {isSubmitting ? t("submitting") : t("submit")}
          </Button>
        </div>
      </form>
    </AuthCard>
  );
}
