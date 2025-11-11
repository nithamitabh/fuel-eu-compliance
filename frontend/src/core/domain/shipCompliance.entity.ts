/**
 * Domain Entity: ShipCompliance
 * Represents compliance status for a ship in a given year
 * Mirrors backend domain entity
 */

export type ComplianceStatus = 'SURPLUS' | 'DEFICIT' | 'COMPLIANT';

export type ShipCompliance = {
  complianceId: string;
  shipId: string;
  year: number;
  complianceBalance: number;
  status: ComplianceStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type ComputeComplianceInput = {
  shipId: string;
  year: number;
};

export type ComputeComplianceResult = {
  complianceId: string;
  shipId: string;
  year: number;
  complianceBalance: number;
  status: ComplianceStatus;
};
