/**
 * Tests for RoutesTab Component
 * Tests rendering, loading states, data display, and user interactions
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { RoutesTab } from './RoutesTab'
import { useRoutes } from '../../../core/application/useRoutes'
import type { Route } from '../../../core/domain/route.entity'

// Mock the useRoutes hook
vi.mock('../../../core/application/useRoutes')

describe('RoutesTab Component', () => {
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

  it('should render loading state', () => {
    vi.mocked(useRoutes).mockReturnValue({
      routes: [],
      loading: true,
      error: null,
      refetch: vi.fn(),
    })

    render(<RoutesTab />)

    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('should render error state', () => {
    const errorMessage = 'Failed to fetch routes'
    vi.mocked(useRoutes).mockReturnValue({
      routes: [],
      loading: false,
      error: errorMessage,
      refetch: vi.fn(),
    })

    render(<RoutesTab />)

    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })

  it('should render routes table with data', async () => {
    vi.mocked(useRoutes).mockReturnValue({
      routes: mockRoutes,
      loading: false,
      error: null,
      refetch: vi.fn(),
    })

    render(<RoutesTab />)

    await waitFor(() => {
      // Route IDs are truncated to first 8 chars with "..."
      expect(screen.getByText(/R001/)).toBeInTheDocument()
      expect(screen.getByText(/R002/)).toBeInTheDocument()
    })

    expect(screen.getByText('Container')).toBeInTheDocument()
    expect(screen.getByText('Tanker')).toBeInTheDocument()
  })

  it('should display "No routes" message when routes array is empty', () => {
    vi.mocked(useRoutes).mockReturnValue({
      routes: [],
      loading: false,
      error: null,
      refetch: vi.fn(),
    })

    render(<RoutesTab />)

    expect(screen.getByText(/no routes/i)).toBeInTheDocument()
  })

  it('should handle non-array routes gracefully (defensive programming)', () => {
    // This tests the defensive Array.isArray() check
    vi.mocked(useRoutes).mockReturnValue({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      routes: null as any, // Simulate unexpected API response
      loading: false,
      error: null,
      refetch: vi.fn(),
    })

    render(<RoutesTab />)

    // Should not crash, should show empty state
    expect(screen.getByText(/no routes/i)).toBeInTheDocument()
  })

  it('should display baseline indicator for baseline route', () => {
    vi.mocked(useRoutes).mockReturnValue({
      routes: mockRoutes,
      loading: false,
      error: null,
      refetch: vi.fn(),
    })

    render(<RoutesTab />)

    // R001 is baseline, should show indicator
    const baselineIndicators = screen.getAllByText(/baseline/i)
    expect(baselineIndicators.length).toBeGreaterThan(0)
  })
})
