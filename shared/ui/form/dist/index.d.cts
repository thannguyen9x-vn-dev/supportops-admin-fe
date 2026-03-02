import { ReactNode, ReactElement } from 'react';
import { FieldValues, FieldPath, FieldPathValue, Control, RegisterOptions } from 'react-hook-form';
import { AutocompleteProps } from '@mui/material/Autocomplete';
import { TextFieldProps } from '@mui/material/TextField';

type SelectOptionValue = string | number;
interface SelectOption<TValue extends SelectOptionValue = string> {
    label: string;
    value: TValue;
    disabled?: boolean;
}
type AutocompleteOption<TValue extends SelectOptionValue> = SelectOption<TValue>;
interface SelectOptionFieldProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>, TValue extends SelectOptionValue = Extract<FieldPathValue<TFieldValues, TName>, SelectOptionValue>> extends Omit<TextFieldProps, 'name' | 'error' | 'onChange' | 'select' | 'value'> {
    name: TName;
    control: Control<TFieldValues>;
    rules?: RegisterOptions<TFieldValues, TName>;
    label?: string;
    helperText?: ReactNode;
    hideEmptyHelperText?: boolean;
    options: ReadonlyArray<SelectOption<TValue>>;
    searchable?: boolean;
    searchInPopup?: boolean;
    searchPlaceholder?: string;
    noOptionsText?: ReactNode;
    disableClearable?: boolean;
    autocompleteProps?: Omit<AutocompleteProps<AutocompleteOption<TValue>, false, boolean, false>, 'options' | 'value' | 'onBlur' | 'onChange' | 'renderInput' | 'getOptionDisabled' | 'getOptionKey' | 'getOptionLabel' | 'id' | 'fullWidth'>;
}

declare const SelectOptionField: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>, TValue extends string | number = Extract<FieldPathValue<TFieldValues, TName>, string | number>>(props: SelectOptionFieldProps<TFieldValues, TName, TValue>) => ReactElement;

type TextInputFieldStatus = 'default' | 'success' | 'error';
type TextInputFieldType = 'text' | 'email' | 'password';
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
    inputType?: TextInputFieldType;
    showPasswordToggle?: boolean;
}

declare const TextInputField: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(props: TextInputFieldProps<TFieldValues, TName>) => ReactElement;

interface TextAreaFieldProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> extends Omit<TextInputFieldProps<TFieldValues, TName>, 'multiline' | 'rows' | 'type' | 'inputType'> {
    minRows?: number;
    maxRows?: number;
}

declare function TextAreaField<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(props: TextAreaFieldProps<TFieldValues, TName>): ReactElement;

export { type SelectOption, SelectOptionField, type SelectOptionFieldProps, TextAreaField, type TextAreaFieldProps, TextInputField, type TextInputFieldProps, type TextInputFieldStatus, type TextInputFieldType };
