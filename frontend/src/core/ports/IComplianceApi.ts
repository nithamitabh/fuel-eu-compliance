/**
 * Port: IComplianceApi
 * Defines the contract for API communication with the backend
 * Follows hexagonal architecture - domain is independent of implementation
 */

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
} from '../domain';

export interface IComplianceApi {
  // Routes endpoints
  getRoutes(): Promise<Route[]>;
  getRouteById(routeId: string): Promise<Route>;
  createRoute(data: RouteCreateInput): Promise<Route>;
  updateRoute(routeId: string, data: RouteUpdateInput): Promise<Route>;
  deleteRoute(routeId: string): Promise<void>;
  getRouteComparison(): Promise<Route[]>;

  // Compliance endpoints
  getShipCompliance(shipId: string, year: number): Promise<ShipCompliance>;
  computeCompliance(data: ComputeComplianceInput): Promise<ComputeComplianceResult>;
  getShipComplianceHistory(shipId: string): Promise<ShipCompliance[]>;
  getYearCompliance(year: number): Promise<ShipCompliance[]>;

  // Banking endpoints
  getBankingRecords(shipId: string): Promise<BankingRecord[]>;
  bankSurplus(data: BankSurplusInput): Promise<BankingResult>;
  applyBankedSurplus(data: ApplyBankedSurplusInput): Promise<ShipCompliance>;
  getAvailableSurplus(shipId: string): Promise<BankingRecord[]>;

  // Pool endpoints
  getPools(): Promise<Pool[]>;
  getPoolById(poolId: string): Promise<PoolResult>;
  createPool(data: CreatePoolInput): Promise<PoolResult>;
  getPoolMembers(poolId: string): Promise<PoolMember[]>;
}
