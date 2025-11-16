/**
 * Custom hook for managing authentication session
 * Handles session timeout, activity monitoring, and auto-logout
 */

import { useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface UseAuthSessionOptions {
  timeoutMinutes?: number;
  warningMinutes?: number;
  onSessionWarning?: () => void;
  onSessionExpired?: () => void;
}

export const useAuthSession = (options: UseAuthSessionOptions = {}) => {
  const {
    timeoutMinutes = 60, // 1 hour default
    warningMinutes = 5, // 5 minutes warning
    onSessionWarning,
    onSessionExpired,
  } = options;

  const { isAuthenticated, logout } = useAuth();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  // Reset session timeout
  const resetSessionTimeout = useCallback(() => {
    if (!isAuthenticated) return;

    // Clear existing timeouts
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);

    lastActivityRef.current = Date.now();

    // Set warning timeout
    const warningTime = (timeoutMinutes - warningMinutes) * 60 * 1000;
    warningRef.current = setTimeout(() => {
      onSessionWarning?.();
    }, warningTime);

    // Set logout timeout
    const logoutTime = timeoutMinutes * 60 * 1000;
    timeoutRef.current = setTimeout(() => {
      onSessionExpired?.();
      logout();
    }, logoutTime);
  }, [
    isAuthenticated,
    logout,
    timeoutMinutes,
    warningMinutes,
    onSessionWarning,
    onSessionExpired,
  ]);

  // Activity event handler
  const handleActivity = useCallback(() => {
    resetSessionTimeout();
  }, [resetSessionTimeout]);

  // Setup activity listeners
  useEffect(() => {
    if (!isAuthenticated) {
      // Clear timeouts when not authenticated
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
      return;
    }

    // Activity events to monitor
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
    ];

    // Add event listeners
    events.forEach((event) => {
      document.addEventListener(event, handleActivity, true);
    });

    // Start session timeout
    resetSessionTimeout();

    // Cleanup
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity, true);
      });
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
    };
  }, [isAuthenticated, handleActivity, resetSessionTimeout]);

  // Reset on authentication change
  useEffect(() => {
    if (isAuthenticated) {
      resetSessionTimeout();
    }
  }, [isAuthenticated, resetSessionTimeout]);

  // Get remaining session time
  const getRemainingTime = useCallback(() => {
    if (!isAuthenticated) return 0;

    const elapsed = Date.now() - lastActivityRef.current;
    const totalTimeout = timeoutMinutes * 60 * 1000;
    const remaining = totalTimeout - elapsed;

    return Math.max(0, remaining);
  }, [isAuthenticated, timeoutMinutes]);

  // Get session status
  const getSessionStatus = useCallback(() => {
    const remaining = getRemainingTime();
    const warningTime = warningMinutes * 60 * 1000;

    if (remaining === 0) return 'expired';
    if (remaining <= warningTime) return 'warning';
    return 'active';
  }, [getRemainingTime, warningMinutes]);

  // Extend session manually
  const extendSession = useCallback(() => {
    resetSessionTimeout();
  }, [resetSessionTimeout]);

  return {
    resetSessionTimeout,
    getRemainingTime,
    getSessionStatus,
    extendSession,
    isActive: isAuthenticated && getSessionStatus() !== 'expired',
  };
};

