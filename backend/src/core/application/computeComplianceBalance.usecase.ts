// backend/src/core/application/computeComplianceBalance.usecase.ts
import { IRouteRepository } from '../ports/route.repository';
import { IComplianceRepository } from '../ports/compliance.repository';
import { ShipCompliance } from '../domain/shipCompliance.entity';
import { FuelEUConstants } from '../domain/constants';
import { randomUUID } from 'crypto';

export class ComputeComplianceBalanceUseCase {
  constructor(
    private readonly routeRepository: IRouteRepository,
    private readonly complianceRepository: IComplianceRepository
  ) {}

  async execute(shipId: string, year: number): Promise<number> {
    // Fetch all routes for the ship in the given year
    const routes = await this.routeRepository.findByShipAndYear(shipId, year);

    if (!routes || routes.length === 0) {
      throw new Error(`No routes found for ship ${shipId} in year ${year}`);
    }

    // Calculate compliance balance for each route and aggregate
    let totalComplianceBalance = 0;

    for (const route of routes) {
      // Formula: CB = (TARGET_INTENSITY - actual_ghgIntensity) * (fuelConsumption * ENERGY_PER_TON)
      const intensityDifference = FuelEUConstants.TARGET_INTENSITY - route.ghgIntensity;
      const totalEnergy = route.fuelConsumption * FuelEUConstants.ENERGY_PER_TON;
      const routeComplianceBalance = intensityDifference * totalEnergy;

      totalComplianceBalance += routeComplianceBalance;
    }

    // Determine compliance status
    let status: 'surplus' | 'deficit' | 'compliant';
    if (totalComplianceBalance > 0) {
      status = 'surplus';
    } else if (totalComplianceBalance < 0) {
      status = 'deficit';
    } else {
      status = 'compliant';
    }

    // Save the compliance record
    const compliance: ShipCompliance = {
      complianceId: randomUUID(),
      shipId,
      year,
      complianceBalance: totalComplianceBalance,
      status,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.complianceRepository.save(compliance);

    return totalComplianceBalance;
  }
}
