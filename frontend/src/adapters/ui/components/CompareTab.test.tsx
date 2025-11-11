/**
 * Tests for CompareTab Component
 * Tests rendering of comparison data, loading states, error states, and calculations
 */

import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { CompareTab } from './CompareTab'
import { useComparison } from '../../../core/application'
import type { Route } from '../../../core/domain'

// Mock the useComparison hook
vi.mock('../../../core/application', () => ({
  useComparison: vi.fn(),
}))

// Mock Recharts to avoid canvas/SVG rendering issues in tests
vi.mock('recharts', () => ({
  BarChart: ({ children }: { children: React.ReactNode }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive-container">{children}</div>,
}))

describe('CompareTab Component', () => {
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

  it('should render loading state', () => {
    vi.mocked(useComparison).mockReturnValue({
      comparisonData: [],
      loading: true,
      error: null,
      refetch: vi.fn(),
    })

    render(<CompareTab />)

    expect(screen.getByText('Loading comparison data...')).toBeInTheDocument()
  })

  it('should render error state', () => {
    const mockRefetch = vi.fn()
    vi.mocked(useComparison).mockReturnValue({
      comparisonData: [],
      loading: false,
      error: 'Failed to load comparison',
      refetch: mockRefetch,
    })

    render(<CompareTab />)

    expect(screen.getByText('Error Loading Comparison')).toBeInTheDocument()
    expect(screen.getByText('Failed to load comparison')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
  })

  it('should render comparison data with KPIs and table', async () => {
    vi.mocked(useComparison).mockReturnValue({
      comparisonData: mockComparisonData,
      loading: false,
      error: null,
      refetch: vi.fn(),
    })

    render(<CompareTab />)

    await waitFor(() => {
      // Check KPI cards
      expect(screen.getByText('Target Intensity')).toBeInTheDocument()
      expect(screen.getByText('Baseline Average')).toBeInTheDocument()
      expect(screen.getByText('Current Average')).toBeInTheDocument()

      // Check for baseline and current route indicators
      expect(screen.getByText('Baseline')).toBeInTheDocument()
      expect(screen.getByText('Current')).toBeInTheDocument()

      // Check route counts
      expect(screen.getByText('1 baseline routes')).toBeInTheDocument()
      expect(screen.getByText('1 current routes')).toBeInTheDocument()
    })
  })

  it('should display empty state when no comparison data', () => {
    vi.mocked(useComparison).mockReturnValue({
      comparisonData: [],
      loading: false,
      error: null,
      refetch: vi.fn(),
    })

    render(<CompareTab />)

    expect(screen.getByText('No comparison data')).toBeInTheDocument()
    expect(screen.getByText('Add routes to start comparing.')).toBeInTheDocument()
  })

  it('should handle non-array comparisonData gracefully (defensive programming)', () => {
    vi.mocked(useComparison as Mock).mockReturnValue({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      comparisonData: null as any,
      loading: false,
      error: null,
      refetch: vi.fn(),
    })

    render(<CompareTab />)

    // Should show empty state instead of crashing
    expect(screen.getByText('No comparison data')).toBeInTheDocument()
  })

  it('should calculate averages correctly', async () => {
    vi.mocked(useComparison).mockReturnValue({
      comparisonData: mockComparisonData,
      loading: false,
      error: null,
      refetch: vi.fn(),
    })

    render(<CompareTab />)

    await waitFor(() => {
      // Baseline average = 91.0
      expect(screen.getByText('91.0000')).toBeInTheDocument()
      // Current average = 74.0
      expect(screen.getByText('74.0000')).toBeInTheDocument()
    })
  })

  it('should display compliance indicators', async () => {
    vi.mocked(useComparison).mockReturnValue({
      comparisonData: mockComparisonData,
      loading: false,
      error: null,
      refetch: vi.fn(),
    })

    render(<CompareTab />)

    await waitFor(() => {
      // Should have both compliant and non-compliant indicators
      const emojis = screen.getAllByText(/✅|❌/)
      expect(emojis.length).toBeGreaterThan(0)
    })
  })

  it('should render chart components', async () => {
    vi.mocked(useComparison).mockReturnValue({
      comparisonData: mockComparisonData,
      loading: false,
      error: null,
      refetch: vi.fn(),
    })

    render(<CompareTab />)

    await waitFor(() => {
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument()
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
    })
  })
})
