"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Alert, Button, CircularProgress, Switch } from "@mui/material";
import { useForm } from "react-hook-form";

import { AvatarUpload, type UploadFn } from "@supportops/ui-file-upload";
import { SelectOptionField, TextInputField } from "@supportops/ui-form";

import { useToast } from "@/features/common/toast/useToast";
import { createCountryOptions, type CountryCode } from "@/shared/constants/countries";

import styles from "./settings.module.css";

type LoadState = "loading" | "ready" | "error" | "empty";
type SubmitState = "idle" | "saving" | "success" | "error";

type ProfileFormValues = {
  firstName: string;
  lastName: string;
  birthday: string;
  phoneNumber: string;
  address: string;
  country: CountryCode;
  email: string;
  organization: string;
  zipCode: string;
  city: string;
  department: string;
};

type PasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

type NotificationItemKey =
  | "companyNews"
  | "accountActivity"
  | "meetupsNearYou"
  | "newMessages"
  | "ratingReminders"
  | "itemUpdateNotifications"
  | "itemCommentNotifications"
  | "buyerReviewNotifications";

type NotificationGroupKey = "alerts" | "email";

type NotificationPreference = {
  key: NotificationItemKey;
  group: NotificationGroupKey;
  enabled: boolean;
};

type SettingsData = {
  profile: ProfileFormValues;
  notifications: NotificationPreference[];
};

const MOCK_SETTINGS_DATA: SettingsData = {
  profile: {
    firstName: "Thomas",
    lastName: "Lean",
    birthday: "12/08/1786",
    phoneNumber: "+(12)3456 789",
    address: "California",
    country: "US",
    email: "name@example.com",
    organization: "Themesberg",
    zipCode: "123456",
    city: "San Francisco",
    department: "Marketing",
  },
  notifications: [
    { key: "companyNews", group: "alerts", enabled: false },
    { key: "accountActivity", group: "alerts", enabled: true },
    { key: "meetupsNearYou", group: "alerts", enabled: true },
    { key: "newMessages", group: "alerts", enabled: false },
    { key: "ratingReminders", group: "email", enabled: true },
    { key: "itemUpdateNotifications", group: "email", enabled: true },
    { key: "itemCommentNotifications", group: "email", enabled: true },
    { key: "buyerReviewNotifications", group: "email", enabled: false },
  ],
};

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function mockFetchSettings(): Promise<SettingsData | null> {
  await wait(450);
  return MOCK_SETTINGS_DATA;
}

async function mockSave() {
  await wait(500);
}

type UploadAvatarErrorResponse = {
  code?: "FILE_TOO_LARGE" | "INVALID_TYPE" | "MISSING_FILE";
};

type NotificationSettingsCardProps = {
  title: string;
  description: string;
  items: NotificationPreference[];
  onToggle: (key: NotificationItemKey, checked: boolean) => void;
  t: ReturnType<typeof useTranslations<"pages.settings">>;
};

function NotificationSettingsCard({ title, description, items, onToggle, t }: NotificationSettingsCardProps) {
  return (
    <section className={styles.card}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>{title}</h3>
      </div>
      <p className={styles.sectionDescription}>{description}</p>

      <div className={styles.preferenceList}>
        {items.map((item) => (
          <div className={styles.preferenceItem} key={item.key}>
            <div className={styles.preferenceContent}>
              <p className={styles.preferenceTitle}>{t(`notifications.items.${item.key}.title`)}</p>
              <p className={styles.preferenceDescription}>{t(`notifications.items.${item.key}.description`)}</p>
            </div>
            <Switch
              checked={item.enabled}
              inputProps={{ "aria-label": t(`notifications.items.${item.key}.title`) }}
              onChange={(event) => {
                onToggle(item.key, event.target.checked);
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function SettingsPage() {
  const t = useTranslations("pages.settings");
  const toast = useToast();
  const locale = useLocale();
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [data, setData] = useState<SettingsData | null>(null);
  const [profileSubmitState, setProfileSubmitState] = useState<SubmitState>("idle");
  const [passwordSubmitState, setPasswordSubmitState] = useState<SubmitState>("idle");
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreference[]>([]);

  const {
    control: profileControl,
    handleSubmit: handleProfileSubmit,
    reset: resetProfileForm,
  } = useForm<ProfileFormValues>({
    defaultValues: MOCK_SETTINGS_DATA.profile,
  });

  const {
    control: passwordControl,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    setError: setPasswordError,
  } = useForm<PasswordFormValues>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const groupedNotifications = useMemo(
    () => ({
      alerts: notificationPreferences.filter((item) => item.group === "alerts"),
      email: notificationPreferences.filter((item) => item.group === "email"),
    }),
    [notificationPreferences],
  );
  const countryOptions = useMemo(() => createCountryOptions({ locale }), [locale]);

  const avatarUploadFn = useCallback<UploadFn>(
    async (uploadableFile, onProgress) => {
      const payload = uploadableFile.croppedBlob ?? uploadableFile.file;
      const formData = new FormData();

      formData.append("file", payload, uploadableFile.file.name);
      onProgress({ progress: 15 });

      const response = await fetch("/api/upload/avatar", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let code: UploadAvatarErrorResponse["code"];

        try {
          const body = (await response.json()) as UploadAvatarErrorResponse;
          code = body.code;
        } catch {
          code = undefined;
        }

        let errorMessage = t("profile.avatarUploadError");
        if (code === "FILE_TOO_LARGE") {
          errorMessage = t("profile.avatarUploadSizeError");
        } else if (code === "INVALID_TYPE") {
          errorMessage = t("profile.avatarUploadTypeError");
        }

        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      onProgress({ progress: 100 });
      toast.success(t("profile.avatarUploadSuccess"));
    },
    [t, toast],
  );

  const loadSettings = useCallback(async () => {
    setLoadState("loading");
    try {
      const response = await mockFetchSettings();
      if (!response) {
        setLoadState("empty");
        setData(null);
        return;
      }

      setData(response);
      resetProfileForm(response.profile);
      setNotificationPreferences(response.notifications);
      setLoadState("ready");
    } catch {
      setLoadState("error");
    }
  }, [resetProfileForm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadSettings();
    }, 0);

    return () => {
      clearTimeout(timer);
    };
  }, [loadSettings]);

  const onProfileSubmit = async (values: ProfileFormValues) => {
    setProfileSubmitState("saving");
    try {
      await mockSave();
      setData((prev) => {
        if (!prev) {
          return prev;
        }
        return {
          ...prev,
          profile: values,
        };
      });
      setProfileSubmitState("success");
      toast.success(t("state.saved"));
    } catch {
      setProfileSubmitState("error");
      toast.error(t("state.saveError"));
    }
  };

  const onPasswordSubmit = async (values: PasswordFormValues) => {
    if (values.newPassword !== values.confirmNewPassword) {
      setPasswordError("confirmNewPassword", {
        type: "validate",
        message: t("validation.passwordMismatch"),
      });
      return;
    }

    setPasswordSubmitState("saving");
    try {
      await mockSave();
      resetPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      setPasswordSubmitState("success");
      toast.success(t("state.saved"));
    } catch {
      setPasswordSubmitState("error");
      toast.error(t("state.saveError"));
    }
  };

  const onNotificationToggle = useCallback((key: NotificationItemKey, checked: boolean) => {
    const previousEnabled = notificationPreferences.find((preference) => preference.key === key)?.enabled;

    setNotificationPreferences((prev) =>
      prev.map((preference) => (preference.key === key ? { ...preference, enabled: checked } : preference)),
    );

    void mockSave().catch(() => {
      if (previousEnabled === undefined) {
        return;
      }

      setNotificationPreferences((prev) =>
        prev.map((preference) => (preference.key === key ? { ...preference, enabled: previousEnabled } : preference)),
      );
      toast.error(t("state.saveError"));
    });
  }, [notificationPreferences, t, toast]);

  if (loadState === "loading") {
    return (
      <div className={styles.centeredState}>
        <CircularProgress size={28} />
        <p>{t("state.loading")}</p>
      </div>
    );
  }

  if (loadState === "error") {
    return (
      <div className={styles.centeredState}>
        <Alert severity="error">{t("state.error")}</Alert>
        <Button onClick={loadSettings} size="medium" variant="contained">
          {t("action.retry")}
        </Button>
      </div>
    );
  }

  if (loadState === "empty" || !data) {
    return (
      <div className={styles.centeredState}>
        <Alert severity="info">{t("state.empty")}</Alert>
        <Button onClick={loadSettings} size="medium" variant="outlined">
          {t("action.reload")}
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.leftColumn}>
        <section className={styles.card}>
          <div className={styles.userHeader}>
            <AvatarUpload
              buttonLabel={t("profile.changePicture")}
              name={`${data.profile.firstName} ${data.profile.lastName}`}
              size="lg"
              uploadFn={avatarUploadFn}
            />
            <div>
              <h2 className={styles.userName}>{`${data.profile.firstName} ${data.profile.lastName}`}</h2>
              <p className={styles.userRole}>{t("profile.userRole")}</p>
            </div>
          </div>
        </section>

        <NotificationSettingsCard
          description={t("notifications.alertsDescription")}
          items={groupedNotifications.alerts}
          onToggle={onNotificationToggle}
          t={t}
          title={t("notifications.alertsTitle")}
        />
        <NotificationSettingsCard
          description={t("notifications.emailDescription")}
          items={groupedNotifications.email}
          onToggle={onNotificationToggle}
          t={t}
          title={t("notifications.emailTitle")}
        />
      </div>

      <div className={styles.rightColumn}>
        <section className={styles.card}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>{t("profile.generalInfoTitle")}</h3>
          </div>

          <form className={styles.formGrid} onSubmit={handleProfileSubmit(onProfileSubmit)}>
            <TextInputField
              control={profileControl}
              label={t("profile.fields.firstName")}
              name="firstName"
              placeholder="Thomas"
              rules={{ required: t("validation.required") }}
            />
            <TextInputField
              control={profileControl}
              label={t("profile.fields.birthday")}
              name="birthday"
              placeholder="12/08/1786"
            />

            <TextInputField
              control={profileControl}
              label={t("profile.fields.lastName")}
              name="lastName"
              placeholder="Lean"
              rules={{ required: t("validation.required") }}
            />
            <TextInputField
              control={profileControl}
              label={t("profile.fields.phoneNumber")}
              name="phoneNumber"
              placeholder="e.g. +(12)3456 789"
            />

            <TextInputField
              control={profileControl}
              label={t("profile.fields.organization")}
              name="organization"
              placeholder="Themesberg"
            />
            <SelectOptionField
              control={profileControl}
              label={t("profile.fields.country")}
              name="country"
              noOptionsText={t("countries.noOptions")}
              options={countryOptions}
              searchable
              searchInPopup
              searchPlaceholder={t("countries.searchPlaceholder")}
            />

            <TextInputField
              control={profileControl}
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
              control={profileControl}
              label={t("profile.fields.zipCode")}
              name="zipCode"
              placeholder="123456"
            />

            <TextInputField
              control={profileControl}
              label={t("profile.fields.department")}
              name="department"
              placeholder="Marketing"
            />
            <TextInputField
              control={profileControl}
              label={t("profile.fields.city")}
              name="city"
              placeholder="e.g. San Francisco"
            />

            <TextInputField
              className={styles.fullRow}
              control={profileControl}
              label={t("profile.fields.address")}
              name="address"
              placeholder="e.g. California"
            />

            <div className={styles.formActions}>
              <Button disabled={profileSubmitState === "saving"} size="medium" type="submit" variant="contained">
                {profileSubmitState === "saving" ? t("action.saving") : t("action.update")}
              </Button>
            </div>
          </form>
        </section>

        <section className={styles.card}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>{t("password.title")}</h3>
          </div>

          <form className={styles.passwordGrid} onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
            <TextInputField
              control={passwordControl}
              label={t("password.currentPassword")}
              name="currentPassword"
              placeholder={t("password.placeholders.currentPassword")}
              type="password"
              rules={{ required: t("validation.required") }}
            />
            <TextInputField
              control={passwordControl}
              label={t("password.newPassword")}
              name="newPassword"
              placeholder={t("password.placeholders.newPassword")}
              type="password"
              rules={{
                required: t("validation.required"),
                minLength: {
                  value: 10,
                  message: t("validation.passwordMin"),
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[^A-Za-z0-9]).+$/,
                  message: t("validation.passwordFormat"),
                },
              }}
            />
            <TextInputField
              control={passwordControl}
              label={t("password.confirmNewPassword")}
              name="confirmNewPassword"
              placeholder={t("password.placeholders.confirmNewPassword")}
              type="password"
              rules={{
                required: t("validation.required"),
              }}
            />
            <div className={styles.passwordRequirements}>
              <h4 className={styles.passwordRequirementsTitle}>{t("password.requirements.title")}</h4>
              <p className={styles.passwordRequirementsDescription}>{t("password.requirements.description")}</p>
              <ul className={styles.passwordRequirementsList}>
                <li>{t("password.requirements.minLength")}</li>
                <li>{t("password.requirements.lowercase")}</li>
                <li>{t("password.requirements.specialCharacter")}</li>
              </ul>
            </div>

            <div className={styles.formActions}>
              <Button size="medium" disabled={passwordSubmitState === "saving"} type="submit" variant="contained">
                {passwordSubmitState === "saving" ? t("action.saving") : t("action.update")}
              </Button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
