/**
 * Domain Entity: Route
 * Represents a vessel route with fuel consumption and emissions data
 * Mirrors backend domain entity for type consistency
 */

export type Route = {
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number; // gCO2e/MJ
  fuelConsumption: number; // tons
  distance: number; // nautical miles
  totalEmissions: number; // gCO2e
  isBaseline: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type RouteCreateInput = Omit<Route, 'routeId' | 'createdAt' | 'updatedAt'>;

export type RouteUpdateInput = Partial<RouteCreateInput>;
