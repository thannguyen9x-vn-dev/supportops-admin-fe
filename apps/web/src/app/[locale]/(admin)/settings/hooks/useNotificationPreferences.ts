"use client";

import { useCallback, useState } from "react";

import { useToast } from "@/features/common/toast/useToast";

import { mockSave } from "../settings.mock";
import type { NotificationItemKey, NotificationPreference } from "../settings.types";

type UseNotificationPreferencesOptions = {
  t: (key: string) => string;
};

export function useNotificationPreferences({ t }: UseNotificationPreferencesOptions) {
  const toast = useToast();
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);

  const toggle = useCallback(
    (key: NotificationItemKey, checked: boolean) => {
      let previousEnabled: boolean | undefined;

      setPreferences((prev) =>
        prev.map((item) => {
          if (item.key !== key) {
            return item;
          }

          previousEnabled = item.enabled;
          return { ...item, enabled: checked };
        }),
      );

      void mockSave().catch(() => {
        const rollbackEnabled = previousEnabled;
        if (rollbackEnabled === undefined) {
          return;
        }

        setPreferences((prev) =>
          prev.map((item) => (item.key === key ? { ...item, enabled: rollbackEnabled } : item)),
        );
        toast.error(t("state.saveError"));
      });
    },
    [t, toast],
  );

  return { preferences, setPreferences, toggle };
}
