"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { useToast } from "@/features/common/toast/useToast";

import { MOCK_SETTINGS_DATA, mockSave } from "../settings.mock";
import type { ProfileFormValues, SubmitState } from "../settings.types";

type UseProfileFormOptions = {
  onSaved: (values: ProfileFormValues) => void;
  t: (key: string) => string;
};

export function useProfileForm({ t, onSaved }: UseProfileFormOptions) {
  const toast = useToast();
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  const {
    control,
    handleSubmit,
    reset,
  } = useForm<ProfileFormValues>({
    defaultValues: MOCK_SETTINGS_DATA.profile,
  });

  const onSubmit = async (values: ProfileFormValues) => {
    setSubmitState("saving");

    try {
      await mockSave();
      onSaved(values);
      setSubmitState("success");
      toast.success(t("state.saved"));
    } catch {
      setSubmitState("error");
      toast.error(t("state.saveError"));
    }
  };

  return { control, handleSubmit, onSubmit, reset, submitState };
}
