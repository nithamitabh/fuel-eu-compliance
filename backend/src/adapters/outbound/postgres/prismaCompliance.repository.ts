// backend/src/adapters/outbound/postgres/prismaCompliance.repository.ts
import { PrismaClient } from '@prisma/client';
import { IComplianceRepository } from '../../../core/ports/compliance.repository';
import { ShipCompliance } from '../../../core/domain/shipCompliance.entity';

export class PrismaComplianceRepository implements IComplianceRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByShipAndYear(shipId: string, year: number): Promise<ShipCompliance | null> {
    const compliance = await this.prisma.shipCompliance.findUnique({
      where: {
        ship_id_year: {
          ship_id: shipId,
          year,
        },
      },
    });
    return compliance ? this.toDomain(compliance) : null;
  }

  async save(compliance: ShipCompliance): Promise<ShipCompliance> {
    const saved = await this.prisma.shipCompliance.create({
      data: {
        compliance_id: compliance.complianceId,
        ship_id: compliance.shipId,
        year: compliance.year,
        compliance_balance: compliance.complianceBalance,
        status: compliance.status,
      },
    });
    return this.toDomain(saved);
  }

  async update(complianceId: string, compliance: Partial<ShipCompliance>): Promise<ShipCompliance> {
    const updated = await this.prisma.shipCompliance.update({
      where: { compliance_id: complianceId },
      data: {
        compliance_balance: compliance.complianceBalance,
        status: compliance.status,
      },
    });
    return this.toDomain(updated);
  }

  async findByShip(shipId: string): Promise<ShipCompliance[]> {
    const compliances = await this.prisma.shipCompliance.findMany({
      where: { ship_id: shipId },
      orderBy: { year: 'desc' },
    });
    return compliances.map(this.toDomain);
  }

  async findByYear(year: number): Promise<ShipCompliance[]> {
    const compliances = await this.prisma.shipCompliance.findMany({
      where: { year },
      orderBy: { ship_id: 'asc' },
    });
    return compliances.map(this.toDomain);
  }

  async delete(complianceId: string): Promise<void> {
    await this.prisma.shipCompliance.delete({
      where: { compliance_id: complianceId },
    });
  }

  private toDomain(prismaCompliance: any): ShipCompliance {
    return {
      complianceId: prismaCompliance.compliance_id,
      shipId: prismaCompliance.ship_id,
      year: prismaCompliance.year,
      complianceBalance: prismaCompliance.compliance_balance,
      status: prismaCompliance.status as 'surplus' | 'deficit' | 'compliant',
      createdAt: prismaCompliance.created_at,
      updatedAt: prismaCompliance.updated_at,
    };
  }
}
