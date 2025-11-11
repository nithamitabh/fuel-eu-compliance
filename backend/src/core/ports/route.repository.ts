// backend/src/core/ports/route.repository.ts
import { Route } from '../domain/route.entity';

// Interface for RouteRepository port
export interface IRouteRepository {
  getAll(): Promise<Route[]>;
  findById(id: string): Promise<Route | null>;
  findByShipAndYear(shipId: string, year: number): Promise<Route[]>;
  setBaseline(id: string): Promise<void>;
  getComparisonData(): Promise<{ baseline: Route; comparisons: Route[] }>;
  create(route: Route): Promise<Route>;
  update(id: string, route: Partial<Route>): Promise<Route>;
  delete(id: string): Promise<void>;
}
