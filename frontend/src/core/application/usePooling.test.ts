/**
 * Tests for usePooling Hook
 * Tests pooling operations, error handling, and state management
 */

import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { usePooling } from './usePooling'
import { apiClient } from '../../adapters/infrastructure/api/apiClient'

// Mock the API client
vi.mock('../../adapters/infrastructure/api/apiClient', () => ({
  apiClient: {
    getPools: vi.fn(),
    getPoolById: vi.fn(),
    createPool: vi.fn(),
    getPoolMembers: vi.fn(),
  },
}))

describe('usePooling Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with empty pools', () => {
    const { result } = renderHook(() => usePooling())

    expect(result.current.pools).toEqual([])
    expect(result.current.loading).toBe(true) // Initially loading
    expect(result.current.error).toBeNull()
  })

  it('should fetch pools successfully', async () => {
    const mockPools = [
      {
        poolId: 'pool-001',
        poolName: 'Test Pool',
        year: 2024,
        totalBalance: 100,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
    ]

    vi.mocked(apiClient.getPools).mockResolvedValue(mockPools)

    const { result } = renderHook(() => usePooling())

    await waitFor(() => {
      expect(result.current.pools).toEqual(mockPools)
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBeNull()
    })
  })

  it('should handle errors when fetching pools', async () => {
    vi.mocked(apiClient.getPools).mockRejectedValue(new Error('Network error'))

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const { result } = renderHook(() => usePooling())

    await waitFor(() => {
      expect(result.current.error).toBe('Network error')
      expect(result.current.loading).toBe(false)
    })

    consoleSpy.mockRestore()
  })

  it('should create pool successfully', async () => {
    const mockPoolResult = {
      pool: {
        poolId: 'pool-001',
        poolName: 'New Pool',
        year: 2024,
        totalBalance: 0,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      members: [],
    }

    vi.mocked(apiClient.createPool).mockResolvedValue(mockPoolResult)
    vi.mocked(apiClient.getPools).mockResolvedValue([])

    const { result } = renderHook(() => usePooling())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    const poolData = {
      poolName: 'New Pool',
      shipIds: ['ship-001', 'ship-002'],
      year: 2024,
    }

    const poolResult = await result.current.createPool(poolData)

    expect(poolResult).toEqual(mockPoolResult)
    expect(apiClient.createPool).toHaveBeenCalledWith(poolData)
  })

  it('should get pool members', async () => {
    const mockMembers = [
      {
        memberId: 'member-001',
        poolId: 'pool-001',
        shipId: 'ship-001',
        contributionBalance: 50,
        allocatedSurplus: 25,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
    ]

    vi.mocked(apiClient.getPoolMembers).mockResolvedValue(mockMembers)
    vi.mocked(apiClient.getPools).mockResolvedValue([])

    const { result } = renderHook(() => usePooling())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    const members = await result.current.getPoolMembers('pool-001')

    expect(members).toEqual(mockMembers)
    expect(apiClient.getPoolMembers).toHaveBeenCalledWith('pool-001')
  })
})
