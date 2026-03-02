import type { FieldPath, FieldValues, RegisterOptions } from "react-hook-form";

export const PASSWORD_MIN_LENGTH = 10;
export const PASSWORD_MAX_LENGTH = 32;
export const PASSWORD_LOWERCASE_REGEX = /[a-z]/;
export const PASSWORD_UPPERCASE_REGEX = /[A-Z]/;
export const PASSWORD_NUMBER_REGEX = /[0-9]/;
export const PASSWORD_SPECIAL_CHAR_REGEX = /[!@#$%^&*(),.?":{}|<>]/;

export type PasswordRequirementState = {
  minLength: boolean;
  lowercase: boolean;
  uppercase: boolean;
  number: boolean;
  specialCharacter: boolean;
};

export function getPasswordRequirementState(password: string): PasswordRequirementState {
  return {
    minLength: password.length >= PASSWORD_MIN_LENGTH && password.length <= PASSWORD_MAX_LENGTH,
    lowercase: PASSWORD_LOWERCASE_REGEX.test(password),
    uppercase: PASSWORD_UPPERCASE_REGEX.test(password),
    number: PASSWORD_NUMBER_REGEX.test(password),
    specialCharacter: PASSWORD_SPECIAL_CHAR_REGEX.test(password),
  };
}

type PasswordValidationMessages = {
  required: string;
  min: string;
  max: string;
  format: string;
};

export function buildPasswordRules<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>(
  messages: PasswordValidationMessages,
): RegisterOptions<TFieldValues, TName> {
  return {
    required: messages.required,
    minLength: {
      value: PASSWORD_MIN_LENGTH,
      message: messages.min,
    },
    maxLength: {
      value: PASSWORD_MAX_LENGTH,
      message: messages.max,
    },
    validate: {
      hasLowercase: (value: string) =>
        PASSWORD_LOWERCASE_REGEX.test(value) || messages.format,
      hasUppercase: (value: string) =>
        PASSWORD_UPPERCASE_REGEX.test(value) || messages.format,
      hasNumber: (value: string) =>
        PASSWORD_NUMBER_REGEX.test(value) || messages.format,
      hasSpecialCharacter: (value: string) =>
        PASSWORD_SPECIAL_CHAR_REGEX.test(value) || messages.format,
    },
  };
}
