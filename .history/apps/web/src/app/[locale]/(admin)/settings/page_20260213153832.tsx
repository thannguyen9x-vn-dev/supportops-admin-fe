"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import {
  Alert,
  Avatar,
  Button,
  CircularProgress,
  FormControlLabel,
  MenuItem,
  Snackbar,
  Switch,
} from "@mui/material";
import type { AlertColor } from "@mui/material";

import { TextInputField } from "@supportops/ui-form";

import styles from "./settings.module.css";

type LoadState = "loading" | "ready" | "error" | "empty";
type SubmitState = "idle" | "saving" | "success" | "error";

type ProfileFormValues = {
  firstName: string;
  lastName: string;
  birthday: string;
  phoneNumber: string;
  address: string;
  country: string;
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

type NotificationPreference = {
  key: string;
  enabled: boolean;
};

type SettingsData = {
  profile: ProfileFormValues;
  notifications: NotificationPreference[];
};

type ToastState = {
  message: string;
  open: boolean;
  severity: AlertColor;
};

const MOCK_SETTINGS_DATA: SettingsData = {
  profile: {
    firstName: "Thomas",
    lastName: "Lean",
    birthday: "12/08/1786",
    phoneNumber: "+(12)3456 789",
    address: "California",
    country: "United States",
    email: "name@example.com",
    organization: "Themesberg",
    zipCode: "123456",
    city: "San Francisco",
    department: "Marketing",
  },
  notifications: [
    { key: "companyNews", enabled: false },
    { key: "accountActivity", enabled: true },
    { key: "meetupsNearYou", enabled: true },
    { key: "newMessages", enabled: false },
    { key: "ratingReminders", enabled: true },
    { key: "itemUpdateNotifications", enabled: true },
    { key: "itemCommentNotifications", enabled: true },
    { key: "buyerReviewNotifications", enabled: false },
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

export default function SettingsPage() {
  const t = useTranslations("pages.settings");
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [data, setData] = useState<SettingsData | null>(null);
  const [profileSubmitState, setProfileSubmitState] = useState<SubmitState>("idle");
  const [passwordSubmitState, setPasswordSubmitState] = useState<SubmitState>("idle");
  const [notificationSubmitState, setNotificationSubmitState] = useState<SubmitState>("idle");
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreference[]>([]);
  const [toast, setToast] = useState<ToastState>({
    message: "",
    open: false,
    severity: "success",
  });

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

  const groupedNotifications = {
    alerts: notificationPreferences.slice(0, 4),
    email: notificationPreferences.slice(4, 8),
  };

  const showToast = (severity: AlertColor, message: string) => {
    setToast({
      message,
      open: true,
      severity,
    });
  };

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
      showToast("success", t("state.saved"));
    } catch {
      setProfileSubmitState("error");
      showToast("error", t("state.saveError"));
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
      showToast("success", t("state.saved"));
    } catch {
      setPasswordSubmitState("error");
      showToast("error", t("state.saveError"));
    }
  };

  const onNotificationSubmit = async () => {
    setNotificationSubmitState("saving");
    try {
      await mockSave();
      setNotificationSubmitState("success");
      showToast("success", t("state.saved"));
    } catch {
      setNotificationSubmitState("error");
      showToast("error", t("state.saveError"));
    }
  };

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
        <Button onClick={loadSettings} variant="contained">
          {t("action.retry")}
        </Button>
      </div>
    );
  }

  if (loadState === "empty" || !data) {
    return (
      <div className={styles.centeredState}>
        <Alert severity="info">{t("state.empty")}</Alert>
        <Button onClick={loadSettings} variant="outlined">
          {t("action.reload")}
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className={styles.page}>
        <div className={styles.leftColumn}>
          <section className={styles.card}>
            <div className={styles.userHeader}>
              <Avatar sx={{ width: 64, height: 64 }}>{`${data.profile.firstName[0]}${data.profile.lastName[0]}`}</Avatar>
              <div>
                <h2 className={styles.userName}>{`${data.profile.firstName} ${data.profile.lastName}`}</h2>
                <p className={styles.userRole}>{t("profile.userRole")}</p>
              </div>
            </div>
          </section>

          <section className={styles.card}>
            <h3 className={styles.sectionTitle}>{t("notifications.alertsTitle")}</h3>
            <div className={styles.preferenceList}>
              {groupedNotifications.alerts.map((item) => (
                <FormControlLabel
                  key={item.key}
                  control={
                    <Switch
                      checked={item.enabled}
                      onChange={(event) => {
                        setNotificationPreferences((prev) =>
                          prev.map((preference) =>
                            preference.key === item.key
                              ? { ...preference, enabled: event.target.checked }
                              : preference,
                          ),
                        );
                      }}
                    />
                  }
                  label={t(`notifications.items.${item.key}`)}
                />
              ))}
            </div>
          </section>
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
              <TextInputField control={profileControl} label={t("profile.fields.country")} name="country" select>
                <MenuItem value="United States">{t("countries.unitedStates")}</MenuItem>
                <MenuItem value="Canada">{t("countries.canada")}</MenuItem>
                <MenuItem value="Vietnam">{t("countries.vietnam")}</MenuItem>
              </TextInputField>

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
                <Button disabled={profileSubmitState === "saving"} type="submit" variant="contained">
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
                type="password"
                rules={{ required: t("validation.required") }}
              />
              <TextInputField
                control={passwordControl}
                label={t("password.newPassword")}
                name="newPassword"
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
                type="password"
                rules={{
                  required: t("validation.required"),
                }}
              />

              <div className={styles.formActions}>
                <Button disabled={passwordSubmitState === "saving"} type="submit" variant="contained">
                  {passwordSubmitState === "saving" ? t("action.saving") : t("action.update")}
                </Button>
              </div>
            </form>
          </section>

          <section className={styles.card}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>{t("notifications.emailTitle")}</h3>
            </div>

            <div className={styles.preferenceList}>
              {groupedNotifications.email.map((item) => (
                <FormControlLabel
                  key={item.key}
                  control={
                    <Switch
                      checked={item.enabled}
                      onChange={(event) => {
                        setNotificationPreferences((prev) =>
                          prev.map((preference) =>
                            preference.key === item.key
                              ? { ...preference, enabled: event.target.checked }
                              : preference,
                          ),
                        );
                      }}
                    />
                  }
                  label={t(`notifications.items.${item.key}`)}
                />
              ))}
            </div>

            <div className={styles.formActions}>
              <Button
                disabled={notificationSubmitState === "saving"}
                onClick={onNotificationSubmit}
                variant="contained"
              >
                {notificationSubmitState === "saving" ? t("action.saving") : t("action.savePreferences")}
              </Button>
            </div>
          </section>
        </div>
      </div>

      <Snackbar
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
        autoHideDuration={3000}
        onClose={() => {
          setToast((prev) => ({
            ...prev,
            open: false,
          }));
        }}
        open={toast.open}
      >
        <Alert
          onClose={() => {
            setToast((prev) => ({
              ...prev,
              open: false,
            }));
          }}
          severity={toast.severity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}
