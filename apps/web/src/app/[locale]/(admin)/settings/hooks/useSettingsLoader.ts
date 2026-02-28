"use client";

import { useCallback, useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

import { mockFetchSettings } from "../settings.mock";
import type { LoadState, SettingsData } from "../settings.types";

type UseSettingsLoaderReturn = {
  data: SettingsData | null;
  loadState: LoadState;
  reload: () => Promise<void>;
  setData: Dispatch<SetStateAction<SettingsData | null>>;
};

export function useSettingsLoader(): UseSettingsLoaderReturn {
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [data, setData] = useState<SettingsData | null>(null);

  const reload = useCallback(async () => {
    setLoadState("loading");

    try {
      const response = await mockFetchSettings();
      if (!response) {
        setLoadState("empty");
        setData(null);
        return;
      }

      setData(response);
      setLoadState("ready");
    } catch {
      setLoadState("error");
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void reload();
    }, 0);

    return () => {
      clearTimeout(timer);
    };
  }, [reload]);

  return { data, loadState, reload, setData };
}
