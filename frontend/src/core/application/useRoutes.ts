/**
 * Custom Hook: useRoutes
 * Manages routes data fetching and state
 * Follows React best practices with useCallback and useEffect
 */

import { useState, useCallback, useEffect } from 'react';
import type { Route } from '../domain';
import { apiClient } from '../../adapters/infrastructure/api';

interface UseRoutesReturn {
  routes: Route[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useRoutes = (): UseRoutesReturn => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoutes = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiClient.getRoutes();
      setRoutes(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch routes';
      setError(errorMessage);
      console.error('Error fetching routes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoutes();
  }, [fetchRoutes]);

  return {
    routes,
    loading,
    error,
    refetch: fetchRoutes,
  };
};
