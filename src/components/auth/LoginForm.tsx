import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { EyeIcon, EyeOffIcon } from '../icons';

interface LoginFormProps {
  onSuccess: () => void;
  onRegisterClick: () => void;
  onForgotPasswordClick: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onRegisterClick,
  onForgotPasswordClick,
}) => {
  const login = useAuthStore((state) => state.login);
  // Remove individual loading/error states if you want to use global store state,
  // but keeping local state is often better for form-specific feedback.
  // Integrating with store for errors:
  const storeError = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    clearError();

    if (!email || !password) {
      setLocalError('Por favor, completa todos los campos');
      return;
    }

    setIsSubmitting(true);
    try {
      await login({ email, password });
      onSuccess();
    } catch (error) {
      // Error is handled by store
      console.error(error);
      setLocalError('Email o contraseña incorrectos');
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayError = localError || storeError;

  return (
    <div className="space-y-4">
      {displayError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{displayError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="login-email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email *
          </label>
          <input
            type="email"
            id="login-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label
            htmlFor="login-password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Contraseña *
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="login-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeIcon className="w-5 h-5" />
              ) : (
                <EyeOffIcon className="w-5 h-5" />
              )}
            </button>
          </div>
          <div className="mt-1 text-right">
            <button
              type="button"
              onClick={onForgotPasswordClick}
              className="text-sm text-green-600 hover:text-green-700"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </button>
      </form>

      <div className="text-center text-sm text-gray-600">
        ¿No tienes cuenta?{' '}
        <button
          onClick={onRegisterClick}
          className="text-green-600 hover:text-green-700 font-medium"
        >
          Regístrate aquí
        </button>
      </div>
    </div>
  );
};
