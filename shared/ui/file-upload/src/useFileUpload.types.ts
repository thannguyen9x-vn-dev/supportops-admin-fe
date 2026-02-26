import type { InputHTMLAttributes, RefObject } from 'react'

export type FileUploadStatus = 'idle' | 'ready' | 'uploading' | 'done' | 'error'

export interface FileValidationRule {
  acceptedTypes?: string[]
  custom?: (file: File) => string | null
  maxFiles?: number
  maxSize?: number
}

export interface UploadableFile {
  croppedBlob?: Blob | null
  croppedPreviewUrl?: string | null
  error?: string
  file: File
  id: string
  previewUrl: string
  progress: number
  status: FileUploadStatus
}

export interface UploadProgress {
  progress: number
}

export type UploadFn = (
  file: UploadableFile,
  onProgress: (event: UploadProgress) => void,
) => Promise<void>

export interface UseFileUploadOptions {
  mockUploadDelay?: number
  multiple?: boolean
  replaceOnSingle?: boolean
  rules?: FileValidationRule
  uploadFn?: UploadFn
}

export interface UseFileUploadReturn {
  addFiles: (fileList: FileList | File[]) => void
  clearAll: () => void
  files: UploadableFile[]
  inputProps: InputHTMLAttributes<HTMLInputElement>
  inputRef: RefObject<HTMLInputElement | null>
  openFilePicker: () => void
  removeFile: (id: string) => void
  setCroppedResult: (id: string, blob: Blob) => void
  status: FileUploadStatus
  uploadAll: () => Promise<void>
  uploadOne: (id: string) => Promise<void>
}
