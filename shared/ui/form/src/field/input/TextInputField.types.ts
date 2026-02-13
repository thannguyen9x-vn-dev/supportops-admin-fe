// packages/ui/form/src/field/input/TextInputField.types.ts

import type {TextFieldProps} from '@mui/material/TextField'
import type {ReactNode} from 'react'
import type {Control, FieldPath, FieldValues, RegisterOptions} from 'react-hook-form'

export type TextInputFieldStatus = 'default' | 'success' | 'error'

export interface TextInputFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<TextFieldProps, 'name' | 'error'> {
  name: TName

  control: Control<TFieldValues>

  rules?: RegisterOptions<TFieldValues, TName>

  label?: string

  placeholder?: string

  helperText?: ReactNode

  successMessage?: ReactNode

  startIcon?: ReactNode

  endIcon?: ReactNode

  status?: TextInputFieldStatus

  showSuccessState?: boolean

  successIcon?: ReactNode

  errorIcon?: ReactNode

  hideEmptyHelperText?: boolean
}
