import React, { useState } from 'react';
import { CheckCircleIcon } from '../icons';

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onBackToLogin,
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simular llamada a API
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <CheckCircleIcon className="w-16 h-16 text-green-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">¡Correo enviado!</h3>
        <p className="text-sm text-gray-600">
          Si existe una cuenta asociada a <strong>{email}</strong>, recibirás
          las instrucciones para restablecer tu contraseña.
        </p>
        <button
          onClick={onBackToLogin}
          className="text-green-600 hover:text-green-700 font-medium"
        >
          Volver a iniciar sesión
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          Restablecer contraseña
        </h3>
        <p className="text-sm text-gray-600">
          Ingresa tu email y te enviaremos un enlace para recuperar tu acceso.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="forgot-email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="forgot-email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="tu@email.com"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar enlace'}
        </button>
      </form>

      <div className="text-center text-sm">
        <button
          onClick={onBackToLogin}
          className="text-gray-600 hover:text-gray-800"
        >
          Cancelar y volver
        </button>
      </div>
    </div>
  );
};
