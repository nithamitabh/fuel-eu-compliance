/**
 * Custom Hook: useBanking
 * Manages banking surplus operations (Article 20)
 * Provides methods to bank surplus and apply banked surplus to deficits
 */

import { useState, useCallback } from 'react';
import type {
  BankingRecord,
  BankSurplusInput,
  ApplyBankedSurplusInput,
  BankingResult,
  ShipCompliance,
} from '../domain';
import { apiClient } from '../../adapters/infrastructure/api';

interface UseBankingReturn {
  bankingRecords: BankingRecord[];
  loading: boolean;
  error: string | null;
  fetchBankingRecords: (shipId: string) => Promise<void>;
  bankSurplus: (data: BankSurplusInput) => Promise<BankingResult | null>;
  applyBankedSurplus: (data: ApplyBankedSurplusInput) => Promise<ShipCompliance | null>;
  getAvailableSurplus: (shipId: string) => Promise<BankingRecord[]>;
}

export const useBanking = (): UseBankingReturn => {
  const [bankingRecords, setBankingRecords] = useState<BankingRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBankingRecords = useCallback(async (shipId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiClient.getBankingRecords(shipId);
      setBankingRecords(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch banking records';
      setError(errorMessage);
      console.error('Error fetching banking records:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const bankSurplus = useCallback(async (data: BankSurplusInput): Promise<BankingResult | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiClient.bankSurplus(data);
      // Refresh banking records after successful banking
      await fetchBankingRecords(data.shipId);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to bank surplus';
      setError(errorMessage);
      console.error('Error banking surplus:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchBankingRecords]);

  const applyBankedSurplus = useCallback(
    async (data: ApplyBankedSurplusInput): Promise<ShipCompliance | null> => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await apiClient.applyBankedSurplus(data);
        // Refresh banking records after successful application
        await fetchBankingRecords(data.shipId);
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to apply banked surplus';
        setError(errorMessage);
        console.error('Error applying banked surplus:', err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchBankingRecords]
  );

  const getAvailableSurplus = useCallback(async (shipId: string): Promise<BankingRecord[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiClient.getAvailableSurplus(shipId);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch available surplus';
      setError(errorMessage);
      console.error('Error fetching available surplus:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    bankingRecords,
    loading,
    error,
    fetchBankingRecords,
    bankSurplus,
    applyBankedSurplus,
    getAvailableSurplus,
  };
};
