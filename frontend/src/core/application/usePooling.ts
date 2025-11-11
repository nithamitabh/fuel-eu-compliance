/**
 * Custom Hook: usePooling
 * Manages compliance pooling operations (Article 21)
 * Provides methods to create and manage compliance pools
 */

import { useState, useCallback, useEffect } from 'react';
import type {
  Pool,
  PoolMember,
  CreatePoolInput,
  PoolResult,
} from '../domain';
import { apiClient } from '../../adapters/infrastructure/api';

interface UsePoolingReturn {
  pools: Pool[];
  selectedPool: PoolResult | null;
  loading: boolean;
  error: string | null;
  fetchPools: () => Promise<void>;
  fetchPoolById: (poolId: string) => Promise<void>;
  createPool: (data: CreatePoolInput) => Promise<PoolResult | null>;
  getPoolMembers: (poolId: string) => Promise<PoolMember[]>;
}

export const usePooling = (): UsePoolingReturn => {
  const [pools, setPools] = useState<Pool[]>([]);
  const [selectedPool, setSelectedPool] = useState<PoolResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPools = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiClient.getPools();
      setPools(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch pools';
      setError(errorMessage);
      console.error('Error fetching pools:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPoolById = useCallback(async (poolId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiClient.getPoolById(poolId);
      setSelectedPool(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch pool details';
      setError(errorMessage);
      console.error('Error fetching pool details:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createPool = useCallback(
    async (data: CreatePoolInput): Promise<PoolResult | null> => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await apiClient.createPool(data);
        // Refresh pools list after successful creation
        await fetchPools();
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to create pool';
        setError(errorMessage);
        console.error('Error creating pool:', err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchPools]
  );

  const getPoolMembers = useCallback(async (poolId: string): Promise<PoolMember[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiClient.getPoolMembers(poolId);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch pool members';
      setError(errorMessage);
      console.error('Error fetching pool members:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPools();
  }, [fetchPools]);

  return {
    pools,
    selectedPool,
    loading,
    error,
    fetchPools,
    fetchPoolById,
    createPool,
    getPoolMembers,
  };
};
