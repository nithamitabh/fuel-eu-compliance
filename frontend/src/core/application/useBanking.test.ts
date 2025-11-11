/**
 * Tests for useBanking Hook
 * Tests banking operations, error handling, and state management
 */

import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useBanking } from './useBanking'
import { apiClient } from '../../adapters/infrastructure/api/apiClient'

// Mock the API client
vi.mock('../../adapters/infrastructure/api/apiClient', () => ({
  apiClient: {
    getBankingRecords: vi.fn(),
    bankSurplus: vi.fn(),
    applyBankedSurplus: vi.fn(),
    getAvailableSurplus: vi.fn(),
  },
}))

describe('useBanking Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with empty banking records', () => {
    const { result } = renderHook(() => useBanking())

    expect(result.current.bankingRecords).toEqual([])
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should fetch banking records successfully', async () => {
    const mockRecords = [
      {
        bankingId: '1',
        shipId: 'ship-001',
        year: 2024,
        bankedAmount: 100,
        expiryYear: 2027,
        isExpired: false,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
    ]

    vi.mocked(apiClient.getBankingRecords).mockResolvedValue(mockRecords)

    const { result } = renderHook(() => useBanking())

    await result.current.fetchBankingRecords('ship-001')

    await waitFor(() => {
      expect(result.current.bankingRecords).toEqual(mockRecords)
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBeNull()
    })
  })

  it('should handle errors when fetching banking records', async () => {
    vi.mocked(apiClient.getBankingRecords).mockRejectedValue(new Error('Network error'))

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const { result } = renderHook(() => useBanking())

    await result.current.fetchBankingRecords('ship-001')

    await waitFor(() => {
      expect(result.current.error).toBe('Network error')
      expect(result.current.loading).toBe(false)
    })

    consoleSpy.mockRestore()
  })

  it('should bank surplus successfully', async () => {
    const mockBankingResult = {
      bankingId: '1',
      shipId: 'ship-001',
      year: 2024,
      bankedAmount: 100,
      expiryYear: 2027,
    }

    vi.mocked(apiClient.bankSurplus).mockResolvedValue(mockBankingResult)
    vi.mocked(apiClient.getBankingRecords).mockResolvedValue([])

    const { result } = renderHook(() => useBanking())

    const bankingData = {
      shipId: 'ship-001',
      year: 2024,
      complianceBalance: 100,
    }

    const bankResult = await result.current.bankSurplus(bankingData)

    expect(bankResult).toEqual(mockBankingResult)
    expect(apiClient.bankSurplus).toHaveBeenCalledWith(bankingData)
  })

  it('should get available surplus', async () => {
    const mockSurplus = [
      {
        bankingId: '1',
        shipId: 'ship-001',
        year: 2024,
        bankedAmount: 100,
        expiryYear: 2027,
        isExpired: false,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
    ]

    vi.mocked(apiClient.getAvailableSurplus).mockResolvedValue(mockSurplus)

    const { result } = renderHook(() => useBanking())

    const surplus = await result.current.getAvailableSurplus('ship-001')

    expect(surplus).toEqual(mockSurplus)
    expect(apiClient.getAvailableSurplus).toHaveBeenCalledWith('ship-001')
  })
})
