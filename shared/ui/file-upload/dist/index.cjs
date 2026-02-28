'use strict';

var react = require('react');
var DeleteOutlineRoundedIcon = require('@mui/icons-material/DeleteOutlineRounded');
var UploadFileRoundedIcon = require('@mui/icons-material/UploadFileRounded');
var material = require('@mui/material');
var jsxRuntime = require('react/jsx-runtime');
var SettingsRoundedIcon = require('@mui/icons-material/SettingsRounded');
var uiAvatar = require('@supportops/ui-avatar');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var DeleteOutlineRoundedIcon__default = /*#__PURE__*/_interopDefault(DeleteOutlineRoundedIcon);
var UploadFileRoundedIcon__default = /*#__PURE__*/_interopDefault(UploadFileRoundedIcon);
var SettingsRoundedIcon__default = /*#__PURE__*/_interopDefault(SettingsRoundedIcon);

// src/FileUpload.tsx

// src/fileUpload.constants.ts
var MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;
var MAX_VIDEO_SIZE_BYTES = 50 * 1024 * 1024;
var IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
var VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
var IMAGE_ONLY_RULES = {
  acceptedTypes: [...IMAGE_TYPES],
  maxSize: MAX_FILE_SIZE_BYTES
};
var VIDEO_RULES = {
  acceptedTypes: [...VIDEO_TYPES],
  maxSize: MAX_VIDEO_SIZE_BYTES
};
var MEDIA_RULES = {
  acceptedTypes: [...IMAGE_TYPES, ...VIDEO_TYPES],
  custom: (file) => {
    const limit = file.type.startsWith("video/") ? MAX_VIDEO_SIZE_BYTES : MAX_FILE_SIZE_BYTES;
    if (file.size > limit) {
      const fileSizeMb = (file.size / (1024 * 1024)).toFixed(1);
      const limitMb = (limit / (1024 * 1024)).toFixed(0);
      return `File ${fileSizeMb}MB exceeds ${limitMb}MB limit`;
    }
    return null;
  },
  maxFiles: 10
};
var DOCUMENT_RULES = {
  acceptedTypes: [
    ...IMAGE_TYPES,
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ],
  maxSize: MAX_FILE_SIZE_BYTES,
  maxFiles: 10
};
var AVATAR_RULES = {
  acceptedTypes: ["image/jpeg", "image/png", "image/webp"],
  maxFiles: 1,
  maxSize: MAX_FILE_SIZE_BYTES
};
function formatFileSize(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}
function bytesToMb(bytes) {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
function matchAccept(file, accept) {
  if (!accept) {
    return true;
  }
  const acceptParts = accept.split(",").map((part) => part.trim().toLowerCase()).filter(Boolean);
  if (acceptParts.length === 0) {
    return true;
  }
  return acceptParts.some((part) => {
    if (part.endsWith("/*")) {
      const prefix = part.slice(0, -1);
      return file.type.toLowerCase().startsWith(prefix);
    }
    if (part.startsWith(".")) {
      return file.name.toLowerCase().endsWith(part);
    }
    return file.type.toLowerCase() === part;
  });
}
function getErrorMessage(maxFileSizeInBytes) {
  if (!maxFileSizeInBytes) {
    return "Maximum size: 2 MB for files, 50 MB for videos";
  }
  return `Maximum size: ${bytesToMb(maxFileSizeInBytes)} per file`;
}
function getMaxSizeByFile(file, maxFileSizeInBytes) {
  if (maxFileSizeInBytes) {
    return maxFileSizeInBytes;
  }
  return file.type.startsWith("video/") ? MAX_VIDEO_SIZE_BYTES : MAX_FILE_SIZE_BYTES;
}
function FileUpload({
  accept,
  buttonLabel = "Select file",
  disabled = false,
  helperText,
  maxFileSizeInBytes,
  multiple = false,
  onFilesChange,
  onRejectedFiles,
  value
}) {
  const inputId = react.useId();
  const [dragOver, setDragOver] = react.useState(false);
  const [internalFiles, setInternalFiles] = react.useState([]);
  const files = value ?? internalFiles;
  const validationHint = react.useMemo(() => getErrorMessage(maxFileSizeInBytes), [maxFileSizeInBytes]);
  const updateFiles = (nextFiles) => {
    if (value === void 0) {
      setInternalFiles(nextFiles);
    }
    onFilesChange?.(nextFiles);
  };
  const processSelection = (selectedFiles) => {
    const accepted = [];
    const rejected = [];
    selectedFiles.forEach((file) => {
      if (!matchAccept(file, accept)) {
        rejected.push({ file, reason: "invalid-type" });
        return;
      }
      const maxSizeForFile = getMaxSizeByFile(file, maxFileSizeInBytes);
      if (file.size > maxSizeForFile) {
        rejected.push({ file, reason: "file-too-large" });
        return;
      }
      accepted.push(file);
    });
    if (rejected.length > 0) {
      onRejectedFiles?.(rejected);
    }
    const nextFiles = multiple ? [...files, ...accepted] : accepted.slice(0, 1);
    updateFiles(nextFiles);
  };
  const handleChange = (event) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    processSelection(selectedFiles);
    event.target.value = "";
  };
  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    if (disabled) {
      return;
    }
    processSelection(Array.from(event.dataTransfer.files));
  };
  const removeFile = (fileName) => {
    updateFiles(files.filter((file) => file.name !== fileName));
  };
  return /* @__PURE__ */ jsxRuntime.jsxs(material.Stack, { spacing: 1.5, children: [
    /* @__PURE__ */ jsxRuntime.jsxs(
      material.Box,
      {
        component: "label",
        htmlFor: inputId,
        onDragOver: (event) => {
          event.preventDefault();
          setDragOver(true);
        },
        onDragLeave: () => {
          setDragOver(false);
        },
        onDrop: handleDrop,
        sx: {
          p: 2,
          borderRadius: 2,
          borderWidth: 1,
          borderStyle: "dashed",
          borderColor: dragOver ? "primary.main" : "divider",
          backgroundColor: dragOver ? "action.hover" : "background.paper",
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "border-color 180ms ease, background-color 180ms ease"
        },
        children: [
          /* @__PURE__ */ jsxRuntime.jsxs(material.Stack, { alignItems: "center", spacing: 1.5, children: [
            /* @__PURE__ */ jsxRuntime.jsx(UploadFileRoundedIcon__default.default, { color: dragOver ? "primary" : "action" }),
            /* @__PURE__ */ jsxRuntime.jsx(material.Button, { component: "span", disabled, size: "small", variant: "outlined", children: buttonLabel }),
            /* @__PURE__ */ jsxRuntime.jsx(material.Typography, { color: "text.secondary", variant: "body2", children: helperText ?? "Drag and drop files here or click to browse" }),
            validationHint ? /* @__PURE__ */ jsxRuntime.jsx(material.Typography, { color: "text.secondary", variant: "caption", children: validationHint }) : null
          ] }),
          /* @__PURE__ */ jsxRuntime.jsx(
            "input",
            {
              accept,
              disabled,
              id: inputId,
              multiple,
              onChange: handleChange,
              style: { display: "none" },
              type: "file"
            }
          )
        ]
      }
    ),
    files.length > 0 ? /* @__PURE__ */ jsxRuntime.jsx(material.Stack, { spacing: 1, children: files.map((file) => /* @__PURE__ */ jsxRuntime.jsxs(
      material.Box,
      {
        sx: {
          px: 1.5,
          py: 1,
          borderRadius: 1.5,
          border: "1px solid var(--mui-palette-divider)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1
        },
        children: [
          /* @__PURE__ */ jsxRuntime.jsxs(material.Box, { children: [
            /* @__PURE__ */ jsxRuntime.jsx(material.Typography, { variant: "body2", children: file.name }),
            /* @__PURE__ */ jsxRuntime.jsx(material.Typography, { color: "text.secondary", variant: "caption", children: bytesToMb(file.size) })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsx(
            material.IconButton,
            {
              "aria-label": `Remove ${file.name}`,
              onClick: () => {
                removeFile(file.name);
              },
              size: "small",
              children: /* @__PURE__ */ jsxRuntime.jsx(DeleteOutlineRoundedIcon__default.default, { fontSize: "small" })
            }
          )
        ]
      },
      `${file.name}-${file.size}-${file.lastModified}`
    )) }) : null
  ] });
}
function useImageCrop() {
  const [targetFileId, setTargetFileId] = react.useState(null);
  const [imageSrc, setImageSrc] = react.useState(null);
  const [crop, setCrop] = react.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = react.useState(1);
  const openCrop = react.useCallback((fileId, src) => {
    setTargetFileId(fileId);
    setImageSrc(src);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  }, []);
  const closeCrop = react.useCallback(() => {
    setTargetFileId(null);
    setImageSrc(null);
  }, []);
  return {
    closeCrop,
    crop,
    imageSrc,
    isOpen: Boolean(targetFileId && imageSrc),
    openCrop,
    setCrop,
    setZoom,
    targetFileId,
    zoom
  };
}
async function loadImage(imageSrc) {
  const image = new Image();
  image.crossOrigin = "anonymous";
  await new Promise((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("Unable to load image for cropping"));
    image.src = imageSrc;
  });
  return image;
}
async function getCroppedImageBlob({
  imageSrc,
  zoom,
  crop,
  outputSize = 512
}) {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = outputSize;
  canvas.height = outputSize;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Canvas context is not available");
  }
  const imageWidth = image.naturalWidth;
  const imageHeight = image.naturalHeight;
  const baseScale = Math.max(outputSize / imageWidth, outputSize / imageHeight);
  const appliedScale = baseScale * zoom;
  const renderedWidth = imageWidth * appliedScale;
  const renderedHeight = imageHeight * appliedScale;
  const offsetX = (outputSize - renderedWidth) / 2 + crop.x;
  const offsetY = (outputSize - renderedHeight) / 2 + crop.y;
  const sourceX = Math.max(0, -offsetX / appliedScale);
  const sourceY = Math.max(0, -offsetY / appliedScale);
  const sourceWidth = Math.min(imageWidth - sourceX, outputSize / appliedScale);
  const sourceHeight = Math.min(imageHeight - sourceY, outputSize / appliedScale);
  context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, outputSize, outputSize);
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Unable to create cropped image blob"));
          return;
        }
        resolve(blob);
      },
      "image/jpeg",
      0.92
    );
  });
}
function ImageCropDialog({
  cropState,
  onConfirm,
  title = "Crop image",
  confirmLabel = "Apply",
  cancelLabel = "Cancel"
}) {
  const { isOpen, imageSrc, targetFileId, crop, setCrop, zoom, setZoom, closeCrop } = cropState;
  const handleConfirm = react.useCallback(async () => {
    if (!imageSrc || !targetFileId) {
      return;
    }
    const blob = await getCroppedImageBlob({
      crop,
      imageSrc,
      zoom
    });
    onConfirm(targetFileId, blob);
    closeCrop();
  }, [closeCrop, crop, imageSrc, onConfirm, targetFileId, zoom]);
  return /* @__PURE__ */ jsxRuntime.jsxs(material.Dialog, { fullWidth: true, maxWidth: "sm", onClose: closeCrop, open: isOpen, children: [
    /* @__PURE__ */ jsxRuntime.jsx(material.DialogTitle, { children: title }),
    /* @__PURE__ */ jsxRuntime.jsx(material.DialogContent, { children: /* @__PURE__ */ jsxRuntime.jsxs(material.Stack, { spacing: 2, children: [
      /* @__PURE__ */ jsxRuntime.jsx(
        material.Box,
        {
          sx: {
            position: "relative",
            width: "100%",
            maxWidth: 360,
            marginInline: "auto",
            aspectRatio: "1 / 1",
            borderRadius: 2,
            overflow: "hidden",
            bgcolor: "var(--mui-palette-grey-900)"
          },
          children: imageSrc ? /* @__PURE__ */ jsxRuntime.jsx(
            material.Box,
            {
              alt: "Crop preview",
              component: "img",
              src: imageSrc,
              sx: {
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: `translate(${crop.x}px, ${crop.y}px) scale(${zoom})`,
                transformOrigin: "center center"
              }
            }
          ) : null
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsxs(material.Stack, { spacing: 1, children: [
        /* @__PURE__ */ jsxRuntime.jsx(material.Typography, { variant: "body2", children: "Zoom" }),
        /* @__PURE__ */ jsxRuntime.jsx(
          material.Slider,
          {
            max: 3,
            min: 1,
            onChange: (_event, value) => {
              setZoom(typeof value === "number" ? value : value[0] ?? 1);
            },
            step: 0.1,
            value: zoom
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs(material.Stack, { spacing: 1, children: [
        /* @__PURE__ */ jsxRuntime.jsx(material.Typography, { variant: "body2", children: "Horizontal" }),
        /* @__PURE__ */ jsxRuntime.jsx(
          material.Slider,
          {
            max: 100,
            min: -100,
            onChange: (_event, value) => {
              const nextX = typeof value === "number" ? value : value[0] ?? 0;
              setCrop({ x: nextX, y: crop.y });
            },
            value: crop.x
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs(material.Stack, { spacing: 1, children: [
        /* @__PURE__ */ jsxRuntime.jsx(material.Typography, { variant: "body2", children: "Vertical" }),
        /* @__PURE__ */ jsxRuntime.jsx(
          material.Slider,
          {
            max: 100,
            min: -100,
            onChange: (_event, value) => {
              const nextY = typeof value === "number" ? value : value[0] ?? 0;
              setCrop({ x: crop.x, y: nextY });
            },
            value: crop.y
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntime.jsxs(material.DialogActions, { children: [
      /* @__PURE__ */ jsxRuntime.jsx(material.Button, { onClick: closeCrop, variant: "outlined", children: cancelLabel }),
      /* @__PURE__ */ jsxRuntime.jsx(material.Button, { disabled: !imageSrc, onClick: () => void handleConfirm(), variant: "contained", children: confirmLabel })
    ] })
  ] });
}
var fileIdCounter = 0;
function generateFileId() {
  fileIdCounter += 1;
  return `file-${Date.now()}-${fileIdCounter}`;
}
function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
function validateFile(file, rules) {
  if (!rules) {
    return null;
  }
  if (rules.acceptedTypes && rules.acceptedTypes.length > 0) {
    const isAccepted = rules.acceptedTypes.some((type) => {
      if (type.endsWith("/*")) {
        const prefix = type.replace("/*", "/");
        return file.type.startsWith(prefix);
      }
      return file.type === type;
    });
    if (!isAccepted) {
      return `File type "${file.type || "unknown"}" is not accepted`;
    }
  }
  if (rules.maxSize && file.size > rules.maxSize) {
    const maxMb = (rules.maxSize / (1024 * 1024)).toFixed(1);
    const fileMb = (file.size / (1024 * 1024)).toFixed(1);
    return `File size ${fileMb}MB exceeds limit of ${maxMb}MB`;
  }
  if (rules.custom) {
    return rules.custom(file);
  }
  return null;
}
function createUploadableFile(file, rules) {
  const error = validateFile(file, rules);
  return {
    croppedBlob: null,
    croppedPreviewUrl: null,
    error: error ?? void 0,
    file,
    id: generateFileId(),
    previewUrl: URL.createObjectURL(file),
    progress: 0,
    status: error ? "error" : "ready"
  };
}
function createMockUploadFn(delay) {
  return async (_file, onProgress) => {
    const safeDelay = Math.max(delay, 100);
    const tickInterval = safeDelay / 5;
    for (let tick = 1; tick <= 5; tick += 1) {
      await wait(tickInterval);
      onProgress({ progress: tick * 20 });
    }
  };
}
function useFileUpload(options = {}) {
  const {
    rules,
    multiple = false,
    replaceOnSingle = true,
    uploadFn,
    mockUploadDelay = 800
  } = options;
  const [files, setFiles] = react.useState([]);
  const [status, setStatus] = react.useState("idle");
  const inputRef = react.useRef(null);
  const resolvedUploadFn = react.useMemo(() => uploadFn ?? createMockUploadFn(mockUploadDelay), [mockUploadDelay, uploadFn]);
  const revokeFileUrls = react.useCallback((targets) => {
    targets.forEach((target) => {
      URL.revokeObjectURL(target.previewUrl);
      if (target.croppedPreviewUrl) {
        URL.revokeObjectURL(target.croppedPreviewUrl);
      }
    });
  }, []);
  react.useEffect(() => {
    return () => {
      revokeFileUrls(files);
    };
  }, [files, revokeFileUrls]);
  const addFiles = react.useCallback(
    (fileList) => {
      const incoming = Array.from(fileList);
      if (incoming.length === 0) {
        return;
      }
      setFiles((prev) => {
        if (!multiple && replaceOnSingle) {
          revokeFileUrls(prev);
          const first = incoming[0];
          return first ? [createUploadableFile(first, rules)] : [];
        }
        const maxFiles = rules?.maxFiles ?? Number.POSITIVE_INFINITY;
        const remaining = maxFiles - prev.length;
        if (remaining <= 0) {
          return prev;
        }
        const toAdd = incoming.slice(0, remaining).map((file) => createUploadableFile(file, rules));
        return [...prev, ...toAdd];
      });
      setStatus("ready");
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
    [multiple, replaceOnSingle, revokeFileUrls, rules]
  );
  const removeFile = react.useCallback(
    (id) => {
      setFiles((prev) => {
        const target = prev.find((file) => file.id === id);
        if (target) {
          revokeFileUrls([target]);
        }
        const next = prev.filter((file) => file.id !== id);
        if (next.length === 0) {
          setStatus("idle");
        }
        return next;
      });
    },
    [revokeFileUrls]
  );
  const clearAll = react.useCallback(() => {
    setFiles((prev) => {
      revokeFileUrls(prev);
      return [];
    });
    setStatus("idle");
  }, [revokeFileUrls]);
  const setCroppedResult = react.useCallback((id, blob) => {
    setFiles(
      (prev) => prev.map((file) => {
        if (file.id !== id) {
          return file;
        }
        if (file.croppedPreviewUrl) {
          URL.revokeObjectURL(file.croppedPreviewUrl);
        }
        return {
          ...file,
          croppedBlob: blob,
          croppedPreviewUrl: URL.createObjectURL(blob)
        };
      })
    );
  }, []);
  const uploadOne = react.useCallback(
    async (id) => {
      const target = files.find((file) => file.id === id);
      if (!target || target.status !== "ready") {
        return;
      }
      setStatus("uploading");
      setFiles(
        (prev) => prev.map(
          (file) => file.id === id ? { ...file, error: void 0, progress: 0, status: "uploading" } : file
        )
      );
      try {
        await resolvedUploadFn(target, ({ progress }) => {
          setFiles(
            (prev) => prev.map((file) => file.id === id ? { ...file, progress: Math.min(progress, 100) } : file)
          );
        });
        setFiles(
          (prev) => prev.map((file) => file.id === id ? { ...file, progress: 100, status: "done" } : file)
        );
        setStatus("done");
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Upload failed";
        setFiles(
          (prev) => prev.map((file) => file.id === id ? { ...file, error: errorMessage, status: "error" } : file)
        );
        setStatus("error");
        throw error;
      }
    },
    [files, resolvedUploadFn]
  );
  const uploadAll = react.useCallback(async () => {
    const readyFiles = files.filter((file) => file.status === "ready");
    if (readyFiles.length === 0) {
      return;
    }
    setStatus("uploading");
    const results = await Promise.allSettled(
      readyFiles.map(async (target) => {
        setFiles(
          (prev) => prev.map(
            (file) => file.id === target.id ? { ...file, error: void 0, progress: 0, status: "uploading" } : file
          )
        );
        try {
          await resolvedUploadFn(target, ({ progress }) => {
            setFiles(
              (prev) => prev.map(
                (file) => file.id === target.id ? { ...file, progress: Math.min(progress, 100) } : file
              )
            );
          });
          setFiles(
            (prev) => prev.map((file) => file.id === target.id ? { ...file, progress: 100, status: "done" } : file)
          );
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Upload failed";
          setFiles(
            (prev) => prev.map(
              (file) => file.id === target.id ? { ...file, error: errorMessage, status: "error" } : file
            )
          );
          throw error;
        }
      })
    );
    const hasFailure = results.some((result) => result.status === "rejected");
    setStatus(hasFailure ? "error" : "done");
  }, [files, resolvedUploadFn]);
  const openFilePicker = react.useCallback(() => {
    inputRef.current?.click();
  }, []);
  const handleInputChange = react.useCallback(
    (event) => {
      if (event.target.files) {
        addFiles(event.target.files);
      }
    },
    [addFiles]
  );
  const accept = rules?.acceptedTypes?.join(",");
  const inputProps = react.useMemo(
    () => ({
      accept,
      multiple,
      onChange: handleInputChange,
      style: { display: "none" },
      tabIndex: -1,
      type: "file"
    }),
    [accept, handleInputChange, multiple]
  );
  return {
    addFiles,
    clearAll,
    files,
    inputProps,
    inputRef,
    openFilePicker,
    removeFile,
    setCroppedResult,
    status,
    uploadAll,
    uploadOne
  };
}
function AvatarUpload({
  currentSrc,
  name,
  size = "xl",
  avatarVariant = "circular",
  onAvatarChange,
  onUploadError,
  onUploadSuccess,
  buttonLabel = "Change picture",
  cropOnSelect = true,
  uploadFn
}) {
  const upload = useFileUpload({
    rules: AVATAR_RULES,
    multiple: false,
    replaceOnSingle: true,
    uploadFn
  });
  const cropState = useImageCrop();
  const previousFileIdRef = react.useRef(null);
  const [pendingUploadId, setPendingUploadId] = react.useState(null);
  react.useEffect(() => {
    const currentFile = upload.files[0];
    const currentFileId = currentFile?.id ?? null;
    if (!currentFile || currentFileId === previousFileIdRef.current) {
      previousFileIdRef.current = currentFileId;
      return;
    }
    previousFileIdRef.current = currentFileId;
    if (currentFile.status === "error") {
      return;
    }
    if (cropOnSelect && currentFile.file.type.startsWith("image/")) {
      cropState.openCrop(currentFile.id, currentFile.previewUrl);
      return;
    }
    onAvatarChange?.(currentFile.file, currentFile.previewUrl);
    setPendingUploadId(currentFile.id);
  }, [cropOnSelect, cropState.openCrop, onAvatarChange, upload.files]);
  const handleCropConfirm = react.useCallback(
    (fileId, blob) => {
      upload.setCroppedResult(fileId, blob);
      const previewUrl = URL.createObjectURL(blob);
      onAvatarChange?.(blob, previewUrl);
      setPendingUploadId(fileId);
    },
    [onAvatarChange, upload]
  );
  react.useEffect(() => {
    if (!pendingUploadId) {
      return;
    }
    const pendingFile = upload.files.find((file) => file.id === pendingUploadId);
    if (!pendingFile || pendingFile.status !== "ready") {
      return;
    }
    if (cropOnSelect && !pendingFile.croppedBlob) {
      return;
    }
    void upload.uploadOne(pendingUploadId).then(() => {
      onUploadSuccess?.();
    }).catch((error) => {
      const message = error instanceof Error ? error.message : "Upload failed";
      onUploadError?.(message);
    }).finally(() => {
      setPendingUploadId(null);
    });
  }, [cropOnSelect, onUploadError, onUploadSuccess, pendingUploadId, upload.files, upload.uploadOne]);
  const activeFile = upload.files[0];
  const displaySrc = activeFile?.croppedPreviewUrl ?? activeFile?.previewUrl ?? currentSrc ?? void 0;
  return /* @__PURE__ */ jsxRuntime.jsxs(material.Stack, { alignItems: "center", spacing: 1.5, children: [
    /* @__PURE__ */ jsxRuntime.jsx(uiAvatar.Avatar, { name, size, src: displaySrc, variant: avatarVariant }),
    /* @__PURE__ */ jsxRuntime.jsx(material.Button, { onClick: upload.openFilePicker, size: "small", startIcon: /* @__PURE__ */ jsxRuntime.jsx(SettingsRoundedIcon__default.default, {}), variant: "contained", children: buttonLabel }),
    /* @__PURE__ */ jsxRuntime.jsx("input", { ref: upload.inputRef, ...upload.inputProps }),
    cropOnSelect ? /* @__PURE__ */ jsxRuntime.jsx(ImageCropDialog, { cropState, onConfirm: handleCropConfirm }) : null
  ] });
}

exports.AVATAR_RULES = AVATAR_RULES;
exports.AvatarUpload = AvatarUpload;
exports.DOCUMENT_RULES = DOCUMENT_RULES;
exports.FileUpload = FileUpload;
exports.IMAGE_ONLY_RULES = IMAGE_ONLY_RULES;
exports.ImageCropDialog = ImageCropDialog;
exports.MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_BYTES;
exports.MAX_VIDEO_SIZE_BYTES = MAX_VIDEO_SIZE_BYTES;
exports.MEDIA_RULES = MEDIA_RULES;
exports.VIDEO_RULES = VIDEO_RULES;
exports.formatFileSize = formatFileSize;
exports.getCroppedImageBlob = getCroppedImageBlob;
exports.useFileUpload = useFileUpload;
exports.useImageCrop = useImageCrop;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map