import React from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  className?: string;
}

/**
 * Reusable form field component with consistent styling and error display
 * Reduces repetitive conditional className logic in parent forms
 */
export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  value,
  error,
  onChange,
  type = 'text',
  required = false,
  className = '',
}) => {
  const inputClasses = `w-full px-3 py-2 border rounded-md focus:ring-green-500 ${
    error ? 'border-red-300' : 'border-gray-300'
  } ${className}`;

  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label} {required && '*'}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className={inputClasses}
      />
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );
};
