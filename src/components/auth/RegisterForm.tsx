import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { EyeIcon, EyeOffIcon } from '../icons';
import { FormField } from '../common/FormField';
import {
  validateFormData,
  REGISTER_VALIDATION_RULES,
} from './RegisterForm.validation';

interface RegisterFormProps {
  onSuccess: () => void;
  onLoginClick: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  onLoginClick,
}) => {
  const register = useAuthStore((state) => state.register);
  const storeError = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = validateFormData(formData, REGISTER_VALIDATION_RULES);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      });
      onSuccess();
    } catch {
      setErrors({ general: 'Error en el registro. Inténtalo de nuevo.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {storeError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{storeError}</p>
        </div>
      )}
      {errors.general && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{errors.general}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Nombre"
            name="firstName"
            value={formData.firstName}
            error={errors.firstName}
            onChange={handleInputChange}
            required
          />
          <FormField
            label="Apellido"
            name="lastName"
            value={formData.lastName}
            error={errors.lastName}
            onChange={handleInputChange}
            required
          />
        </div>

        <FormField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          error={errors.email}
          onChange={handleInputChange}
          required
        />

        <FormField
          label="Teléfono"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleInputChange}
        />

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Contraseña *
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 pr-10 border rounded-md focus:ring-green-500 ${
                errors.password ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
            >
              {showPassword ? (
                <EyeIcon className="w-5 h-5" />
              ) : (
                <EyeOffIcon className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-600 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        <FormField
          label="Confirmar Contraseña"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          error={errors.confirmPassword}
          onChange={handleInputChange}
          required
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Registrando...' : 'Crear Cuenta'}
        </button>
      </form>

      <div className="text-center text-sm text-gray-600">
        ¿Ya tienes cuenta?{' '}
        <button
          onClick={onLoginClick}
          className="text-green-600 hover:text-green-700 font-medium"
        >
          Inicia sesión
        </button>
      </div>
    </div>
  );
};
