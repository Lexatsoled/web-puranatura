import { UseFormRegister, FieldValues } from 'react-hook-form';

export type BaseFieldProps = {
  label: string;
  name: string;
  register: UseFormRegister<FieldValues>;
  error?: string;
  placeholder?: string;
  className?: string;
  type?: string;
};

export type SelectOption = { value: string; label: string };
