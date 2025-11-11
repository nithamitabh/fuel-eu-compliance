// backend/src/core/application/bankSurplus.usecase.ts
import { IBankingRepository } from '../ports/banking.repository';
import { IComplianceRepository } from '../ports/compliance.repository';
import { BankingRecord } from '../domain/banking.entity';
import { FuelEUConstants } from '../domain/constants';
import { randomUUID } from 'crypto';

/**
 * Use case for banking surplus compliance balance (Article 20)
 * Allows ships to bank surplus for use in future years (up to 3 years)
 */
export class BankSurplusUseCase {
  constructor(
    private readonly bankingRepository: IBankingRepository,
    private readonly complianceRepository: IComplianceRepository
  ) {}

  async execute(shipId: string, year: number): Promise<BankingRecord> {
    // Fetch the compliance record for the ship and year
    const compliance = await this.complianceRepository.findByShipAndYear(shipId, year);

    if (!compliance) {
      throw new Error(`Compliance record not found for ship ${shipId} in year ${year}`);
    }

    // Check if there is a surplus to bank
    if (compliance.complianceBalance <= 0) {
      throw new Error('No surplus available to bank');
    }

    // Create banking record
    const bankingRecord: BankingRecord = {
      bankingId: randomUUID(),
      shipId,
      year,
      bankedAmount: compliance.complianceBalance,
      expiryYear: year + FuelEUConstants.BANKING_EXPIRY_YEARS,
      isExpired: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save the banking record
    await this.bankingRepository.save(bankingRecord);

    return bankingRecord;
  }
}
