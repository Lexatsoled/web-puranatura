import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { EyeIcon, EyeOffIcon } from '../icons';

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
    const newErrors: Record<string, string> = {};
    if (!formData.firstName) newErrors.firstName = 'El nombre es requerido';
    if (!formData.lastName) newErrors.lastName = 'El apellido es requerido';
    if (!formData.email) newErrors.email = 'El email es requerido';
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'Email inválido';
    if (!formData.password) newErrors.password = 'La contraseña es requerida';
    else if (formData.password.length < 6)
      newErrors.password = 'Mínimo 6 caracteres';
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Las contraseñas no coinciden';

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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:ring-green-500 ${
                errors.firstName ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.firstName && (
              <p className="text-red-600 text-xs mt-1">{errors.firstName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Apellido *
            </label>
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:ring-green-500 ${
                errors.lastName ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.lastName && (
              <p className="text-red-600 text-xs mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:ring-green-500 ${
              errors.email ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.email && (
            <p className="text-red-600 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña *
          </label>
          <div className="relative">
            <input
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirmar Contraseña *
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:ring-green-500 ${
              errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.confirmPassword && (
            <p className="text-red-600 text-xs mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>

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
