import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useApi } from '@/utils/api';
import { useAuth } from '@/hooks/useAuth';

interface Session {
  id: string;
  device: string;
  ipAddress: string;
  createdAt: string;
  lastUsedAt: string;
  expiresAt: string;
  isCurrent: boolean;
}

const formatDate = (value: string) =>
  new Date(value).toLocaleString('es-ES', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

const SessionsManager: React.FC = () => {
  const { get, delete: deleteRequest, post } = useApi();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadSessions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await get<{ sessions: Session[] }>('/sessions');
      setSessions(data.sessions);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('No pudimos cargar tus sesiones activas.');
    } finally {
      setLoading(false);
    }
  }, [get]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const revokeSession = async (sessionId: string) => {
    const confirmed = window.confirm('¿Revocar esta sesión?');
    if (!confirmed) {
      return;
    }
    try {
      await deleteRequest(`/sessions/${sessionId}`);
      setActionMessage('Sesión revocada correctamente.');
      await loadSessions();
    } catch (err) {
      console.error(err);
      setActionMessage('No pudimos revocar la sesión. Intenta nuevamente.');
    }
  };

  const logoutAll = async () => {
    const confirmed = window.confirm('¿Cerrar sesión en TODOS los dispositivos?');
    if (!confirmed) {
      return;
    }
    try {
      await post('/auth/logout-all');
      window.location.href = '/login';
    } catch (err) {
      console.error(err);
      setActionMessage('No pudimos cerrar las sesiones. Intenta nuevamente.');
    }
  };

  const hasSessions = useMemo(() => sessions.length > 0, [sessions]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Sesiones activas</h2>
          <p className="text-gray-600 text-sm">
            Revisa los dispositivos conectados y revoca acceso cuando lo consideres necesario.
          </p>
        </div>
        <button
          onClick={logoutAll}
          className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold shadow hover:bg-red-700 transition"
        >
          Cerrar todas las sesiones
        </button>
      </div>

      {actionMessage && (
        <div className="mb-4 px-4 py-3 rounded-md bg-blue-50 border border-blue-100 text-sm text-blue-700">
          {actionMessage}
        </div>
      )}

      {error && (
        <div className="mb-4 px-4 py-3 rounded-md bg-red-50 border border-red-100 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-8 text-center text-gray-500">Cargando sesiones...</div>
      ) : !hasSessions ? (
        <div className="py-8 text-center text-gray-500">
          No encontramos sesiones activas aparte de la actual.
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="flex flex-col lg:flex-row lg:items-center justify-between border border-gray-100 rounded-lg p-4 gap-3"
            >
              <div>
                <div className="flex items-center gap-3">
                  <p className="font-semibold text-gray-900">{session.device}</p>
                  {session.isCurrent && (
                    <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                      Sesión actual
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">IP: {session.ipAddress}</p>
                <p className="text-sm text-gray-600">
                  Última actividad: {formatDate(session.lastUsedAt)}
                </p>
                <p className="text-xs text-gray-500">
                  Creada: {formatDate(session.createdAt)} · Expira: {formatDate(session.expiresAt)}
                </p>
              </div>

              {!session.isCurrent && (
                <button
                  onClick={() => revokeSession(session.id)}
                  className="self-start lg:self-auto px-3 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition"
                >
                  Revocar
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

const AccountSettingsPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso denegado</h2>
          <p className="text-gray-600">Inicia sesión para gestionar la seguridad de tu cuenta.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4 space-y-6">
        <div>
          <p className="text-sm text-green-600 font-semibold uppercase tracking-wide mb-2">
            Seguridad y sesiones
          </p>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuración de cuenta</h1>
          <p className="text-gray-600 max-w-2xl">
            Controla los dispositivos con acceso a tu cuenta y cierra sesiones que ya no reconozcas.
          </p>
        </div>

        <SessionsManager />
      </div>
    </div>
  );
};

export default AccountSettingsPage;
