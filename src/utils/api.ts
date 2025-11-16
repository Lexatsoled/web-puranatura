import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { useNotifications } from '../hooks/useNotifications';
import { transformApiError } from './errorHandler';
// sanitization middlewares are applied in axios instances where needed
import { rateLimitManager, isRateLimitError } from './rateLimitUtils';
import { logRateLimitEvent } from './rateLimitMonitoring';
import { errorLogger, ErrorSeverity, ErrorCategory } from '../services/errorLogger';
import { setupAxiosSanitization } from './sanitizationMiddleware';

// Rate limiting gestionado por rateLimitManager

// Instancia de axios para la API
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const MUTATING_METHODS = new Set(['post', 'put', 'patch', 'delete']);
let csrfToken: string | null = null;
let csrfTokenPromise: Promise<string> | null = null;

const shouldSendCsrfToken = (method?: string) =>
  !!method && MUTATING_METHODS.has(method.toLowerCase());

const fetchCsrfToken = async (): Promise<string> => {
  if (!csrfTokenPromise) {
    csrfTokenPromise = api
      .get<{ csrfToken: string }>('/csrf-token', {
        withCredentials: true,
        headers: { 'Cache-Control': 'no-cache' },
      })
      .then((response) => {
        csrfToken = response.data.csrfToken;
        return csrfToken;
      })
      .catch((error) => {
        csrfToken = null;
        throw error;
      })
      .finally(() => {
        csrfTokenPromise = null;
      });
  }

  return csrfTokenPromise;
};

const ensureCsrfToken = async () => {
  if (!csrfToken) {
    await fetchCsrfToken();
  }
  if (!csrfToken) {
    throw new Error('No se pudo obtener el token CSRF');
  }
  return csrfToken;
};

setupAxiosSanitization(api);

const csrfErrorCodes = new Set(['FST_CSRF_INVALID_TOKEN', 'FST_CSRF_MISSING_TOKEN']);
const isCsrfError = (error: AxiosError) => {
  if (error.response?.status !== 403) {
    return false;
  }

  const data = error.response.data as { code?: string; message?: string } | undefined;
  if (data?.code && csrfErrorCodes.has(data.code)) {
    return true;
  }

  if (typeof data?.message === 'string' && data.message.toLowerCase().includes('csrf')) {
    return true;
  }

  return false;
};

// Hook personalizado para hacer peticiones a la API
export const useApi = () => {
  const { showNotification } = useNotifications();

  const makeRequest = async <T>(
    config: AxiosRequestConfig,
    category: 'api' = 'api',
    deduplicationKey?: string
  ): Promise<T> => {
    try {
      // Execute with comprehensive rate limiting
      const result = await rateLimitManager.execute(
        category,
        async () => {
          // Logging estructurado: puedes integrar aquí un logger externo si lo necesitas

          const response = await api(config);
          // Logging estructurado: puedes integrar aquí un logger externo si lo necesitas

          return response.data;
        },
        deduplicationKey
      );

      return result;
    } catch (error) {
      if (isRateLimitError(error)) {
        // Logging estructurado: puedes integrar aquí un logger externo si lo necesitas

        showNotification({
          type: 'warning',
          title: 'Demasiadas solicitudes',
          message: error.retryAfter
            ? `Por favor, espera ${Math.ceil(error.retryAfter / 1000)} segundos antes de intentar nuevamente.`
            : 'Por favor, espera un momento antes de intentar nuevamente.',
        });

        throw error;
      }

      if (error instanceof AxiosError && error.response?.status === 429) {
        // Logging estructurado: puedes integrar aquí un logger externo si lo necesitas

        showNotification({
          type: 'warning',
          title: 'Demasiadas solicitudes',
          message: 'Por favor, espera un momento antes de intentar nuevamente.',
        });

        // Wait and retry with backoff
        const retryAfter =
          Number(error.response?.headers['retry-after']) * 1000 || 5000;
        await new Promise((resolve) => setTimeout(resolve, retryAfter));

        return makeRequest(config, category, deduplicationKey);
      }

      logRateLimitEvent(
        'error',
        `Request failed: ${config.method?.toUpperCase()} ${config.url} - ${(error as Error).message}`,
        category
      );
      throw transformApiError(error);
    }
  };

  return {
    get: <T>(
      url: string,
      config?: AxiosRequestConfig,
      deduplicationKey?: string
    ) =>
      makeRequest<T>(
        { ...config, method: 'GET', url },
        'api',
        deduplicationKey
      ),

    post: <T>(
      url: string,
      data?: unknown,
      config?: AxiosRequestConfig,
      deduplicationKey?: string
    ) =>
      makeRequest<T>(
        { ...config, method: 'POST', url, data },
        'api',
        deduplicationKey
      ),

    put: <T>(
      url: string,
      data?: unknown,
      config?: AxiosRequestConfig,
      deduplicationKey?: string
    ) =>
      makeRequest<T>(
        { ...config, method: 'PUT', url, data },
        'api',
        deduplicationKey
      ),

    patch: <T>(
      url: string,
      data?: unknown,
      config?: AxiosRequestConfig,
      deduplicationKey?: string
    ) =>
      makeRequest<T>(
        { ...config, method: 'PATCH', url, data },
        'api',
        deduplicationKey
      ),

    delete: <T>(
      url: string,
      config?: AxiosRequestConfig,
      deduplicationKey?: string
    ) =>
      makeRequest<T>(
        { ...config, method: 'DELETE', url },
        'api',
        deduplicationKey
      ),
  };
};

// Interceptor para añadir el token de autenticación
api.interceptors.request.use(
  async (config) => {
    if (config.withCredentials !== false) {
      config.withCredentials = true;
    }

    config.headers = config.headers ?? {};

    let token = null;
    try {
      token = localStorage.getItem('auth_token');
    } catch (error) {
      errorLogger.log(
        error instanceof Error ? error : new Error('localStorage access error'),
        ErrorSeverity.MEDIUM,
        ErrorCategory.STATE,
        { context: 'api.ts', operation: 'localStorage access' }
      );
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (shouldSendCsrfToken(config.method)) {
      const ensuredToken = await ensureCsrfToken();
      config.headers['X-CSRF-Token'] = ensuredToken;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para refrescar el token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error instanceof AxiosError &&
      originalRequest &&
      shouldSendCsrfToken(originalRequest.method) &&
      isCsrfError(error)
    ) {
      const requestWithMeta = originalRequest as AxiosRequestConfig & { _csrfRetry?: boolean };
      if (!requestWithMeta._csrfRetry) {
        requestWithMeta._csrfRetry = true;
        csrfToken = null;
        const refreshedToken = await ensureCsrfToken();
        requestWithMeta.headers = requestWithMeta.headers ?? {};
        requestWithMeta.headers['X-CSRF-Token'] = refreshedToken;
        return api(requestWithMeta);
      }
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        let refreshToken = null;
        try {
          refreshToken = localStorage.getItem('refresh_token');
        } catch (error) {
          errorLogger.log(
            error instanceof Error ? error : new Error('localStorage access error'),
            ErrorSeverity.MEDIUM,
            ErrorCategory.STATE,
            { context: 'api.ts', operation: 'localStorage get refresh_token' }
          );
        }

        const response = await axios.post('/api/auth/refresh', {
          refreshToken,
        });

        const { token } = response.data;
        try {
          localStorage.setItem('auth_token', token);
        } catch (error) {
          errorLogger.log(
            error instanceof Error ? error : new Error('localStorage access error'),
            ErrorSeverity.MEDIUM,
            ErrorCategory.STATE,
            { context: 'api.ts', operation: 'localStorage set auth_token' }
          );
        }

        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Si falla el refresh, redirigir al login
        try {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
        } catch (error) {
          errorLogger.log(
            error instanceof Error ? error : new Error('localStorage access error'),
            ErrorSeverity.MEDIUM,
            ErrorCategory.STATE,
            { context: 'api.ts', operation: 'localStorage remove tokens' }
          );
        }
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
