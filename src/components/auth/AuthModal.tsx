import React, { useState, useRef, useEffect } from 'react';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { XIcon } from '../icons';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'register';
}

type AuthView = 'login' | 'register' | 'forgot-password';

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'login',
}) => {
  const [activeView, setActiveView] = useState<AuthView>(initialTab);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Sync initialTab when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveView(initialTab);
    }
  }, [isOpen, initialTab]);

  useFocusTrap(dialogRef, {
    isActive: isOpen,
    onEscape: onClose,
    initialFocusRef: closeButtonRef,
  });

  if (!isOpen) return null;

  const renderTitle = () => {
    switch (activeView) {
      case 'login':
        return 'Iniciar sesión';
      case 'register':
        return 'Crear cuenta';
      case 'forgot-password':
        return 'Recuperar contraseña';
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto focus:outline-none transform transition-all duration-200"
        role="dialog" // Use simplified role without aria-modal for now if issues arise, but standard suggests dialog+aria-modal
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        ref={dialogRef}
        tabIndex={-1}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2
              className="text-2xl font-bold text-gray-900"
              id="auth-modal-title"
            >
              {renderTitle()}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Cerrar autenticación"
              ref={closeButtonRef}
              type="button"
            >
              <XIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Tab switcher only for login/register views */}
          {(activeView === 'login' || activeView === 'register') && (
            <div className="mt-4 flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveView('login')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeView === 'login'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Iniciar sesión
              </button>
              <button
                onClick={() => setActiveView('register')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeView === 'register'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Registrarse
              </button>
            </div>
          )}
        </div>

        <div className="p-6">
          {activeView === 'login' && (
            <LoginForm
              onSuccess={onClose}
              onRegisterClick={() => setActiveView('register')}
              onForgotPasswordClick={() => setActiveView('forgot-password')}
            />
          )}

          {activeView === 'register' && (
            <RegisterForm
              onSuccess={onClose}
              onLoginClick={() => setActiveView('login')}
            />
          )}

          {activeView === 'forgot-password' && (
            <ForgotPasswordForm onBackToLogin={() => setActiveView('login')} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
