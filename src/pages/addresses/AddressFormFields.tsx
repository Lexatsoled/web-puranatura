import { FormData } from './useAddressesState';

type InputProps = {
  id: string;
  name: keyof FormData;
  label: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
};

export const InputField = ({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  autoComplete,
  inputMode,
}: InputProps) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <input
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
      placeholder={placeholder}
      type={type}
      autoComplete={autoComplete}
      inputMode={inputMode}
      required
    />
  </div>
);

type SelectProps = {
  id: string;
  name: keyof FormData;
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  autoComplete?: string;
};

export const SelectField = ({
  id,
  name,
  label,
  value,
  options,
  onChange,
  autoComplete,
}: SelectProps) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
      autoComplete={autoComplete}
      required
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export const FormActions = ({
  isEditing,
  onCancel,
}: {
  isEditing: boolean;
  onCancel: () => void;
}) => (
  <div className="flex gap-3 pt-4">
    <button
      type="submit"
      className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
    >
      {isEditing ? 'Actualizar' : 'Agregar'} Direccion
    </button>
    <button
      type="button"
      onClick={onCancel}
      className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors"
    >
      Cancelar
    </button>
  </div>
);
