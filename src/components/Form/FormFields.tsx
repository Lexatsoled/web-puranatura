import React from 'react';
import { FieldErrors, FieldValues } from 'react-hook-form';
import { SelectField } from './fields/SelectField';
import { TextAreaField } from './fields/TextAreaField';
import { TextField } from './fields/TextField';
import { SelectOption } from './types';

interface FormProps {
  onSubmit: (data: FieldValues) => void;
  errors: FieldErrors;
  children: React.ReactNode;
  className?: string;
}

export const Form: React.FC<FormProps> = ({
  onSubmit,
  children,
  className = '',
}) => (
  <form onSubmit={onSubmit} className={`space-y-4 ${className}`} noValidate>
    {children}
  </form>
);

export { TextField, TextAreaField, SelectField };
export type { SelectOption };
