/**
 * Custom Hook: useCompliance
 * Manages ship compliance operations
 * Provides methods to compute and fetch compliance data
 */

import { useState, useCallback } from 'react';
import type {
  ShipCompliance,
  ComputeComplianceInput,
  ComputeComplianceResult,
} from '../domain';
import { apiClient } from '../../adapters/infrastructure/api';

interface UseComplianceReturn {
  complianceData: ShipCompliance | null;
  complianceHistory: ShipCompliance[];
  loading: boolean;
  error: string | null;
  fetchShipCompliance: (shipId: string, year: number) => Promise<void>;
  computeCompliance: (data: ComputeComplianceInput) => Promise<ComputeComplianceResult | null>;
  fetchComplianceHistory: (shipId: string) => Promise<void>;
  fetchYearCompliance: (year: number) => Promise<ShipCompliance[]>;
}

export const useCompliance = (): UseComplianceReturn => {
  const [complianceData, setComplianceData] = useState<ShipCompliance | null>(null);
  const [complianceHistory, setComplianceHistory] = useState<ShipCompliance[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchShipCompliance = useCallback(async (shipId: string, year: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiClient.getShipCompliance(shipId, year);
      setComplianceData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch compliance data';
      setError(errorMessage);
      console.error('Error fetching compliance data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const computeCompliance = useCallback(
    async (data: ComputeComplianceInput): Promise<ComputeComplianceResult | null> => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await apiClient.computeCompliance(data);
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to compute compliance';
        setError(errorMessage);
        console.error('Error computing compliance:', err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchComplianceHistory = useCallback(async (shipId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiClient.getShipComplianceHistory(shipId);
      setComplianceHistory(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch compliance history';
      setError(errorMessage);
      console.error('Error fetching compliance history:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchYearCompliance = useCallback(async (year: number): Promise<ShipCompliance[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiClient.getYearCompliance(year);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch year compliance';
      setError(errorMessage);
      console.error('Error fetching year compliance:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    complianceData,
    complianceHistory,
    loading,
    error,
    fetchShipCompliance,
    computeCompliance,
    fetchComplianceHistory,
    fetchYearCompliance,
  };
};
