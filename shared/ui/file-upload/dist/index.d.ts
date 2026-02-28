import { ReactElement, InputHTMLAttributes, RefObject } from 'react';
import { AvatarVariant, AvatarSize } from '@supportops/ui-avatar';

type RejectedFileReason = 'invalid-type' | 'file-too-large';
type RejectedFile = {
    file: File;
    reason: RejectedFileReason;
};
interface FileUploadProps {
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

declare function FileUpload({ accept, buttonLabel, disabled, helperText, maxFileSizeInBytes, multiple, onFilesChange, onRejectedFiles, value, }: FileUploadProps): ReactElement;

type FileUploadStatus = 'idle' | 'ready' | 'uploading' | 'done' | 'error';
interface FileValidationRule {
    acceptedTypes?: string[];
    custom?: (file: File) => string | null;
    maxFiles?: number;
    maxSize?: number;
}
interface UploadableFile {
    croppedBlob?: Blob | null;
    croppedPreviewUrl?: string | null;
    error?: string;
    file: File;
    id: string;
    previewUrl: string;
    progress: number;
    status: FileUploadStatus;
}
interface UploadProgress {
    progress: number;
}
type UploadFn = (file: UploadableFile, onProgress: (event: UploadProgress) => void) => Promise<void>;
interface UseFileUploadOptions {
    mockUploadDelay?: number;
    multiple?: boolean;
    replaceOnSingle?: boolean;
    rules?: FileValidationRule;
    uploadFn?: UploadFn;
}
interface UseFileUploadReturn {
    addFiles: (fileList: FileList | File[]) => void;
    clearAll: () => void;
    files: UploadableFile[];
    inputProps: InputHTMLAttributes<HTMLInputElement>;
    inputRef: RefObject<HTMLInputElement | null>;
    openFilePicker: () => void;
    removeFile: (id: string) => void;
    setCroppedResult: (id: string, blob: Blob) => void;
    status: FileUploadStatus;
    uploadAll: () => Promise<void>;
    uploadOne: (id: string) => Promise<void>;
}

type AvatarUploadProps = {
    avatarVariant?: AvatarVariant;
    buttonLabel?: string;
    cropOnSelect?: boolean;
    currentSrc?: string | null;
    name?: string;
    onAvatarChange?: (blob: Blob, previewUrl: string) => void;
    onUploadError?: (message: string) => void;
    onUploadSuccess?: () => void;
    size?: AvatarSize;
    uploadFn?: UploadFn;
};
declare function AvatarUpload({ currentSrc, name, size, avatarVariant, onAvatarChange, onUploadError, onUploadSuccess, buttonLabel, cropOnSelect, uploadFn, }: AvatarUploadProps): ReactElement;

type CropPoint = {
    x: number;
    y: number;
};
interface UseImageCropReturn {
    closeCrop: () => void;
    crop: CropPoint;
    imageSrc: string | null;
    isOpen: boolean;
    openCrop: (fileId: string, src: string) => void;
    setCrop: (crop: CropPoint) => void;
    setZoom: (zoom: number) => void;
    targetFileId: string | null;
    zoom: number;
}
declare function useImageCrop(): UseImageCropReturn;
type CropImageParams = {
    crop: CropPoint;
    imageSrc: string;
    outputSize?: number;
    zoom: number;
};
declare function getCroppedImageBlob({ imageSrc, zoom, crop, outputSize, }: CropImageParams): Promise<Blob>;

type ImageCropDialogProps = {
    cancelLabel?: string;
    confirmLabel?: string;
    cropState: UseImageCropReturn;
    onConfirm: (fileId: string, blob: Blob) => void;
    title?: string;
};
declare function ImageCropDialog({ cropState, onConfirm, title, confirmLabel, cancelLabel, }: ImageCropDialogProps): ReactElement;

declare const MAX_FILE_SIZE_BYTES: number;
declare const MAX_VIDEO_SIZE_BYTES: number;
declare const IMAGE_ONLY_RULES: FileValidationRule;
declare const VIDEO_RULES: FileValidationRule;
declare const MEDIA_RULES: FileValidationRule;
declare const DOCUMENT_RULES: FileValidationRule;
declare const AVATAR_RULES: FileValidationRule;
declare function formatFileSize(bytes: number): string;

declare function useFileUpload(options?: UseFileUploadOptions): UseFileUploadReturn;

export { AVATAR_RULES, AvatarUpload, type AvatarUploadProps, DOCUMENT_RULES, FileUpload, type FileUploadProps, type FileUploadStatus, type FileValidationRule, IMAGE_ONLY_RULES, ImageCropDialog, MAX_FILE_SIZE_BYTES, MAX_VIDEO_SIZE_BYTES, MEDIA_RULES, type RejectedFile, type RejectedFileReason, type UploadFn, type UploadProgress, type UploadableFile, type UseFileUploadOptions, type UseFileUploadReturn, VIDEO_RULES, formatFileSize, getCroppedImageBlob, useFileUpload, useImageCrop };
