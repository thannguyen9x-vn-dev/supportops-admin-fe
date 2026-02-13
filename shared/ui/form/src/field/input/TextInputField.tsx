'use client'

import type {ReactElement, Ref} from 'react'
import {forwardRef, useMemo} from 'react'
import type {FieldPath, FieldValues} from 'react-hook-form'
import {useController} from 'react-hook-form'

import Box from '@mui/material/Box'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import {alpha, styled} from '@mui/material/styles'
import TextField from '@mui/material/TextField'

// Icons
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

import type {TextInputFieldProps, TextInputFieldStatus} from './TextInputField.types'

// Styled TextField with custom states
const StyledTextField = styled(TextField, {
  shouldForwardProp: prop => prop !== 'fieldStatus',
})<{fieldStatus?: TextInputFieldStatus}>(({theme, fieldStatus}) => {
  const baseRadius =
    typeof theme.shape.borderRadius === 'number'
      ? theme.shape.borderRadius
      : Number.parseFloat(theme.shape.borderRadius) || 0

  return {
  '& .MuiOutlinedInput-root': {
    borderRadius: baseRadius * 2,
    backgroundColor: theme.palette.background.paper,
    transition: theme.transitions.create(['border-color', 'background-color', 'box-shadow']),

    '& fieldset': {
      borderColor: theme.palette.divider,
      transition: theme.transitions.create(['border-color']),
    },

    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },

    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      borderWidth: 2,
    },

    '&.Mui-disabled': {
      backgroundColor: alpha(theme.palette.action.disabled, 0.05),
      '& fieldset': {
        borderColor: theme.palette.divider,
      },
    },

    '& .MuiOutlinedInput-input': {
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
      '&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus, &:-internal-autofill-selected':
        {
          WebkitTextFillColor: `${theme.palette.text.primary} !important`,
          WebkitBoxShadow: `0 0 0 1000px ${theme.palette.background.paper} inset !important`,
          boxShadow: `0 0 0 1000px ${theme.palette.background.paper} inset !important`,
          backgroundColor: `${theme.palette.background.paper} !important`,
          caretColor: theme.palette.text.primary,
          borderRadius: baseRadius * 2,
          transition: 'background-color 99999s ease-in-out 0s',
        },
      '&:-moz-autofill': {
        boxShadow: `0 0 0 1000px ${theme.palette.background.paper} inset !important`,
        backgroundColor: `${theme.palette.background.paper} !important`,
        caretColor: theme.palette.text.primary,
      },
    },

    // Success state
    ...(fieldStatus === 'success' && {
      '& fieldset': {
        borderColor: theme.palette.success.main,
      },
      '&:hover fieldset': {
        borderColor: theme.palette.success.dark,
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.success.main,
        borderWidth: 2,
      },
    }),

    // Error state
    ...(fieldStatus === 'error' && {
      '& fieldset': {
        borderColor: theme.palette.error.main,
      },
      '&:hover fieldset': {
        borderColor: theme.palette.error.dark,
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.error.main,
        borderWidth: 2,
      },
    }),
  },

  '& .MuiInputLabel-root': {
    ...(fieldStatus === 'success' && {
      color: theme.palette.success.main,
      '&.Mui-focused': {
        color: theme.palette.success.main,
      },
    }),
    ...(fieldStatus === 'error' && {
      color: theme.palette.error.main,
      '&.Mui-focused': {
        color: theme.palette.error.main,
      },
    }),
  },

  '& .MuiInputAdornment-root': {
    color: theme.palette.text.secondary,
    ...(fieldStatus === 'success' && {
      color: theme.palette.success.main,
    }),
    ...(fieldStatus === 'error' && {
      color: theme.palette.error.main,
    }),
  },
}})

// Helper text with status styling
const StyledHelperText = styled(FormHelperText, {
  shouldForwardProp: prop => prop !== 'fieldStatus',
})<{fieldStatus?: TextInputFieldStatus}>(({theme, fieldStatus}) => ({
  marginLeft: 0,
  marginTop: theme.spacing(0.5),

  ...(fieldStatus === 'success' && {
    color: theme.palette.success.main,
    '& .helper-text-title': {
      fontWeight: 600,
      color: theme.palette.success.dark,
    },
  }),

  ...(fieldStatus === 'error' && {
    color: theme.palette.error.main,
    '& .helper-text-title': {
      fontWeight: 600,
      color: theme.palette.error.dark,
    },
  }),
}))

function TextInputFieldInner<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: TextInputFieldProps<TFieldValues, TName>, ref: Ref<HTMLInputElement>): ReactElement {
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
    successIcon = <CheckCircleOutlineIcon fontSize="small" />,
    errorIcon = <ErrorOutlineIcon fontSize="small" />,
    hideEmptyHelperText = false,
    disabled,
    ...textFieldProps
  } = props

  const {
    field,
    fieldState: {error, isDirty, isTouched},
  } = useController({
    name,
    control,
    rules,
  })

  // Determine field status
  const fieldStatus = useMemo<TextInputFieldStatus>(() => {
    if (externalStatus) return externalStatus
    if (error) return 'error'
    if (showSuccessState && isTouched && isDirty && !error) return 'success'
    return 'default'
  }, [externalStatus, error, showSuccessState, isTouched, isDirty])

  // Build helper text content
  const helperTextContent = useMemo(() => {
    if (fieldStatus === 'error' && error?.message) {
      return (
        <Box component="span" sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
          <span className="helper-text-title">Oh snap!</span>
          <span>{error.message}</span>
        </Box>
      )
    }

    if (fieldStatus === 'success' && successMessage) {
      return (
        <Box component="span" sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
          <span className="helper-text-title">Well done!</span>
          <span>{successMessage}</span>
        </Box>
      )
    }

    return helperText
  }, [fieldStatus, error, successMessage, helperText])

  // Build start adornment
  const startAdornment = useMemo(() => {
    if (!startIcon && fieldStatus === 'default') return undefined

    const icon =
      fieldStatus === 'success' ? successIcon : fieldStatus === 'error' ? errorIcon : startIcon

    if (!icon) return undefined

    return <InputAdornment position="start">{icon}</InputAdornment>
  }, [startIcon, fieldStatus, successIcon, errorIcon])

  // Build end adornment
  const endAdornment = useMemo(() => {
    // Show status icon at end if no startIcon but has status
    if (!startIcon && fieldStatus !== 'default') {
      const statusIcon = fieldStatus === 'success' ? successIcon : errorIcon
      return <InputAdornment position="end">{statusIcon}</InputAdornment>
    }

    if (!endIcon) return undefined
    return <InputAdornment position="end">{endIcon}</InputAdornment>
  }, [endIcon, startIcon, fieldStatus, successIcon, errorIcon])

  // Show helper text area
  const showHelperText = !hideEmptyHelperText || helperTextContent

  return (
    <Box sx={{width: '100%'}}>
      <StyledTextField
        {...textFieldProps}
        {...field}
        inputRef={ref}
        fieldStatus={fieldStatus}
        label={label}
        placeholder={placeholder}
        disabled={disabled}
        error={fieldStatus === 'error'}
        fullWidth
        slotProps={{
          input: {
            startAdornment,
            endAdornment,
            ...textFieldProps.slotProps?.input,
          },
          inputLabel: {
            shrink: true,
            ...textFieldProps.slotProps?.inputLabel,
          },
          ...textFieldProps.slotProps,
        }}
      />

      {showHelperText && (
        <StyledHelperText fieldStatus={fieldStatus}>{helperTextContent}</StyledHelperText>
      )}
    </Box>
  )
}

// Forward ref with generic support
export const TextInputField = forwardRef(TextInputFieldInner) as <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: TextInputFieldProps<TFieldValues, TName> & {
    ref?: Ref<HTMLInputElement>
  }
) => ReactElement

export default TextInputField
