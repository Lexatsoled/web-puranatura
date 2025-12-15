/**
 * Validation utilities for RegisterForm
 * Extracted to reduce cyclomatic complexity in the component
 */

export interface ValidationRule {
  test: (value: string, formData?: Record<string, string>) => boolean;
  message: string;
}

/**
 * Validates a single field against a set of rules
 * @returns Error message or null if valid
 */
export function validateField(
  value: string,
  rules: ValidationRule[],
  formData?: Record<string, string>
): string | null {
  for (const rule of rules) {
    if (!rule.test(value, formData)) {
      return rule.message;
    }
  }
  return null;
}

/**
 * Validation rules for registration form fields
 */
export const REGISTER_VALIDATION_RULES: Record<string, ValidationRule[]> = {
  firstName: [
    {
      test: (value) => value.trim().length > 0,
      message: 'El nombre es requerido',
    },
  ],
  lastName: [
    {
      test: (value) => value.trim().length > 0,
      message: 'El apellido es requerido',
    },
  ],
  email: [
    {
      test: (value) => value.trim().length > 0,
      message: 'El email es requerido',
    },
    {
      test: (value) => /\S+@\S+\.\S+/.test(value),
      message: 'Email inválido',
    },
  ],
  password: [
    {
      test: (value) => value.length > 0,
      message: 'La contraseña es requerida',
    },
    {
      test: (value) => value.length >= 6,
      message: 'Mínimo 6 caracteres',
    },
  ],
  confirmPassword: [
    {
      test: (value, formData) => value === formData?.password,
      message: 'Las contraseñas no coinciden',
    },
  ],
};

/**
 * Validates entire form data against rules
 * @returns Record of field errors (empty if all valid)
 */
export function validateFormData(
  formData: Record<string, string>,
  rules: Record<string, ValidationRule[]>
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const [field, fieldRules] of Object.entries(rules)) {
    const error = validateField(formData[field] || '', fieldRules, formData);
    if (error) {
      errors[field] = error;
    }
  }

  return errors;
}
