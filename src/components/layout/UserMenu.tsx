import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
  UserIcon,
  ClipboardListIcon,
  MapPinIcon,
  HeartIcon,
  LogoutIcon,
  ChevronDownIcon,
} from '../icons';

const UserMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const memberSinceLabel = useMemo(() => {
    if (!user?.createdAt) return 'Reciente';
    const parsed = new Date(user.createdAt);
    return Number.isNaN(parsed.getTime())
      ? 'Reciente'
      : parsed.getFullYear().toString();
  }, [user?.createdAt]);

  if (!isAuthenticated || !user) return null;

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
  };

  const getInitials = () => {
    const composite = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();
    if (!composite) {
      return user.email.charAt(0).toUpperCase();
    }
    const initials = composite
      .split(' ')
      .filter(Boolean)
      .map((part) => part.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
    return initials || user.email.charAt(0).toUpperCase();
  };

  const menuItems = [
    {
      icon: <UserIcon className="w-4 h-4" />,
      label: 'Mi Perfil',
      action: () => {
        navigate('/perfil');
        setIsOpen(false);
      },
    },
    {
      icon: <ClipboardListIcon className="w-4 h-4" />,
      label: 'Mis Pedidos',
      action: () => {
        navigate('/pedidos');
        setIsOpen(false);
      },
    },
    {
      icon: <MapPinIcon className="w-4 h-4" />,
      label: 'Direcciones',
      action: () => {
        navigate('/direcciones');
        setIsOpen(false);
      },
    },
    {
      icon: <HeartIcon className="w-4 h-4" />,
      label: 'Lista de Deseos',
      action: () => {
        navigate('/lista-deseos');
        setIsOpen(false);
      },
    },
  ];

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white/20 border-2 border-white/30 rounded-3xl text-white text-sm font-semibold transition-all duration-300 hover:bg-white/30 hover:border-white/50"
      >
        <div className="flex items-center justify-center w-8 h-8 bg-white text-green-600 rounded-full text-sm font-bold">
          {getInitials()}
        </div>
        <div className="flex flex-col items-start">
          <p className="m-0 text-sm font-semibold leading-tight max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap">
            {user.firstName} {user.lastName}
          </p>
          <p className="m-0 text-xs opacity-80 leading-tight max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap">
            {user.email}
          </p>
        </div>
        <ChevronDownIcon
          className={`w-4 h-4 opacity-80 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 transition-transform duration-200 transform">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold">
                {getInitials()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                <p className="text-xs text-green-600 font-medium">
                  Miembro desde {memberSinceLabel}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.action();
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left flex items-center space-x-3 hover:bg-gray-50 transition-colors text-gray-700 hover:text-gray-900"
              >
                <span className="text-gray-500">{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Logout */}
          <div className="border-t border-gray-100 pt-2">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left flex items-center space-x-3 hover:bg-red-50 transition-colors text-red-600 hover:text-red-700"
            >
              <LogoutIcon className="w-4 h-4" />
              <span className="text-sm">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
