/**
 * Tests for useRoutes custom hook
 * Tests data fetching, loading states, error handling, and refetch functionality
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useRoutes } from './useRoutes'
import { apiClient } from '../../adapters/infrastructure/api/apiClient'
import type { Route } from '../domain/route.entity'

// Mock the API client
vi.mock('../../adapters/infrastructure/api/apiClient', () => ({
  apiClient: {
    getRoutes: vi.fn(),
  },
}))

describe('useRoutes Hook', () => {
  const mockRoutes: Route[] = [
    {
      routeId: 'R001',
      vesselType: 'Container',
      fuelType: 'HFO',
      year: 2024,
      ghgIntensity: 91.0,
      fuelConsumption: 5000,
      distance: 12000,
      totalEmissions: 4500,
      isBaseline: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      routeId: 'R002',
      vesselType: 'Tanker',
      fuelType: 'LNG',
      year: 2024,
      ghgIntensity: 88.0,
      fuelConsumption: 4800,
      distance: 11500,
      totalEmissions: 4200,
      isBaseline: false,
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should fetch routes successfully on mount', async () => {
    vi.mocked(apiClient.getRoutes).mockResolvedValue(mockRoutes)

    const { result } = renderHook(() => useRoutes())

    // Initially loading
    expect(result.current.loading).toBe(true)
    expect(result.current.routes).toEqual([])
    expect(result.current.error).toBeNull()

    // Wait for fetch to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Data should be loaded
    expect(result.current.routes).toEqual(mockRoutes)
    expect(result.current.error).toBeNull()
    expect(apiClient.getRoutes).toHaveBeenCalledTimes(1)
  })

  it('should handle API errors gracefully', async () => {
    const errorMessage = 'Network error'
    vi.mocked(apiClient.getRoutes).mockRejectedValue(new Error(errorMessage))

    const { result } = renderHook(() => useRoutes())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.routes).toEqual([])
    expect(result.current.error).toBe(errorMessage)
  })

  it('should handle non-Error rejections', async () => {
    vi.mocked(apiClient.getRoutes).mockRejectedValue('String error')

    const { result } = renderHook(() => useRoutes())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('Failed to fetch routes')
  })

  it('should refetch routes when refetch is called', async () => {
    vi.mocked(apiClient.getRoutes).mockResolvedValue(mockRoutes)

    const { result } = renderHook(() => useRoutes())

    // Wait for initial fetch
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(apiClient.getRoutes).toHaveBeenCalledTimes(1)

    // Call refetch
    await result.current.refetch()

    // Should call API again
    expect(apiClient.getRoutes).toHaveBeenCalledTimes(2)
    expect(result.current.routes).toEqual(mockRoutes)
  })

  it('should reset error state on successful refetch', async () => {
    // First call fails
    vi.mocked(apiClient.getRoutes).mockRejectedValueOnce(new Error('First error'))

    const { result } = renderHook(() => useRoutes())

    await waitFor(() => {
      expect(result.current.error).toBe('First error')
    })

    // Second call succeeds
    vi.mocked(apiClient.getRoutes).mockResolvedValueOnce(mockRoutes)
    await result.current.refetch()

    await waitFor(() => {
      expect(result.current.error).toBeNull()
      expect(result.current.routes).toEqual(mockRoutes)
    })
  })
})
