import { useState, useMemo, useCallback } from 'react';
import { useController } from 'react-hook-form';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Divider from '@mui/material/Divider';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

// src/field/input/SelectOptionField.tsx
function getBorderRadiusPx(value) {
  if (typeof value === "number") return value;
  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed)) return 8;
  return parsed;
}
var textSmStyle = {
  fontSize: 14,
  fontWeight: 600,
  lineHeight: "20px"
};
var POPUP_OFFSET = [0, 8];
var StyledTextField = styled(TextField)(({ theme }) => {
  const controlHeight = 40;
  const baseRadius = getBorderRadiusPx(theme.shape.borderRadius);
  const borderRadius = baseRadius * 3;
  const borderColor = theme.palette.grey[300];
  return {
    "& .MuiOutlinedInput-root": {
      minHeight: controlHeight,
      borderRadius,
      backgroundColor: theme.palette.grey[50],
      color: theme.palette.grey[700],
      transition: theme.transitions.create(["border-color", "background-color", "box-shadow"]),
      "& fieldset": {
        borderColor,
        borderWidth: 1,
        inset: 0
      },
      "&:hover fieldset": {
        borderColor
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.primary.main,
        borderWidth: 1
      },
      "&.Mui-focused": {
        boxShadow: "none"
      },
      '&.Mui-focused:not(.Mui-readOnly) input[aria-invalid="false"] ~ fieldset': {
        boxShadow: "none"
      },
      "& .MuiOutlinedInput-input": {
        ...textSmStyle,
        boxSizing: "border-box",
        height: controlHeight,
        padding: "10px 16px",
        color: theme.palette.grey[700],
        outline: "none",
        WebkitTextFillColor: theme.palette.grey[700],
        caretColor: theme.palette.grey[700],
        "&::placeholder": {
          color: theme.palette.grey[500],
          opacity: 1
        },
        "&:focus": {
          outline: "none"
        },
        "&:focus-visible": {
          outline: "none"
        }
      },
      "&.Mui-disabled": {
        backgroundColor: theme.palette.grey[50],
        color: theme.palette.grey[400],
        "& fieldset": {
          borderColor: theme.palette.grey[200]
        }
      },
      "& .MuiOutlinedInput-notchedOutline legend": {
        display: "none"
      },
      "& .MuiOutlinedInput-notchedOutline": {
        top: 0
      }
    }
  };
});
var StyledFieldLabel = styled(FormLabel)(({ theme }) => ({
  ...textSmStyle,
  display: "block",
  color: theme.palette.grey[800],
  marginBottom: 6
}));
var StyledHelperText = styled(FormHelperText)(({ theme }) => ({
  marginLeft: 0,
  marginTop: 8,
  ...textSmStyle,
  color: theme.palette.error.main,
  "& .helper-text-title": {
    fontWeight: 700,
    marginRight: 6
  }
}));
var popupPaperBorderStyles = {
  border: "1px solid var(--mui-palette-grey-300)",
  borderRadius: 3,
  boxShadow: "0px 2px 8px -2px rgba(21, 21, 21, 0.08), 0px 6px 12px -2px rgba(144, 139, 164, 0.08)",
  overflow: "hidden"
};
function SelectOptionFieldInner(props) {
  const {
    name,
    control,
    rules,
    label,
    helperText,
    hideEmptyHelperText = false,
    options,
    searchable = false,
    searchInPopup = false,
    searchPlaceholder,
    noOptionsText,
    disableClearable = true,
    autocompleteProps,
    id,
    disabled,
    placeholder,
    ...textFieldProps
  } = props;
  const {
    field,
    fieldState: { error }
  } = useController({
    name,
    control,
    rules
  });
  const helperTextContent = error?.message ?? helperText;
  const showHelper = !hideEmptyHelperText || helperTextContent;
  const inputId = id ?? String(name);
  const [open, setOpen] = useState(false);
  const [popupSearchValue, setPopupSearchValue] = useState("");
  const selectedOption = useMemo(() => {
    return options.find((option) => option.value === field.value) ?? null;
  }, [field.value, options]);
  const popupSearchText = popupSearchValue.trim().toLocaleLowerCase();
  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);
  const handleClose = useCallback(
    (event, reason) => {
      if (searchInPopup && reason === "blur") return;
      setOpen(false);
      setPopupSearchValue("");
      autocompleteProps?.onClose?.(
        event,
        reason
      );
    },
    [autocompleteProps, searchInPopup]
  );
  const handleClickAway = useCallback(() => {
    if (!searchInPopup) return;
    setOpen(false);
    setPopupSearchValue("");
  }, [searchInPopup]);
  const handleSelect = useCallback(
    (_, nextOption) => {
      if (!nextOption && disableClearable) return;
      field.onChange(nextOption?.value ?? "");
      if (searchInPopup) {
        setOpen(false);
        setPopupSearchValue("");
      }
    },
    [disableClearable, field, searchInPopup]
  );
  const mergedPopperSlotProps = useMemo(() => {
    const popperSlotProp = autocompleteProps?.slotProps?.popper;
    if (typeof popperSlotProp === "function") return popperSlotProp;
    const existingModifiers = Array.isArray(popperSlotProp?.modifiers) ? popperSlotProp.modifiers : [];
    return {
      ...popperSlotProp,
      modifiers: [
        ...existingModifiers,
        {
          name: "offset",
          enabled: true,
          options: {
            offset: POPUP_OFFSET
          }
        }
      ]
    };
  }, [autocompleteProps?.slotProps?.popper]);
  const PopupPaper = useCallback(
    (paperProps) => {
      const { children, ...rest } = paperProps;
      return /* @__PURE__ */ jsxs(
        Paper,
        {
          ...rest,
          sx: {
            ...popupPaperBorderStyles,
            paddingTop: searchInPopup ? 1 : 0
          },
          children: [
            searchInPopup ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Box, { sx: { paddingX: 1, paddingBottom: 1 }, children: /* @__PURE__ */ jsx(
                TextField,
                {
                  autoFocus: true,
                  fullWidth: true,
                  onChange: (event) => {
                    setPopupSearchValue(event.target.value);
                  },
                  onKeyDown: (event) => {
                    event.stopPropagation();
                  },
                  onMouseDown: (event) => {
                    event.stopPropagation();
                  },
                  placeholder: searchPlaceholder,
                  size: "small",
                  value: popupSearchValue
                }
              ) }),
              /* @__PURE__ */ jsx(Divider, {})
            ] }) : null,
            children
          ]
        }
      );
    },
    [popupSearchValue, searchInPopup, searchPlaceholder]
  );
  const autocompleteSx = {
    "& .MuiAutocomplete-inputRoot": {
      padding: "0 !important"
    },
    "& .MuiAutocomplete-input": {
      ...textSmStyle,
      boxSizing: "border-box",
      height: "40px !important",
      minWidth: 0,
      padding: "10px 16px !important"
    },
    "& .MuiAutocomplete-endAdornment": {
      right: 8
    },
    "& .MuiAutocomplete-popupIndicator": {
      width: 24,
      height: 24,
      minWidth: 24,
      border: 0,
      borderRadius: 6,
      backgroundColor: "transparent !important",
      boxShadow: "none",
      color: "var(--mui-palette-grey-500)",
      "&:hover": {
        backgroundColor: "transparent",
        color: "var(--mui-palette-grey-600)"
      },
      "& .MuiSvgIcon-root": {
        fontSize: 28
      }
    },
    "& .MuiAutocomplete-popupIndicator.Mui-focused": {
      backgroundColor: "transparent"
    },
    "& .MuiAutocomplete-listbox": {
      maxHeight: 320
    }
  };
  function PopupSearchAutocomplete() {
    return /* @__PURE__ */ jsx(ClickAwayListener, { onClickAway: handleClickAway, children: /* @__PURE__ */ jsx(Box, { sx: { width: "100%" }, children: /* @__PURE__ */ jsx(
      Autocomplete,
      {
        ...autocompleteProps,
        clearOnBlur: false,
        disableClearable,
        disabled,
        forcePopupIcon: true,
        fullWidth: true,
        getOptionDisabled: (option) => Boolean(option.disabled),
        getOptionKey: (option) => String(option.value),
        getOptionLabel: (option) => option.label,
        id: inputId,
        isOptionEqualToValue: (option, value) => option.value === value.value,
        noOptionsText,
        onBlur: field.onBlur,
        onChange: handleSelect,
        onClose: handleClose,
        onOpen: (event) => {
          handleOpen();
          autocompleteProps?.onOpen?.(event);
        },
        open,
        options,
        popupIcon: /* @__PURE__ */ jsx(KeyboardArrowDownRoundedIcon, {}),
        renderInput: (params) => /* @__PURE__ */ jsx(
          StyledTextField,
          {
            ...params,
            ...textFieldProps,
            error: Boolean(error),
            inputProps: {
              ...params.inputProps,
              readOnly: true
            },
            onClick: () => {
              setOpen((prev) => !prev);
            },
            placeholder,
            variant: "outlined"
          }
        ),
        filterOptions: (items) => {
          if (!popupSearchText) return items;
          return items.filter(
            (option) => option.label.toLocaleLowerCase().includes(popupSearchText)
          );
        },
        selectOnFocus: false,
        slotProps: {
          ...autocompleteProps?.slotProps,
          popupIndicator: {
            ...autocompleteProps?.slotProps?.popupIndicator ?? {},
            disableRipple: true
          },
          popper: mergedPopperSlotProps
        },
        slots: {
          ...autocompleteProps?.slots,
          paper: PopupPaper
        },
        sx: {
          ...autocompleteSx,
          "& .MuiAutocomplete-input": {
            ...autocompleteSx["& .MuiAutocomplete-input"],
            cursor: "pointer"
          }
        },
        value: selectedOption
      }
    ) }) });
  }
  function InlineSearchAutocomplete() {
    return /* @__PURE__ */ jsx(
      Autocomplete,
      {
        ...autocompleteProps,
        clearOnBlur: false,
        disableClearable,
        disabled,
        forcePopupIcon: true,
        fullWidth: true,
        getOptionDisabled: (option) => Boolean(option.disabled),
        getOptionKey: (option) => String(option.value),
        getOptionLabel: (option) => option.label,
        id: inputId,
        isOptionEqualToValue: (option, value) => option.value === value.value,
        noOptionsText,
        onBlur: field.onBlur,
        onChange: handleSelect,
        options,
        popupIcon: /* @__PURE__ */ jsx(KeyboardArrowDownRoundedIcon, {}),
        renderInput: (params) => /* @__PURE__ */ jsx(
          StyledTextField,
          {
            ...params,
            ...textFieldProps,
            error: Boolean(error),
            placeholder: searchPlaceholder ?? placeholder,
            variant: "outlined"
          }
        ),
        selectOnFocus: false,
        slotProps: {
          ...autocompleteProps?.slotProps,
          popupIndicator: {
            ...autocompleteProps?.slotProps?.popupIndicator ?? {},
            disableRipple: true
          }
        },
        sx: autocompleteSx,
        value: selectedOption
      }
    );
  }
  function NativeSelectField() {
    return /* @__PURE__ */ jsx(
      StyledTextField,
      {
        ...textFieldProps,
        ...field,
        disabled,
        error: Boolean(error),
        fullWidth: true,
        id: inputId,
        select: true,
        value: field.value ?? "",
        variant: "outlined",
        children: options.map((option) => /* @__PURE__ */ jsx(MenuItem, { disabled: option.disabled, value: option.value, children: option.label }, String(option.value)))
      }
    );
  }
  return /* @__PURE__ */ jsxs(Box, { sx: { width: "100%" }, children: [
    label ? /* @__PURE__ */ jsx(StyledFieldLabel, { htmlFor: inputId, children: label }) : null,
    searchable ? searchInPopup ? /* @__PURE__ */ jsx(PopupSearchAutocomplete, {}) : /* @__PURE__ */ jsx(InlineSearchAutocomplete, {}) : /* @__PURE__ */ jsx(NativeSelectField, {}),
    showHelper ? /* @__PURE__ */ jsx(StyledHelperText, { error: Boolean(error), children: error?.message ? /* @__PURE__ */ jsxs(Box, { component: "span", children: [
      /* @__PURE__ */ jsx("span", { className: "helper-text-title", children: "Oh snap!" }),
      /* @__PURE__ */ jsx("span", { children: error.message })
    ] }) : helperTextContent }) : null
  ] });
}
var SelectOptionField = SelectOptionFieldInner;
function getBorderRadiusPx2(value) {
  if (typeof value === "number") return value;
  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed)) return 8;
  return parsed;
}
var textSmStyle2 = {
  fontSize: 14,
  fontWeight: 600,
  lineHeight: "20px"
};
var StyledTextField2 = styled(TextField, {
  shouldForwardProp: (prop) => prop !== "fieldStatus"
})(({ theme, fieldStatus = "default" }) => {
  const controlHeight = 40;
  const baseRadius = getBorderRadiusPx2(theme.shape.borderRadius);
  const borderRadius = baseRadius * 3;
  const baseBorderColor = theme.palette.grey[300];
  const focusBorderColor = theme.palette.primary.main;
  const statusBorderColor = fieldStatus === "success" ? theme.palette.success.main : fieldStatus === "error" ? theme.palette.error.main : baseBorderColor;
  return {
    "& .MuiOutlinedInput-root": {
      height: controlHeight,
      minHeight: controlHeight,
      borderRadius,
      backgroundColor: theme.palette.grey[50],
      color: theme.palette.grey[700],
      transition: theme.transitions.create(["border-color", "background-color", "box-shadow"]),
      "& fieldset": {
        borderColor: statusBorderColor,
        borderWidth: 1,
        inset: 0
      },
      "&:hover fieldset": {
        borderColor: fieldStatus === "default" ? baseBorderColor : statusBorderColor
      },
      "&.Mui-focused fieldset": {
        borderColor: fieldStatus === "default" ? focusBorderColor : statusBorderColor,
        borderWidth: 1
      },
      "&.Mui-focused": {
        boxShadow: "none"
      },
      '&.Mui-focused:not(.Mui-readOnly) input[aria-invalid="false"] ~ fieldset': {
        boxShadow: "none"
      },
      '&.Mui-focused:not(.Mui-readOnly) textarea[aria-invalid="false"] ~ fieldset': {
        boxShadow: "none"
      },
      "&.Mui-disabled": {
        backgroundColor: theme.palette.grey[50],
        color: theme.palette.grey[400],
        "& fieldset": {
          borderColor: theme.palette.grey[200]
        },
        "& .MuiOutlinedInput-input::placeholder": {
          color: theme.palette.grey[400]
        }
      },
      "& .MuiOutlinedInput-input": {
        ...textSmStyle2,
        boxSizing: "border-box",
        height: controlHeight,
        padding: "10px 16px",
        color: theme.palette.grey[700],
        outline: "none",
        WebkitTextFillColor: theme.palette.grey[700],
        caretColor: theme.palette.grey[700],
        "&::placeholder": {
          color: theme.palette.grey[400],
          fontWeight: 400,
          opacity: 1
        },
        "&:focus": {
          outline: "none"
        },
        "&:focus-visible": {
          outline: "none"
        },
        "&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus": {
          WebkitTextFillColor: `${theme.palette.grey[700]} !important`,
          caretColor: theme.palette.grey[700],
          WebkitBoxShadow: `0 0 0 1000px ${theme.palette.grey[50]} inset`,
          boxShadow: `0 0 0 1000px ${theme.palette.grey[50]} inset`,
          borderRadius,
          transition: "background-color 99999s ease-out 0s"
        }
      },
      "& .MuiOutlinedInput-input.MuiInputBase-inputAdornedStart": {
        paddingLeft: 0
      },
      "& .MuiInputAdornment-root": {
        marginLeft: 12,
        marginRight: 8,
        color: fieldStatus === "default" ? theme.palette.grey[500] : statusBorderColor
      },
      "& .MuiSvgIcon-root": {
        fontSize: 22
      },
      "&.MuiInputBase-multiline": {
        minHeight: 180,
        alignItems: "flex-start",
        padding: 0
      },
      "& .MuiOutlinedInput-input.MuiInputBase-inputMultiline": {
        ...textSmStyle2,
        minHeight: 160,
        height: "auto",
        padding: "10px 16px",
        resize: "vertical"
      },
      "& .MuiOutlinedInput-notchedOutline legend": {
        display: "none"
      },
      "& .MuiOutlinedInput-notchedOutline": {
        top: 0
      }
    }
  };
});
var StyledFieldLabel2 = styled(FormLabel)(({ theme }) => ({
  ...textSmStyle2,
  display: "block",
  color: theme.palette.grey[800],
  marginBottom: 6
}));
var StyledHelperText2 = styled(FormHelperText, {
  shouldForwardProp: (prop) => prop !== "fieldStatus"
})(({ theme, fieldStatus = "default" }) => ({
  marginLeft: 0,
  marginTop: 8,
  ...textSmStyle2,
  color: fieldStatus === "success" ? theme.palette.success.main : fieldStatus === "error" ? theme.palette.error.main : theme.palette.grey[500],
  "& .helper-text-title": {
    fontWeight: 700,
    marginRight: 6
  }
}));
function TextInputFieldInner(props) {
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
    inputType = "text",
    showPasswordToggle = true,
    id,
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
      return /* @__PURE__ */ jsxs(Box, { component: "span", children: [
        /* @__PURE__ */ jsx("span", { className: "helper-text-title", children: "Oh snap!" }),
        /* @__PURE__ */ jsx("span", { children: error.message })
      ] });
    }
    if (fieldStatus === "success" && successMessage) {
      return /* @__PURE__ */ jsxs(Box, { component: "span", children: [
        /* @__PURE__ */ jsx("span", { className: "helper-text-title", children: "Well done!" }),
        /* @__PURE__ */ jsx("span", { children: successMessage })
      ] });
    }
    return helperText;
  }, [error, fieldStatus, helperText, successMessage]);
  const configuredType = textFieldProps.type ?? inputType;
  const isPasswordField = configuredType === "password";
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const startAdornment = useMemo(() => {
    if (!startIcon && fieldStatus === "default") return void 0;
    const icon = fieldStatus === "success" ? successIcon : fieldStatus === "error" ? errorIcon : startIcon;
    if (!icon) return void 0;
    return /* @__PURE__ */ jsx(InputAdornment, { position: "start", children: icon });
  }, [errorIcon, fieldStatus, startIcon, successIcon]);
  const endAdornment = useMemo(() => {
    if (!startIcon && fieldStatus !== "default") return void 0;
    const passwordToggle = isPasswordField && showPasswordToggle ? /* @__PURE__ */ jsx(
      IconButton,
      {
        "aria-label": isPasswordVisible ? "Hide password" : "Show password",
        edge: "end",
        onClick: () => setIsPasswordVisible((prev) => !prev),
        size: "small",
        sx: {
          color: "grey.500",
          bgcolor: "transparent",
          "&:hover": { bgcolor: "transparent" }
        },
        children: isPasswordVisible ? /* @__PURE__ */ jsx(VisibilityOutlinedIcon, { fontSize: "small" }) : /* @__PURE__ */ jsx(VisibilityOffOutlinedIcon, { fontSize: "small" })
      }
    ) : null;
    const resolvedEndIcon = endIcon ?? passwordToggle;
    if (!resolvedEndIcon) return void 0;
    return /* @__PURE__ */ jsx(InputAdornment, { position: "end", children: resolvedEndIcon });
  }, [endIcon, fieldStatus, isPasswordField, isPasswordVisible, showPasswordToggle, startIcon]);
  const showHelper = !hideEmptyHelperText || helperTextContent;
  const inputId = id ?? String(name);
  const renderedType = isPasswordField && showPasswordToggle && !endIcon ? isPasswordVisible ? "text" : "password" : configuredType;
  return /* @__PURE__ */ jsxs(Box, { sx: { width: "100%" }, children: [
    label ? /* @__PURE__ */ jsx(StyledFieldLabel2, { htmlFor: inputId, children: label }) : null,
    /* @__PURE__ */ jsx(
      StyledTextField2,
      {
        ...textFieldProps,
        ...field,
        disabled,
        error: fieldStatus === "error",
        fieldStatus,
        fullWidth: true,
        id: inputId,
        placeholder,
        slotProps: {
          input: {
            endAdornment,
            startAdornment,
            ...textFieldProps.slotProps?.input
          },
          ...textFieldProps.slotProps
        },
        type: renderedType,
        variant: "outlined"
      }
    ),
    showHelper ? /* @__PURE__ */ jsx(StyledHelperText2, { fieldStatus, children: helperTextContent }) : null
  ] });
}
var TextInputField = TextInputFieldInner;
function TextAreaField(props) {
  const { maxRows, minRows = 8, ...rest } = props;
  return /* @__PURE__ */ jsx(TextInputField, { ...rest, multiline: true, maxRows, minRows });
}

export { SelectOptionField, TextAreaField, TextInputField };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map