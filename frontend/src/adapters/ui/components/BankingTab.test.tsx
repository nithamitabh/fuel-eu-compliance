/**
 * Tests for BankingTab Component
 * Tests rendering of banking operations interface
 */

import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BankingTab } from './BankingTab'
import { useBanking, useCompliance } from '../../../core/application'

// Mock the useBanking and useCompliance hooks
vi.mock('../../../core/application', () => ({
  useBanking: vi.fn(),
  useCompliance: vi.fn(),
}))

describe('BankingTab Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render banking tab with header', () => {
    vi.mocked(useBanking).mockReturnValue({
      bankingRecords: [],
      loading: false,
      error: null,
      fetchBankingRecords: vi.fn(),
      bankSurplus: vi.fn(),
      applyBankedSurplus: vi.fn(),
      getAvailableSurplus: vi.fn(),
    })

    vi.mocked(useCompliance).mockReturnValue({
      complianceData: null,
      complianceHistory: [],
      loading: false,
      error: null,
      computeCompliance: vi.fn(),
      fetchShipCompliance: vi.fn(),
      fetchComplianceHistory: vi.fn(),
      fetchYearCompliance: vi.fn(),
    })

    render(<BankingTab />)

    expect(screen.getByText(/Banking Operations/i)).toBeInTheDocument()
    expect(screen.getAllByText(/Bank Surplus/i).length).toBeGreaterThan(0)
  })

  it('should render forms for banking operations', () => {
    vi.mocked(useBanking).mockReturnValue({
      bankingRecords: [],
      loading: false,
      error: null,
      fetchBankingRecords: vi.fn(),
      bankSurplus: vi.fn(),
      applyBankedSurplus: vi.fn(),
      getAvailableSurplus: vi.fn(),
    })

    vi.mocked(useCompliance).mockReturnValue({
      complianceData: null,
      complianceHistory: [],
      loading: false,
      error: null,
      computeCompliance: vi.fn(),
      fetchShipCompliance: vi.fn(),
      fetchComplianceHistory: vi.fn(),
      fetchYearCompliance: vi.fn(),
    })

    render(<BankingTab />)

    // Should have banking operation interface
    expect(screen.getByText(/Banking Operations/i)).toBeInTheDocument()
  })

  it('should handle loading state', () => {
    vi.mocked(useBanking).mockReturnValue({
      bankingRecords: [],
      loading: true,
      error: null,
      fetchBankingRecords: vi.fn(),
      bankSurplus: vi.fn(),
      applyBankedSurplus: vi.fn(),
      getAvailableSurplus: vi.fn(),
    })

    vi.mocked(useCompliance).mockReturnValue({
      complianceData: null,
      complianceHistory: [],
      loading: false,
      error: null,
      computeCompliance: vi.fn(),
      fetchShipCompliance: vi.fn(),
      fetchComplianceHistory: vi.fn(),
      fetchYearCompliance: vi.fn(),
    })

    render(<BankingTab />)

    // Component should still render during loading
    expect(screen.getByText(/Banking Operations/i)).toBeInTheDocument()
  })
})
