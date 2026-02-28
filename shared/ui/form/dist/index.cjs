'use strict';

var react = require('react');
var reactHookForm = require('react-hook-form');
var Autocomplete = require('@mui/material/Autocomplete');
var Box = require('@mui/material/Box');
var ClickAwayListener = require('@mui/material/ClickAwayListener');
var Divider = require('@mui/material/Divider');
var FormHelperText = require('@mui/material/FormHelperText');
var FormLabel = require('@mui/material/FormLabel');
var MenuItem = require('@mui/material/MenuItem');
var Paper = require('@mui/material/Paper');
var styles = require('@mui/material/styles');
var TextField = require('@mui/material/TextField');
var KeyboardArrowDownRoundedIcon = require('@mui/icons-material/KeyboardArrowDownRounded');
var jsxRuntime = require('react/jsx-runtime');
var InputAdornment = require('@mui/material/InputAdornment');
var CheckCircleOutlineIcon = require('@mui/icons-material/CheckCircleOutline');
var ErrorOutlineIcon = require('@mui/icons-material/ErrorOutline');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var Autocomplete__default = /*#__PURE__*/_interopDefault(Autocomplete);
var Box__default = /*#__PURE__*/_interopDefault(Box);
var ClickAwayListener__default = /*#__PURE__*/_interopDefault(ClickAwayListener);
var Divider__default = /*#__PURE__*/_interopDefault(Divider);
var FormHelperText__default = /*#__PURE__*/_interopDefault(FormHelperText);
var FormLabel__default = /*#__PURE__*/_interopDefault(FormLabel);
var MenuItem__default = /*#__PURE__*/_interopDefault(MenuItem);
var Paper__default = /*#__PURE__*/_interopDefault(Paper);
var TextField__default = /*#__PURE__*/_interopDefault(TextField);
var KeyboardArrowDownRoundedIcon__default = /*#__PURE__*/_interopDefault(KeyboardArrowDownRoundedIcon);
var InputAdornment__default = /*#__PURE__*/_interopDefault(InputAdornment);
var CheckCircleOutlineIcon__default = /*#__PURE__*/_interopDefault(CheckCircleOutlineIcon);
var ErrorOutlineIcon__default = /*#__PURE__*/_interopDefault(ErrorOutlineIcon);

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
var StyledTextField = styles.styled(TextField__default.default)(({ theme }) => {
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
var StyledFieldLabel = styles.styled(FormLabel__default.default)(({ theme }) => ({
  ...textSmStyle,
  display: "block",
  color: theme.palette.grey[800],
  marginBottom: 6
}));
var StyledHelperText = styles.styled(FormHelperText__default.default)(({ theme }) => ({
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
  } = reactHookForm.useController({
    name,
    control,
    rules
  });
  const helperTextContent = error?.message ?? helperText;
  const showHelper = !hideEmptyHelperText || helperTextContent;
  const inputId = id ?? String(name);
  const [open, setOpen] = react.useState(false);
  const [popupSearchValue, setPopupSearchValue] = react.useState("");
  const selectedOption = react.useMemo(() => {
    return options.find((option) => option.value === field.value) ?? null;
  }, [field.value, options]);
  const popupSearchText = popupSearchValue.trim().toLocaleLowerCase();
  const handleOpen = react.useCallback(() => {
    setOpen(true);
  }, []);
  const handleClose = react.useCallback(
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
  const handleClickAway = react.useCallback(() => {
    if (!searchInPopup) return;
    setOpen(false);
    setPopupSearchValue("");
  }, [searchInPopup]);
  const handleSelect = react.useCallback(
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
  const mergedPopperSlotProps = react.useMemo(() => {
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
  const PopupPaper = react.useCallback(
    (paperProps) => {
      const { children, ...rest } = paperProps;
      return /* @__PURE__ */ jsxRuntime.jsxs(
        Paper__default.default,
        {
          ...rest,
          sx: {
            ...popupPaperBorderStyles,
            paddingTop: searchInPopup ? 1 : 0
          },
          children: [
            searchInPopup ? /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
              /* @__PURE__ */ jsxRuntime.jsx(Box__default.default, { sx: { paddingX: 1, paddingBottom: 1 }, children: /* @__PURE__ */ jsxRuntime.jsx(
                TextField__default.default,
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
              /* @__PURE__ */ jsxRuntime.jsx(Divider__default.default, {})
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
    return /* @__PURE__ */ jsxRuntime.jsx(ClickAwayListener__default.default, { onClickAway: handleClickAway, children: /* @__PURE__ */ jsxRuntime.jsx(Box__default.default, { sx: { width: "100%" }, children: /* @__PURE__ */ jsxRuntime.jsx(
      Autocomplete__default.default,
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
        popupIcon: /* @__PURE__ */ jsxRuntime.jsx(KeyboardArrowDownRoundedIcon__default.default, {}),
        renderInput: (params) => /* @__PURE__ */ jsxRuntime.jsx(
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
    return /* @__PURE__ */ jsxRuntime.jsx(
      Autocomplete__default.default,
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
        popupIcon: /* @__PURE__ */ jsxRuntime.jsx(KeyboardArrowDownRoundedIcon__default.default, {}),
        renderInput: (params) => /* @__PURE__ */ jsxRuntime.jsx(
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
    return /* @__PURE__ */ jsxRuntime.jsx(
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
        children: options.map((option) => /* @__PURE__ */ jsxRuntime.jsx(MenuItem__default.default, { disabled: option.disabled, value: option.value, children: option.label }, String(option.value)))
      }
    );
  }
  return /* @__PURE__ */ jsxRuntime.jsxs(Box__default.default, { sx: { width: "100%" }, children: [
    label ? /* @__PURE__ */ jsxRuntime.jsx(StyledFieldLabel, { htmlFor: inputId, children: label }) : null,
    searchable ? searchInPopup ? /* @__PURE__ */ jsxRuntime.jsx(PopupSearchAutocomplete, {}) : /* @__PURE__ */ jsxRuntime.jsx(InlineSearchAutocomplete, {}) : /* @__PURE__ */ jsxRuntime.jsx(NativeSelectField, {}),
    showHelper ? /* @__PURE__ */ jsxRuntime.jsx(StyledHelperText, { error: Boolean(error), children: error?.message ? /* @__PURE__ */ jsxRuntime.jsxs(Box__default.default, { component: "span", children: [
      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "helper-text-title", children: "Oh snap!" }),
      /* @__PURE__ */ jsxRuntime.jsx("span", { children: error.message })
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
var StyledTextField2 = styles.styled(TextField__default.default, {
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
          color: theme.palette.grey[500],
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
var StyledFieldLabel2 = styles.styled(FormLabel__default.default)(({ theme }) => ({
  ...textSmStyle2,
  display: "block",
  color: theme.palette.grey[800],
  marginBottom: 6
}));
var StyledHelperText2 = styles.styled(FormHelperText__default.default, {
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
    successIcon = /* @__PURE__ */ jsxRuntime.jsx(CheckCircleOutlineIcon__default.default, { fontSize: "small" }),
    errorIcon = /* @__PURE__ */ jsxRuntime.jsx(ErrorOutlineIcon__default.default, { fontSize: "small" }),
    hideEmptyHelperText = false,
    inputType = "text",
    id,
    disabled,
    ...textFieldProps
  } = props;
  const {
    field,
    fieldState: { error, isDirty, isTouched }
  } = reactHookForm.useController({
    name,
    control,
    rules
  });
  const fieldStatus = react.useMemo(() => {
    if (externalStatus) return externalStatus;
    if (error) return "error";
    if (showSuccessState && isTouched && isDirty && !error) return "success";
    return "default";
  }, [externalStatus, error, showSuccessState, isTouched, isDirty]);
  const helperTextContent = react.useMemo(() => {
    if (fieldStatus === "error" && error?.message) {
      return /* @__PURE__ */ jsxRuntime.jsxs(Box__default.default, { component: "span", children: [
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "helper-text-title", children: "Oh snap!" }),
        /* @__PURE__ */ jsxRuntime.jsx("span", { children: error.message })
      ] });
    }
    if (fieldStatus === "success" && successMessage) {
      return /* @__PURE__ */ jsxRuntime.jsxs(Box__default.default, { component: "span", children: [
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "helper-text-title", children: "Well done!" }),
        /* @__PURE__ */ jsxRuntime.jsx("span", { children: successMessage })
      ] });
    }
    return helperText;
  }, [error, fieldStatus, helperText, successMessage]);
  const startAdornment = react.useMemo(() => {
    if (!startIcon && fieldStatus === "default") return void 0;
    const icon = fieldStatus === "success" ? successIcon : fieldStatus === "error" ? errorIcon : startIcon;
    if (!icon) return void 0;
    return /* @__PURE__ */ jsxRuntime.jsx(InputAdornment__default.default, { position: "start", children: icon });
  }, [errorIcon, fieldStatus, startIcon, successIcon]);
  const endAdornment = react.useMemo(() => {
    if (!startIcon && fieldStatus !== "default") return void 0;
    if (!endIcon) return void 0;
    return /* @__PURE__ */ jsxRuntime.jsx(InputAdornment__default.default, { position: "end", children: endIcon });
  }, [endIcon, fieldStatus, startIcon]);
  const showHelper = !hideEmptyHelperText || helperTextContent;
  const inputId = id ?? String(name);
  return /* @__PURE__ */ jsxRuntime.jsxs(Box__default.default, { sx: { width: "100%" }, children: [
    label ? /* @__PURE__ */ jsxRuntime.jsx(StyledFieldLabel2, { htmlFor: inputId, children: label }) : null,
    /* @__PURE__ */ jsxRuntime.jsx(
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
        type: textFieldProps.type ?? inputType,
        variant: "outlined"
      }
    ),
    showHelper ? /* @__PURE__ */ jsxRuntime.jsx(StyledHelperText2, { fieldStatus, children: helperTextContent }) : null
  ] });
}
var TextInputField = TextInputFieldInner;
function TextAreaField(props) {
  const { maxRows, minRows = 8, ...rest } = props;
  return /* @__PURE__ */ jsxRuntime.jsx(TextInputField, { ...rest, multiline: true, maxRows, minRows });
}

exports.SelectOptionField = SelectOptionField;
exports.TextAreaField = TextAreaField;
exports.TextInputField = TextInputField;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map