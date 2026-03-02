'use client'

import type {ReactElement} from 'react'
import {useMemo, useState} from 'react'
import type {FieldPath, FieldValues} from 'react-hook-form'
import {useController} from 'react-hook-form'

import Box from '@mui/material/Box'
import FormHelperText from '@mui/material/FormHelperText'
import FormLabel from '@mui/material/FormLabel'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import {styled} from '@mui/material/styles'
import TextField from '@mui/material/TextField'

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'

import type {TextInputFieldProps, TextInputFieldStatus} from './TextInputField.types'

function getBorderRadiusPx(value: string | number): number {
  if (typeof value === 'number') return value

  const parsed = Number.parseFloat(value)
  if (!Number.isFinite(parsed)) return 8
  return parsed
}

const textSmStyle = {
  fontSize: 14,
  fontWeight: 600,
  lineHeight: '20px',
}

const StyledTextField = styled(TextField, {
  shouldForwardProp: prop => prop !== 'fieldStatus',
})<{fieldStatus?: TextInputFieldStatus}>(({theme, fieldStatus = 'default'}) => {
  const controlHeight = 40
  const baseRadius = getBorderRadiusPx(theme.shape.borderRadius)
  const borderRadius = baseRadius * 3

  const baseBorderColor = theme.palette.grey[300]
  const focusBorderColor = theme.palette.primary.main

  const statusBorderColor =
    fieldStatus === 'success'
      ? theme.palette.success.main
      : fieldStatus === 'error'
        ? theme.palette.error.main
        : baseBorderColor

  return {
    '& .MuiOutlinedInput-root': {
      height: controlHeight,
      minHeight: controlHeight,
      borderRadius,
      backgroundColor: theme.palette.grey[50],
      color: theme.palette.grey[700],
      transition: theme.transitions.create(['border-color', 'background-color', 'box-shadow']),

      '& fieldset': {
        borderColor: statusBorderColor,
        borderWidth: 1,
        inset: 0,
      },

      '&:hover fieldset': {
        borderColor: fieldStatus === 'default' ? baseBorderColor : statusBorderColor,
      },

      '&.Mui-focused fieldset': {
        borderColor: fieldStatus === 'default' ? focusBorderColor : statusBorderColor,
        borderWidth: 1,
      },

      '&.Mui-focused': {
        boxShadow: 'none',
      },

      '&.Mui-focused:not(.Mui-readOnly) input[aria-invalid="false"] ~ fieldset': {
        boxShadow: 'none',
      },

      '&.Mui-focused:not(.Mui-readOnly) textarea[aria-invalid="false"] ~ fieldset': {
        boxShadow: 'none',
      },

      '&.Mui-disabled': {
        backgroundColor: theme.palette.grey[50],
        color: theme.palette.grey[400],

        '& fieldset': {
          borderColor: theme.palette.grey[200],
        },

        '& .MuiOutlinedInput-input::placeholder': {
          color: theme.palette.grey[400],
        },
      },

      '& .MuiOutlinedInput-input': {
        ...textSmStyle,
        boxSizing: 'border-box',
        height: controlHeight,
        padding: '10px 16px',
        color: theme.palette.grey[700],
        outline: 'none',
        WebkitTextFillColor: theme.palette.grey[700],
        caretColor: theme.palette.grey[700],

        '&::placeholder': {
          color: theme.palette.grey[400],
          fontWeight: 400,
          opacity: 1,
        },

        '&:focus': {
          outline: 'none',
        },

        '&:focus-visible': {
          outline: 'none',
        },

        '&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus': {
          WebkitTextFillColor: `${theme.palette.grey[700]} !important`,
          caretColor: theme.palette.grey[700],
          WebkitBoxShadow: `0 0 0 1000px ${theme.palette.grey[50]} inset`,
          boxShadow: `0 0 0 1000px ${theme.palette.grey[50]} inset`,
          borderRadius,
          transition: 'background-color 99999s ease-out 0s',
        },
      },

      '& .MuiOutlinedInput-input.MuiInputBase-inputAdornedStart': {
        paddingLeft: 0,
      },

      '& .MuiInputAdornment-root': {
        marginLeft: 12,
        marginRight: 8,
        color: fieldStatus === 'default' ? theme.palette.grey[500] : statusBorderColor,
      },

      '& .MuiSvgIcon-root': {
        fontSize: 22,
      },

      '&.MuiInputBase-multiline': {
        minHeight: 180,
        alignItems: 'flex-start',
        padding: 0,
      },

      '& .MuiOutlinedInput-input.MuiInputBase-inputMultiline': {
        ...textSmStyle,
        minHeight: 160,
        height: 'auto',
        padding: '10px 16px',
        resize: 'vertical',
      },

      '& .MuiOutlinedInput-notchedOutline legend': {
        display: 'none',
      },

      '& .MuiOutlinedInput-notchedOutline': {
        top: 0,
      },
    },
  }
})

const StyledFieldLabel = styled(FormLabel)(({theme}) => ({
  ...textSmStyle,
  display: 'block',
  color: theme.palette.grey[800],
  marginBottom: 6,
}))

const StyledHelperText = styled(FormHelperText, {
  shouldForwardProp: prop => prop !== 'fieldStatus',
})<{fieldStatus?: TextInputFieldStatus}>(({theme, fieldStatus = 'default'}) => ({
  marginLeft: 0,
  marginTop: 8,
  ...textSmStyle,
  color:
    fieldStatus === 'success'
      ? theme.palette.success.main
      : fieldStatus === 'error'
        ? theme.palette.error.main
        : theme.palette.grey[500],

  '& .helper-text-title': {
    fontWeight: 700,
    marginRight: 6,
  },
}))

function TextInputFieldInner<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: TextInputFieldProps<TFieldValues, TName>): ReactElement {
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
    inputType = 'text',
    showPasswordToggle = true,
    id,
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

  const fieldStatus = useMemo<TextInputFieldStatus>(() => {
    if (externalStatus) return externalStatus
    if (error) return 'error'
    if (showSuccessState && isTouched && isDirty && !error) return 'success'
    return 'default'
  }, [externalStatus, error, showSuccessState, isTouched, isDirty])

  const helperTextContent = useMemo(() => {
    if (fieldStatus === 'error' && error?.message) {
      return (
        <Box component="span">
          <span className="helper-text-title">Oh snap!</span>
          <span>{error.message}</span>
        </Box>
      )
    }

    if (fieldStatus === 'success' && successMessage) {
      return (
        <Box component="span">
          <span className="helper-text-title">Well done!</span>
          <span>{successMessage}</span>
        </Box>
      )
    }

    return helperText
  }, [error, fieldStatus, helperText, successMessage])

  const configuredType = textFieldProps.type ?? inputType
  const isPasswordField = configuredType === 'password'
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const startAdornment = useMemo(() => {
    if (!startIcon && fieldStatus === 'default') return undefined

    const icon =
      fieldStatus === 'success' ? successIcon : fieldStatus === 'error' ? errorIcon : startIcon

    if (!icon) return undefined

    return <InputAdornment position="start">{icon}</InputAdornment>
  }, [errorIcon, fieldStatus, startIcon, successIcon])

  const endAdornment = useMemo(() => {
    if (!startIcon && fieldStatus !== 'default') return undefined

    const passwordToggle =
      isPasswordField && showPasswordToggle ? (
        <IconButton
          aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
          edge="end"
          onClick={() => setIsPasswordVisible(prev => !prev)}
          size="small"
          sx={{
            color: 'grey.500',
            bgcolor: 'transparent',
            '&:hover': {bgcolor: 'transparent'},
          }}
        >
          {isPasswordVisible ? (
            <VisibilityOutlinedIcon fontSize="small" />
          ) : (
            <VisibilityOffOutlinedIcon fontSize="small" />
          )}
        </IconButton>
      ) : null

    const resolvedEndIcon = endIcon ?? passwordToggle
    if (!resolvedEndIcon) return undefined

    return <InputAdornment position="end">{resolvedEndIcon}</InputAdornment>
  }, [endIcon, fieldStatus, isPasswordField, isPasswordVisible, showPasswordToggle, startIcon])

  const showHelper = !hideEmptyHelperText || helperTextContent
  const inputId = id ?? String(name)
  const renderedType =
    isPasswordField && showPasswordToggle && !endIcon
      ? isPasswordVisible
        ? 'text'
        : 'password'
      : configuredType

  return (
    <Box sx={{width: '100%'}}>
      {label ? <StyledFieldLabel htmlFor={inputId}>{label}</StyledFieldLabel> : null}

      <StyledTextField
        {...textFieldProps}
        {...field}
        disabled={disabled}
        error={fieldStatus === 'error'}
        fieldStatus={fieldStatus}
        fullWidth
        id={inputId}
        placeholder={placeholder}
        slotProps={{
          input: {
            endAdornment,
            startAdornment,
            ...textFieldProps.slotProps?.input,
          },
          ...textFieldProps.slotProps,
        }}
        type={renderedType}
        variant="outlined"
      />

      {showHelper ? (
        <StyledHelperText fieldStatus={fieldStatus}>{helperTextContent}</StyledHelperText>
      ) : null}
    </Box>
  )
}

export const TextInputField = TextInputFieldInner as <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: TextInputFieldProps<TFieldValues, TName>
) => ReactElement

export default TextInputField
