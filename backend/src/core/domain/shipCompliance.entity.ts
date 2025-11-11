// backend/src/core/domain/shipCompliance.entity.ts
// Ship Compliance entity tracking compliance balance for a ship in a given year

export type ShipCompliance = {
  complianceId: string;
  shipId: string;
  year: number;
  complianceBalance: number; // in MJ
  status: 'surplus' | 'deficit' | 'compliant';
  createdAt: Date;
  updatedAt: Date;
};
