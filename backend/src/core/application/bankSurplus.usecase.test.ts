// backend/src/core/application/bankSurplus.usecase.test.ts
import { BankSurplusUseCase } from './bankSurplus.usecase';
import { IBankingRepository } from '../ports/banking.repository';
import { IComplianceRepository } from '../ports/compliance.repository';
import { BankingRecord } from '../domain/banking.entity';
import { ShipCompliance } from '../domain/shipCompliance.entity';

// Mock repositories
class MockBankingRepository implements IBankingRepository {
  private savedBanking: BankingRecord | null = null;

  getSavedBanking(): BankingRecord | null {
    return this.savedBanking;
  }

  async save(banking: BankingRecord): Promise<BankingRecord> {
    this.savedBanking = banking;
    return banking;
  }

  async findByShipAndYear(shipId: string, year: number): Promise<BankingRecord | null> {
    return null;
  }

  async findActiveByShip(shipId: string): Promise<BankingRecord[]> {
    return [];
  }

  async update(bankingId: string, banking: Partial<BankingRecord>): Promise<BankingRecord> {
    throw new Error('Not implemented');
  }

  async markExpired(bankingId: string): Promise<void> {}

  async findExpiredRecords(currentYear: number): Promise<BankingRecord[]> {
    return [];
  }

  async getTotalBanked(shipId: string): Promise<number> {
    return 0;
  }

  async delete(bankingId: string): Promise<void> {}
}

class MockComplianceRepository implements IComplianceRepository {
  private mockCompliance: Map<string, ShipCompliance> = new Map();

  setMockCompliance(shipId: string, year: number, compliance: ShipCompliance) {
    this.mockCompliance.set(`${shipId}-${year}`, compliance);
  }

  async findByShipAndYear(shipId: string, year: number): Promise<ShipCompliance | null> {
    return this.mockCompliance.get(`${shipId}-${year}`) || null;
  }

  async save(compliance: ShipCompliance): Promise<ShipCompliance> {
    return compliance;
  }

  async update(complianceId: string, compliance: Partial<ShipCompliance>): Promise<ShipCompliance> {
    throw new Error('Not implemented');
  }

  async findByShip(shipId: string): Promise<ShipCompliance[]> {
    return [];
  }

  async findByYear(year: number): Promise<ShipCompliance[]> {
    return [];
  }

  async delete(complianceId: string): Promise<void> {}
}

describe('BankSurplusUseCase', () => {
  let useCase: BankSurplusUseCase;
  let bankingRepository: MockBankingRepository;
  let complianceRepository: MockComplianceRepository;

  beforeEach(() => {
    bankingRepository = new MockBankingRepository();
    complianceRepository = new MockComplianceRepository();
    useCase = new BankSurplusUseCase(bankingRepository, complianceRepository);
  });

  describe('Banking surplus scenario', () => {
    it('should bank surplus when compliance balance is positive', async () => {
      // Arrange
      const shipId = 'SHIP001';
      const year = 2025;
      const compliance: ShipCompliance = {
        complianceId: 'C001',
        shipId,
        year,
        complianceBalance: 50000000, // 50M MJ surplus
        status: 'surplus',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      complianceRepository.setMockCompliance(shipId, year, compliance);

      // Act
      const result = await useCase.execute(shipId, year);

      // Assert
      expect(result.bankedAmount).toBe(50000000);
      expect(result.expiryYear).toBe(2028); // year + 3
      expect(result.isExpired).toBe(false);

      const saved = bankingRepository.getSavedBanking();
      expect(saved).not.toBeNull();
      expect(saved?.shipId).toBe(shipId);
      expect(saved?.year).toBe(year);
      expect(saved?.bankedAmount).toBe(50000000);
      expect(saved?.expiryYear).toBe(2028);
    });
  });

  describe('No surplus scenario', () => {
    it('should throw error when compliance balance is zero', async () => {
      // Arrange
      const shipId = 'SHIP002';
      const year = 2025;
      const compliance: ShipCompliance = {
        complianceId: 'C002',
        shipId,
        year,
        complianceBalance: 0,
        status: 'compliant',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      complianceRepository.setMockCompliance(shipId, year, compliance);

      // Act & Assert
      await expect(useCase.execute(shipId, year)).rejects.toThrow(
        'No surplus available to bank'
      );
    });

    it('should throw error when compliance balance is negative', async () => {
      // Arrange
      const shipId = 'SHIP003';
      const year = 2025;
      const compliance: ShipCompliance = {
        complianceId: 'C003',
        shipId,
        year,
        complianceBalance: -10000000,
        status: 'deficit',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      complianceRepository.setMockCompliance(shipId, year, compliance);

      // Act & Assert
      await expect(useCase.execute(shipId, year)).rejects.toThrow(
        'No surplus available to bank'
      );
    });
  });

  describe('Compliance record not found', () => {
    it('should throw error when compliance record does not exist', async () => {
      // Arrange
      const shipId = 'SHIP999';
      const year = 2025;

      // Act & Assert
      await expect(useCase.execute(shipId, year)).rejects.toThrow(
        `Compliance record not found for ship ${shipId} in year ${year}`
      );
    });
  });
});
