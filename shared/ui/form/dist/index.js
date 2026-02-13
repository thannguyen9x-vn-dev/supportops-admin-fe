import { forwardRef, useMemo } from 'react';
import { useController } from 'react-hook-form';
import Box from '@mui/material/Box';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';
import { styled, alpha } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { jsx, jsxs } from 'react/jsx-runtime';

// src/field/input/TextInputField.tsx
var StyledTextField = styled(TextField, {
  shouldForwardProp: (prop) => prop !== "fieldStatus"
})(({ theme, fieldStatus }) => {
  const baseRadius = typeof theme.shape.borderRadius === "number" ? theme.shape.borderRadius : Number.parseFloat(theme.shape.borderRadius) || 0;
  return {
    "& .MuiOutlinedInput-root": {
      borderRadius: baseRadius * 2,
      backgroundColor: theme.palette.background.paper,
      transition: theme.transitions.create(["border-color", "background-color", "box-shadow"]),
      "& fieldset": {
        borderColor: theme.palette.divider,
        transition: theme.transitions.create(["border-color"])
      },
      "&:hover fieldset": {
        borderColor: theme.palette.primary.main
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.primary.main,
        borderWidth: 2
      },
      "&.Mui-disabled": {
        backgroundColor: alpha(theme.palette.action.disabled, 0.05),
        "& fieldset": {
          borderColor: theme.palette.divider
        }
      },
      "& .MuiOutlinedInput-input": {
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        "&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus, &:-internal-autofill-selected": {
          WebkitTextFillColor: `${theme.palette.text.primary} !important`,
          WebkitBoxShadow: `0 0 0 1000px ${theme.palette.background.paper} inset !important`,
          boxShadow: `0 0 0 1000px ${theme.palette.background.paper} inset !important`,
          backgroundColor: `${theme.palette.background.paper} !important`,
          caretColor: theme.palette.text.primary,
          borderRadius: baseRadius * 2,
          transition: "background-color 99999s ease-in-out 0s"
        },
        "&:-moz-autofill": {
          boxShadow: `0 0 0 1000px ${theme.palette.background.paper} inset !important`,
          backgroundColor: `${theme.palette.background.paper} !important`,
          caretColor: theme.palette.text.primary
        }
      },
      // Success state
      ...fieldStatus === "success" && {
        "& fieldset": {
          borderColor: theme.palette.success.main
        },
        "&:hover fieldset": {
          borderColor: theme.palette.success.dark
        },
        "&.Mui-focused fieldset": {
          borderColor: theme.palette.success.main,
          borderWidth: 2
        }
      },
      // Error state
      ...fieldStatus === "error" && {
        "& fieldset": {
          borderColor: theme.palette.error.main
        },
        "&:hover fieldset": {
          borderColor: theme.palette.error.dark
        },
        "&.Mui-focused fieldset": {
          borderColor: theme.palette.error.main,
          borderWidth: 2
        }
      }
    },
    "& .MuiInputLabel-root": {
      ...fieldStatus === "success" && {
        color: theme.palette.success.main,
        "&.Mui-focused": {
          color: theme.palette.success.main
        }
      },
      ...fieldStatus === "error" && {
        color: theme.palette.error.main,
        "&.Mui-focused": {
          color: theme.palette.error.main
        }
      }
    },
    "& .MuiInputAdornment-root": {
      color: theme.palette.text.secondary,
      ...fieldStatus === "success" && {
        color: theme.palette.success.main
      },
      ...fieldStatus === "error" && {
        color: theme.palette.error.main
      }
    }
  };
});
var StyledHelperText = styled(FormHelperText, {
  shouldForwardProp: (prop) => prop !== "fieldStatus"
})(({ theme, fieldStatus }) => ({
  marginLeft: 0,
  marginTop: theme.spacing(0.5),
  ...fieldStatus === "success" && {
    color: theme.palette.success.main,
    "& .helper-text-title": {
      fontWeight: 600,
      color: theme.palette.success.dark
    }
  },
  ...fieldStatus === "error" && {
    color: theme.palette.error.main,
    "& .helper-text-title": {
      fontWeight: 600,
      color: theme.palette.error.dark
    }
  }
}));
function TextInputFieldInner(props, ref) {
  const {
    name,
    control,
    rules,
    label,
    placeholder,
    helperText,
    successMessage,
    startIcon,
    endIcon,
    status: externalStatus,
    showSuccessState = false,
    successIcon = /* @__PURE__ */ jsx(CheckCircleOutlineIcon, { fontSize: "small" }),
    errorIcon = /* @__PURE__ */ jsx(ErrorOutlineIcon, { fontSize: "small" }),
    hideEmptyHelperText = false,
    disabled,
    ...textFieldProps
  } = props;
  const {
    field,
    fieldState: { error, isDirty, isTouched }
  } = useController({
    name,
    control,
    rules
  });
  const fieldStatus = useMemo(() => {
    if (externalStatus) return externalStatus;
    if (error) return "error";
    if (showSuccessState && isTouched && isDirty && !error) return "success";
    return "default";
  }, [externalStatus, error, showSuccessState, isTouched, isDirty]);
  const helperTextContent = useMemo(() => {
    if (fieldStatus === "error" && error?.message) {
      return /* @__PURE__ */ jsxs(Box, { component: "span", sx: { display: "flex", alignItems: "center", gap: 0.5 }, children: [
        /* @__PURE__ */ jsx("span", { className: "helper-text-title", children: "Oh snap!" }),
        /* @__PURE__ */ jsx("span", { children: error.message })
      ] });
    }
    if (fieldStatus === "success" && successMessage) {
      return /* @__PURE__ */ jsxs(Box, { component: "span", sx: { display: "flex", alignItems: "center", gap: 0.5 }, children: [
        /* @__PURE__ */ jsx("span", { className: "helper-text-title", children: "Well done!" }),
        /* @__PURE__ */ jsx("span", { children: successMessage })
      ] });
    }
    return helperText;
  }, [fieldStatus, error, successMessage, helperText]);
  const startAdornment = useMemo(() => {
    if (!startIcon && fieldStatus === "default") return void 0;
    const icon = fieldStatus === "success" ? successIcon : fieldStatus === "error" ? errorIcon : startIcon;
    if (!icon) return void 0;
    return /* @__PURE__ */ jsx(InputAdornment, { position: "start", children: icon });
  }, [startIcon, fieldStatus, successIcon, errorIcon]);
  const endAdornment = useMemo(() => {
    if (!startIcon && fieldStatus !== "default") {
      const statusIcon = fieldStatus === "success" ? successIcon : errorIcon;
      return /* @__PURE__ */ jsx(InputAdornment, { position: "end", children: statusIcon });
    }
    if (!endIcon) return void 0;
    return /* @__PURE__ */ jsx(InputAdornment, { position: "end", children: endIcon });
  }, [endIcon, startIcon, fieldStatus, successIcon, errorIcon]);
  const showHelperText = !hideEmptyHelperText || helperTextContent;
  return /* @__PURE__ */ jsxs(Box, { sx: { width: "100%" }, children: [
    /* @__PURE__ */ jsx(
      StyledTextField,
      {
        ...textFieldProps,
        ...field,
        inputRef: ref,
        fieldStatus,
        label,
        placeholder,
        disabled,
        error: fieldStatus === "error",
        fullWidth: true,
        slotProps: {
          input: {
            startAdornment,
            endAdornment,
            ...textFieldProps.slotProps?.input
          },
          inputLabel: {
            shrink: true,
            ...textFieldProps.slotProps?.inputLabel
          },
          ...textFieldProps.slotProps
        }
      }
    ),
    showHelperText && /* @__PURE__ */ jsx(StyledHelperText, { fieldStatus, children: helperTextContent })
  ] });
}
var TextInputField = forwardRef(TextInputFieldInner);

export { TextInputField };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map