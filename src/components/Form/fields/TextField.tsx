import React from 'react';
import { BaseFieldProps } from '../types';

export const TextField: React.FC<BaseFieldProps> = ({
  label,
  name,
  register,
  error,
  placeholder,
  className = '',
  type = 'text',
}) => (
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
