"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";

import { AvatarUpload, type UploadFn } from "@supportops/ui-file-upload";

import { useToast } from "@/features/common/toast/useToast";

import styles from "../settings.module.css";

type UploadAvatarErrorResponse = {
  code?: "FILE_TOO_LARGE" | "INVALID_TYPE" | "MISSING_FILE";
};

type ProfileCardProps = {
  firstName: string;
  lastName: string;
};

export function ProfileCard({ firstName, lastName }: ProfileCardProps) {
  const t = useTranslations("pages.settings");
  const toast = useToast();

  const fullName = `${firstName} ${lastName}`;

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

  return (
    <section className={styles.card}>
      <div className={styles.userHeader}>
        <AvatarUpload
          buttonLabel={t("profile.changePicture")}
          name={fullName}
          size="lg"
          uploadFn={avatarUploadFn}
        />
        <div>
          <h2 className={styles.userName}>{fullName}</h2>
          <p className={styles.userRole}>{t("profile.userRole")}</p>
        </div>
      </div>
    </section>
  );
}
