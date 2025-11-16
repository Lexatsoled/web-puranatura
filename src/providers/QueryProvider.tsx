/**
 * React Query Provider
 *
 * Configures TanStack Query (React Query) with optimal settings for the application
 * Provides caching, background refetching, and devtools
 */

import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import queryClient from './queryClient';

/**
 * Query Client Configuration
 * Optimized for e-commerce product data
 */
// queryClient moved to providers/queryClient.ts

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
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
};

/**
 * Export the query client for direct access if needed
 */
// (queryClient export moved to providers/queryClient.ts)
