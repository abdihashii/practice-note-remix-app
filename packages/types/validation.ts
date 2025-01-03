export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  maxLength: 128,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1,
  allowedSymbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
} as const;

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validatePasswordStrength(
  password: string
): PasswordValidationResult {
  const errors: string[] = [];

  if (password.length < PASSWORD_REQUIREMENTS.minLength) {
    errors.push(
      `Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters long`
    );
  }

  if (password.length > PASSWORD_REQUIREMENTS.maxLength) {
    errors.push(
      `Password must be less than ${PASSWORD_REQUIREMENTS.maxLength} characters`
    );
  }

  if (
    (password.match(/[a-z]/g) || []).length < PASSWORD_REQUIREMENTS.minLowercase
  ) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (
    (password.match(/[A-Z]/g) || []).length < PASSWORD_REQUIREMENTS.minUppercase
  ) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (
    (password.match(/[0-9]/g) || []).length < PASSWORD_REQUIREMENTS.minNumbers
  ) {
    errors.push("Password must contain at least one number");
  }

  const symbols = new RegExp(
    `[${PASSWORD_REQUIREMENTS.allowedSymbols.replace(
      /[-[\]{}()*+?.,\\^$|#\s]/g,
      "\\$&"
    )}]`,
    "g"
  );
  if (
    (password.match(symbols) || []).length < PASSWORD_REQUIREMENTS.minSymbols
  ) {
    errors.push("Password must contain at least one special character");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
