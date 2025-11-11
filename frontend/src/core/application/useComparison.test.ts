/**
 * Tests for useComparison Hook
 * Tests comparison data fetching, error handling, and refetch functionality
 */

import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useComparison } from './useComparison'
import { apiClient } from '../../adapters/infrastructure/api/apiClient'
import type { Route } from '../domain/route.entity'

// Mock the API client
vi.mock('../../adapters/infrastructure/api/apiClient', () => ({
  apiClient: {
    getRouteComparison: vi.fn(),
  },
}))

describe('useComparison Hook', () => {
  const mockComparisonData: Route[] = [
    {
      routeId: 'baseline-001',
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
      routeId: 'current-001',
      vesselType: 'Container',
      fuelType: 'LNG',
      year: 2024,
      ghgIntensity: 74.0,
      fuelConsumption: 4500,
      distance: 12000,
      totalEmissions: 3300,
      isBaseline: false,
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch comparison data successfully on mount', async () => {
    vi.mocked(apiClient.getRouteComparison).mockResolvedValue(mockComparisonData)

    const { result } = renderHook(() => useComparison())

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.comparisonData).toEqual(mockComparisonData)
    expect(result.current.error).toBeNull()
    expect(apiClient.getRouteComparison).toHaveBeenCalledTimes(1)
  })

  it('should handle API errors gracefully', async () => {
    const errorMessage = 'Failed to load comparison data'
    vi.mocked(apiClient.getRouteComparison).mockRejectedValue(new Error(errorMessage))

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const { result } = renderHook(() => useComparison())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.comparisonData).toEqual([])
    expect(result.current.error).toBe(errorMessage)
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error fetching comparison data:',
      expect.any(Error)
    )

    consoleSpy.mockRestore()
  })

  it('should handle non-Error rejections', async () => {
    vi.mocked(apiClient.getRouteComparison).mockRejectedValue('String error')

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const { result } = renderHook(() => useComparison())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('Failed to fetch comparison data')
    expect(consoleSpy).toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  it('should refetch comparison data when refetch is called', async () => {
    vi.mocked(apiClient.getRouteComparison).mockResolvedValue(mockComparisonData)

    const { result } = renderHook(() => useComparison())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(apiClient.getRouteComparison).toHaveBeenCalledTimes(1)

    // Call refetch
    await result.current.refetch()

    expect(apiClient.getRouteComparison).toHaveBeenCalledTimes(2)
    expect(result.current.comparisonData).toEqual(mockComparisonData)
  })

  it('should reset error state on successful refetch', async () => {
    // First call fails
    vi.mocked(apiClient.getRouteComparison).mockRejectedValueOnce(new Error('First error'))
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const { result } = renderHook(() => useComparison())

    await waitFor(() => {
      expect(result.current.error).toBe('First error')
    })

    // Second call succeeds
    vi.mocked(apiClient.getRouteComparison).mockResolvedValueOnce(mockComparisonData)

    await result.current.refetch()

    await waitFor(() => {
      expect(result.current.error).toBeNull()
      expect(result.current.comparisonData).toEqual(mockComparisonData)
    })

    consoleSpy.mockRestore()
  })
})
