import React from 'react';
import { UseFormRegister, FieldValues, FieldErrors } from 'react-hook-form';

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  register: UseFormRegister<FieldValues>;
  error?: string;
  placeholder?: string;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  register,
  error,
  placeholder,
  className = '',
}) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <input
        {...register(name)}
        type={type}
        id={name}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
          error ? 'border-red-300' : 'border-gray-300'
        } ${className}`}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600" id={`${name}-error`}>
          {error}
        </p>
      )}
    </div>
  );
};

interface TextAreaFieldProps extends Omit<FormFieldProps, 'type'> {
  rows?: number;
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  name,
  register,
  error,
  placeholder,
  rows = 4,
  className = '',
}) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <textarea
        {...register(name)}
        id={name}
        rows={rows}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
          error ? 'border-red-300' : 'border-gray-300'
        } ${className}`}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600" id={`${name}-error`}>
          {error}
        </p>
      )}
    </div>
  );
};

interface SelectFieldProps extends Omit<FormFieldProps, 'type'> {
  options: { value: string; label: string }[];
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  register,
  error,
  options,
  className = '',
}) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <select
        {...register(name)}
        id={name}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
          error ? 'border-red-300' : 'border-gray-300'
        } ${className}`}
        aria-describedby={error ? `${name}-error` : undefined}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600" id={`${name}-error`}>
          {error}
        </p>
      )}
    </div>
  );
};

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
}) => {
  return (
    <form onSubmit={onSubmit} className={`space-y-4 ${className}`} noValidate>
      {children}
    </form>
  );
};
