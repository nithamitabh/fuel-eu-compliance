// backend/src/core/domain/constants.ts
// FuelEU Maritime Regulation constants

export const FuelEUConstants = {
  // Target GHG intensity in gCO2eq/MJ
  TARGET_INTENSITY: 89.3368,
  
  // Energy content per ton of fuel in MJ/ton
  ENERGY_PER_TON: 41000,
  
  // Banking expiry period in years (Article 20)
  BANKING_EXPIRY_YEARS: 3,
  
  // Maximum borrowing allowed (as a percentage of annual compliance balance)
  MAX_BORROWING_PERCENTAGE: 0.05, // 5%
} as const;
