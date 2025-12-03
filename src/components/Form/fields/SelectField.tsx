import React from 'react';
import { BaseFieldProps, SelectOption } from '../types';

export const SelectField: React.FC<
  BaseFieldProps & { options: SelectOption[] }
> = ({ label, name, register, error, options, className = '' }) => (
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
