import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import { sanitizeFormValues } from '@/utils/sanitizer';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, error, clearError, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formError) {
      setFormError(null);
    }
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setFormError('Las contrasenas no coinciden.');
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await register(
        sanitizeFormValues({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
        })
      );

      if (success) {
        navigate('/perfil');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isBusy = isLoading || isSubmitting;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-xl space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Crea tu cuenta</h1>
          <p className="mt-2 text-sm text-gray-600">
            Unete a Pureza Naturalis y descubre nuestros beneficios exclusivos.
          </p>
        </div>

        <form
          className="bg-white shadow rounded-lg px-6 py-8 space-y-6"
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nombre
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Apellidos
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Contrasena
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirmar contrasena
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
              />
            </div>
          </div>

          {(formError || error) && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              {formError || error}
            </div>
          )}

          <button
            type="submit"
            disabled={isBusy}
            className="w-full flex justify-center rounded-md bg-green-600 px-4 py-2 text-white font-semibold shadow-sm hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isBusy ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Ya tienes cuenta?{' '}
          <Link
            className="font-medium text-green-600 hover:text-green-700"
            to="/login"
          >
            Inicia sesion
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
