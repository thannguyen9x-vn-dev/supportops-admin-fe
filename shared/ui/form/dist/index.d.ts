import { ReactNode, Ref, ReactElement } from 'react';
import { FieldValues, FieldPath, Control, RegisterOptions } from 'react-hook-form';
import { TextFieldProps } from '@mui/material/TextField';

type TextInputFieldStatus = 'default' | 'success' | 'error';
interface TextInputFieldProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> extends Omit<TextFieldProps, 'name' | 'error'> {
    name: TName;
    control: Control<TFieldValues>;
    rules?: RegisterOptions<TFieldValues, TName>;
    label?: string;
    placeholder?: string;
    helperText?: ReactNode;
    successMessage?: ReactNode;
    startIcon?: ReactNode;
    endIcon?: ReactNode;
    status?: TextInputFieldStatus;
    showSuccessState?: boolean;
    successIcon?: ReactNode;
    errorIcon?: ReactNode;
    hideEmptyHelperText?: boolean;
}

declare const TextInputField: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(props: TextInputFieldProps<TFieldValues, TName> & {
    ref?: Ref<HTMLInputElement>;
}) => ReactElement;

export { TextInputField, type TextInputFieldProps, type TextInputFieldStatus };
