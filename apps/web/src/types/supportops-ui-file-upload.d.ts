declare module "@supportops/ui-file-upload" {
  import type { ComponentType } from "react";

  export type UploadableFile = {
    file: File;
    croppedBlob?: Blob | null;
  };

  export type UploadProgress = {
    progress: number;
  };

  export type UploadFn = (
    uploadableFile: UploadableFile,
    onProgress: (progress: UploadProgress) => void
  ) => Promise<void>;

  export interface AvatarUploadProps {
    buttonLabel: string;
    name: string;
    size?: "sm" | "md" | "lg";
    uploadFn: UploadFn;
  }

  export const AvatarUpload: ComponentType<AvatarUploadProps>;
}
