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

  export type RejectedFileReason = "invalid-type" | "file-too-large";

  export type RejectedFile = {
    file: File;
    reason: RejectedFileReason;
  };

  export interface FileUploadProps {
    accept?: string;
    buttonLabel?: string;
    disabled?: boolean;
    helperText?: string;
    maxFileSizeInBytes?: number;
    multiple?: boolean;
    onFilesChange?: (files: File[]) => void;
    onRejectedFiles?: (rejectedFiles: RejectedFile[]) => void;
    value?: File[];
  }

  export const AvatarUpload: ComponentType<AvatarUploadProps>;
  export const FileUpload: ComponentType<FileUploadProps>;
}
