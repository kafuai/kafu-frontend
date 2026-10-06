export type PasswordValidationResult =
  | { valid: true }
  | {
      valid: false;
      reason:
        | "too_short"
        | "letter_required"
        | "number_required"
        | "whitespace_not_allowed"
        | "english_only";
    };

export function validatePassword(
  password: string,
): PasswordValidationResult {
  // Password must contain at least 8 characters.
  if (password.length < 8) {
    return { valid: false, reason: "too_short" };
  }

  // Password must not consist only of whitespace.
  if (/\s/.test(password)) {
    return { valid: false, reason: "whitespace_not_allowed" };
  }

  // Password must contain at least one English letter.
  if (!/[A-Za-z]/.test(password)) {
    return { valid: false, reason: "letter_required" };
  }

  // Password must contain at least one number.
  if (!/[0-9]/.test(password)) {
    return { valid: false, reason: "number_required" };
  }
  if (!/^[\x00-\x7F]*$/.test(password)) {
    return { valid: false, reason: "english_only" };
  }

  return { valid: true };
}