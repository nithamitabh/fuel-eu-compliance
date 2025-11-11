// backend/src/core/application/applyBankedSurplus.usecase.ts
import { IBankingRepository } from '../ports/banking.repository';
import { IComplianceRepository } from '../ports/compliance.repository';

/**
 * Use case for applying banked surplus to cover current year deficit (Article 20)
 */
export class ApplyBankedSurplusUseCase {
  constructor(
    private readonly bankingRepository: IBankingRepository,
    private readonly complianceRepository: IComplianceRepository
  ) {}

  async execute(
    shipId: string,
    year: number
  ): Promise<{
    appliedAmount: number;
    remainingDeficit: number;
    remainingBanked: number;
  }> {
    // Fetch the compliance record for the ship and year
    const compliance = await this.complianceRepository.findByShipAndYear(shipId, year);

    if (!compliance) {
      throw new Error(`Compliance record not found for ship ${shipId} in year ${year}`);
    }

    // Check if there is a deficit to cover
    if (compliance.complianceBalance >= 0) {
      throw new Error('No deficit to apply banked surplus to');
    }

    // Fetch active (non-expired) banking records for the ship
    const bankingRecords = await this.bankingRepository.findActiveByShip(shipId);

    if (!bankingRecords || bankingRecords.length === 0) {
      throw new Error('No banked surplus available for ship');
    }

    // Sort banking records by year (oldest first - FIFO approach)
    const sortedRecords = bankingRecords.sort((a, b) => a.year - b.year);

    let deficitToResolve = Math.abs(compliance.complianceBalance);
    let totalApplied = 0;
    let totalRemainingBanked = 0;

    // Apply banked surplus to cover deficit
    for (const record of sortedRecords) {
      if (deficitToResolve <= 0) {
        // Deficit fully covered, add remaining banked amounts
        totalRemainingBanked += record.bankedAmount;
        continue;
      }

      if (record.bankedAmount >= deficitToResolve) {
        // This record can fully cover the remaining deficit
        totalApplied += deficitToResolve;
        const remaining = record.bankedAmount - deficitToResolve;
        totalRemainingBanked += remaining;

        // Update banking record
        await this.bankingRepository.update(record.bankingId, {
          bankedAmount: remaining,
          updatedAt: new Date(),
        });

        deficitToResolve = 0;
      } else {
        // This record partially covers the deficit
        totalApplied += record.bankedAmount;
        deficitToResolve -= record.bankedAmount;

        // Update banking record to zero
        await this.bankingRepository.update(record.bankingId, {
          bankedAmount: 0,
          updatedAt: new Date(),
        });
      }
    }

    // Update compliance record
    const newComplianceBalance = compliance.complianceBalance + totalApplied;
    const newStatus: 'surplus' | 'deficit' | 'compliant' =
      newComplianceBalance > 0 ? 'surplus' : newComplianceBalance < 0 ? 'deficit' : 'compliant';

    await this.complianceRepository.update(compliance.complianceId, {
      complianceBalance: newComplianceBalance,
      status: newStatus,
      updatedAt: new Date(),
    });

    return {
      appliedAmount: totalApplied,
      remainingDeficit: deficitToResolve,
      remainingBanked: totalRemainingBanked,
    };
  }
}
