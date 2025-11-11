// backend/src/core/ports/compliance.repository.ts
import { ShipCompliance } from '../domain/shipCompliance.entity';

// Interface for ComplianceRepository port
export interface IComplianceRepository {
  findByShipAndYear(shipId: string, year: number): Promise<ShipCompliance | null>;
  save(compliance: ShipCompliance): Promise<ShipCompliance>;
  update(complianceId: string, compliance: Partial<ShipCompliance>): Promise<ShipCompliance>;
  findByShip(shipId: string): Promise<ShipCompliance[]>;
  findByYear(year: number): Promise<ShipCompliance[]>;
  delete(complianceId: string): Promise<void>;
}
