/**
 * Custom Hook: useComparison
 * Manages route comparison data fetching and state
 * Used for comparing baseline vs current routes
 */

import { useState, useCallback, useEffect } from 'react';
import type { Route } from '../domain';
import { apiClient } from '../../adapters/infrastructure/api';

interface UseComparisonReturn {
  comparisonData: Route[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useComparison = (): UseComparisonReturn => {
  const [comparisonData, setComparisonData] = useState<Route[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComparison = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiClient.getRouteComparison();
      setComparisonData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch comparison data';
      setError(errorMessage);
      console.error('Error fetching comparison data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComparison();
  }, [fetchComparison]);

  return {
    comparisonData,
    loading,
    error,
    refetch: fetchComparison,
  };
};
