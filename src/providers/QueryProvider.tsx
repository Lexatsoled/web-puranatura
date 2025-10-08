/**
 * React Query Provider
 * 
 * Configures TanStack Query (React Query) with optimal settings for the application
 * Provides caching, background refetching, and devtools
 */

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

/**
 * Query Client Configuration
 * Optimized for e-commerce product data
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: how long data is considered fresh (5 minutes default)
      staleTime: 5 * 60 * 1000,
      
      // GC time: how long unused data stays in cache (10 minutes default)
      gcTime: 10 * 60 * 1000,
      
      // Retry failed requests (network errors, 5xx)
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Refetch on window focus (good for keeping data fresh)
      refetchOnWindowFocus: true,
      
      // Don't refetch on mount if data is fresh
      refetchOnMount: false,
      
      // Refetch on reconnect after network errors
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry mutations once on network errors
      retry: 1,
      retryDelay: 1000,
    },
  },
});

/**
 * QueryProvider Component
 * Wraps the app with React Query context and devtools
 */
interface QueryProviderProps {
  children: React.ReactNode;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      
      {/* React Query Devtools - only visible in development */}
      {import.meta.env.DEV && (
        <ReactQueryDevtools 
          initialIsOpen={false}
        />
      )}
    </QueryClientProvider>
  );
};

/**
 * Export the query client for direct access if needed
 */
export { queryClient };
