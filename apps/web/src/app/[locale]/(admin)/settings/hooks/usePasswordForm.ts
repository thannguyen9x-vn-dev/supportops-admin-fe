"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { useToast } from "@/features/common/toast/useToast";

import { mockSave } from "../settings.mock";
import type { PasswordFormValues, SubmitState } from "../settings.types";

type UsePasswordFormOptions = {
  t: (key: string) => string;
};

export function usePasswordForm({ t }: UsePasswordFormOptions) {
  const toast = useToast();
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  const {
    control,
    handleSubmit,
    reset,
    setError,
  } = useForm<PasswordFormValues>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = async (values: PasswordFormValues) => {
    if (values.newPassword !== values.confirmNewPassword) {
      setError("confirmNewPassword", {
        type: "validate",
        message: t("validation.passwordMismatch"),
      });
      return;
    }

    setSubmitState("saving");

    try {
      await mockSave();
      reset({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      setSubmitState("success");
      toast.success(t("state.saved"));
    } catch {
      setSubmitState("error");
      toast.error(t("state.saveError"));
    }
  };

  return { control, handleSubmit, onSubmit, submitState };
}
