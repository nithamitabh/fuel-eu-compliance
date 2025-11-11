/**
 * Infrastructure Adapter: ApiClient
 * Implements IComplianceApi port using axios
 * Handles HTTP communication with the backend API
 */

import axios, { type AxiosInstance, type AxiosError } from 'axios';
import type { IComplianceApi } from '../../../core/ports';
import type {
  Route,
  RouteCreateInput,
  RouteUpdateInput,
  ShipCompliance,
  ComputeComplianceInput,
  ComputeComplianceResult,
  BankingRecord,
  BankSurplusInput,
  ApplyBankedSurplusInput,
  BankingResult,
  Pool,
  PoolMember,
  CreatePoolInput,
  PoolResult,
} from '../../../core/domain';

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  statusCode?: number;
  originalError?: AxiosError;

  constructor(
    message: string,
    statusCode?: number,
    originalError?: AxiosError
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.originalError = originalError;
  }
}

/**
 * ApiClient implementation
 * Singleton pattern for consistent axios instance
 */
export class ApiClient implements IComplianceApi {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string = 'http://localhost:3000/api') {
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        return Promise.reject(this.handleError(error));
      }
    );
  }

  /**
   * Centralized error handler
   */
  private handleError(error: AxiosError): ApiError {
    if (error.response) {
      // Server responded with error status
      const message =
        (error.response.data as { message?: string })?.message ||
        `Request failed with status ${error.response.status}`;
      return new ApiError(message, error.response.status, error);
    } else if (error.request) {
      // Request made but no response received
      return new ApiError('No response from server. Please check your connection.', undefined, error);
    } else {
      // Error in request configuration
      return new ApiError(error.message || 'An unexpected error occurred', undefined, error);
    }
  }

  // ==================== Routes Endpoints ====================

  async getRoutes(): Promise<Route[]> {
    const response = await this.axiosInstance.get<{ success: boolean; data: Route[] }>('/routes');
    return response.data.data;
  }

  async getRouteById(routeId: string): Promise<Route> {
    const response = await this.axiosInstance.get<{ success: boolean; data: Route }>(`/routes/${routeId}`);
    return response.data.data;
  }

  async createRoute(data: RouteCreateInput): Promise<Route> {
    const response = await this.axiosInstance.post<{ success: boolean; data: Route }>('/routes', data);
    return response.data.data;
  }

  async updateRoute(routeId: string, data: RouteUpdateInput): Promise<Route> {
    const response = await this.axiosInstance.put<{ success: boolean; data: Route }>(`/routes/${routeId}`, data);
    return response.data.data;
  }

  async deleteRoute(routeId: string): Promise<void> {
    await this.axiosInstance.delete(`/routes/${routeId}`);
  }

  async getRouteComparison(): Promise<Route[]> {
    const response = await this.axiosInstance.get<{ success: boolean; data: Route[] }>('/routes/comparison/data');
    return response.data.data;
  }

  // ==================== Compliance Endpoints ====================

  async getShipCompliance(shipId: string, year: number): Promise<ShipCompliance> {
    const response = await this.axiosInstance.get<{ success: boolean; data: ShipCompliance }>(
      `/compliance/ship/${shipId}/year/${year}`
    );
    return response.data.data;
  }

  async computeCompliance(data: ComputeComplianceInput): Promise<ComputeComplianceResult> {
    const response = await this.axiosInstance.post<{ success: boolean; data: ComputeComplianceResult }>(
      '/compliance/compute',
      data
    );
    return response.data.data;
  }

  async getShipComplianceHistory(shipId: string): Promise<ShipCompliance[]> {
    const response = await this.axiosInstance.get<{ success: boolean; data: ShipCompliance[] }>(
      `/compliance/ship/${shipId}`
    );
    return response.data.data;
  }

  async getYearCompliance(year: number): Promise<ShipCompliance[]> {
    const response = await this.axiosInstance.get<{ success: boolean; data: ShipCompliance[] }>(
      `/compliance/year/${year}`
    );
    return response.data.data;
  }

  // ==================== Banking Endpoints ====================

  async getBankingRecords(shipId: string): Promise<BankingRecord[]> {
    const response = await this.axiosInstance.get<{ success: boolean; data: BankingRecord[] }>(
      `/banking/ship/${shipId}`
    );
    return response.data.data;
  }

  async bankSurplus(data: BankSurplusInput): Promise<BankingResult> {
    const response = await this.axiosInstance.post<{ success: boolean; data: BankingResult }>('/banking/bank', data);
    return response.data.data;
  }

  async applyBankedSurplus(data: ApplyBankedSurplusInput): Promise<ShipCompliance> {
    const response = await this.axiosInstance.post<{ success: boolean; data: ShipCompliance }>(
      '/banking/apply',
      data
    );
    return response.data.data;
  }

  async getAvailableSurplus(shipId: string): Promise<BankingRecord[]> {
    const response = await this.axiosInstance.get<{ success: boolean; data: BankingRecord[] }>(
      `/banking/ship/${shipId}/available`
    );
    return response.data.data;
  }

  // ==================== Pool Endpoints ====================

  async getPools(): Promise<Pool[]> {
    const response = await this.axiosInstance.get<{ success: boolean; data: Pool[] }>('/pools');
    return response.data.data;
  }

  async getPoolById(poolId: string): Promise<PoolResult> {
    const response = await this.axiosInstance.get<{ success: boolean; data: PoolResult }>(`/pools/${poolId}`);
    return response.data.data;
  }

  async createPool(data: CreatePoolInput): Promise<PoolResult> {
    const response = await this.axiosInstance.post<{ success: boolean; data: PoolResult }>('/pools', data);
    return response.data.data;
  }

  async getPoolMembers(poolId: string): Promise<PoolMember[]> {
    const response = await this.axiosInstance.get<{ success: boolean; data: PoolMember[] }>(
      `/pools/${poolId}/members`
    );
    return response.data.data;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
