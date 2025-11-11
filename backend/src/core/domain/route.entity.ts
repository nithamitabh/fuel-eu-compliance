// backend/src/core/domain/route.entity.ts
// A FuelEU Route entity with fields: routeId (string), vesselType (string),
// fuelType (string), year (number), ghgIntensity (number),
// fuelConsumption (number), distance (number), totalEmissions (number), isBaseline (boolean)

export type Route = {
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;
  fuelConsumption: number;
  distance: number;
  totalEmissions: number;
  isBaseline: boolean;
};
