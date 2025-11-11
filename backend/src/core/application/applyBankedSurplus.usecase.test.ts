// backend/src/core/application/applyBankedSurplus.usecase.test.ts
import { ApplyBankedSurplusUseCase } from './applyBankedSurplus.usecase';
import { IBankingRepository } from '../ports/banking.repository';
import { IComplianceRepository } from '../ports/compliance.repository';
import { BankingRecord } from '../domain/banking.entity';
import { ShipCompliance } from '../domain/shipCompliance.entity';

// Mock repositories
class MockBankingRepository implements IBankingRepository {
  private mockBankingRecords: BankingRecord[] = [];

  setMockBankingRecords(records: BankingRecord[]) {
    this.mockBankingRecords = records;
  }

  async findActiveByShip(shipId: string): Promise<BankingRecord[]> {
    return this.mockBankingRecords.filter(
      (r) => r.shipId === shipId && !r.isExpired
    );
  }

  async update(bankingId: string, banking: Partial<BankingRecord>): Promise<BankingRecord> {
    const record = this.mockBankingRecords.find((r) => r.bankingId === bankingId);
    if (!record) throw new Error('Record not found');
    Object.assign(record, banking);
    return record;
  }

  async findByShipAndYear(shipId: string, year: number): Promise<BankingRecord | null> {
    return null;
  }

  async save(banking: BankingRecord): Promise<BankingRecord> {
    return banking;
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
  private updatedCompliance: ShipCompliance | null = null;

  setMockCompliance(shipId: string, year: number, compliance: ShipCompliance) {
    this.mockCompliance.set(`${shipId}-${year}`, compliance);
  }

  getUpdatedCompliance(): ShipCompliance | null {
    return this.updatedCompliance;
  }

  async findByShipAndYear(shipId: string, year: number): Promise<ShipCompliance | null> {
    return this.mockCompliance.get(`${shipId}-${year}`) || null;
  }

  async update(complianceId: string, compliance: Partial<ShipCompliance>): Promise<ShipCompliance> {
    const existing = Array.from(this.mockCompliance.values()).find(
      (c) => c.complianceId === complianceId
    );
    if (!existing) throw new Error('Compliance not found');
    Object.assign(existing, compliance);
    this.updatedCompliance = existing;
    return existing;
  }

  async save(compliance: ShipCompliance): Promise<ShipCompliance> {
    return compliance;
  }

  async findByShip(shipId: string): Promise<ShipCompliance[]> {
    return [];
  }

  async findByYear(year: number): Promise<ShipCompliance[]> {
    return [];
  }

  async delete(complianceId: string): Promise<void> {}
}

describe('ApplyBankedSurplusUseCase', () => {
  let useCase: ApplyBankedSurplusUseCase;
  let bankingRepository: MockBankingRepository;
  let complianceRepository: MockComplianceRepository;

  beforeEach(() => {
    bankingRepository = new MockBankingRepository();
    complianceRepository = new MockComplianceRepository();
    useCase = new ApplyBankedSurplusUseCase(bankingRepository, complianceRepository);
  });

  describe('Apply banked surplus to deficit', () => {
    it('should fully cover deficit with banked surplus', async () => {
      // Arrange
      const shipId = 'SHIP001';
      const year = 2026;

      const compliance: ShipCompliance = {
        complianceId: 'C001',
        shipId,
        year,
        complianceBalance: -30000000, // 30M MJ deficit
        status: 'deficit',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const bankingRecords: BankingRecord[] = [
        {
          bankingId: 'B001',
          shipId,
          year: 2025,
          bankedAmount: 50000000, // 50M MJ banked
          expiryYear: 2028,
          isExpired: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      complianceRepository.setMockCompliance(shipId, year, compliance);
      bankingRepository.setMockBankingRecords(bankingRecords);

      // Act
      const result = await useCase.execute(shipId, year);

      // Assert
      expect(result.appliedAmount).toBe(30000000);
      expect(result.remainingDeficit).toBe(0);
      expect(result.remainingBanked).toBe(20000000); // 50M - 30M

      const updated = complianceRepository.getUpdatedCompliance();
      expect(updated?.complianceBalance).toBe(0);
      expect(updated?.status).toBe('compliant');
    });

    it('should partially cover deficit when banked surplus is insufficient', async () => {
      // Arrange
      const shipId = 'SHIP002';
      const year = 2026;

      const compliance: ShipCompliance = {
        complianceId: 'C002',
        shipId,
        year,
        complianceBalance: -50000000, // 50M MJ deficit
        status: 'deficit',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const bankingRecords: BankingRecord[] = [
        {
          bankingId: 'B002',
          shipId,
          year: 2025,
          bankedAmount: 20000000, // Only 20M MJ banked
          expiryYear: 2028,
          isExpired: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      complianceRepository.setMockCompliance(shipId, year, compliance);
      bankingRepository.setMockBankingRecords(bankingRecords);

      // Act
      const result = await useCase.execute(shipId, year);

      // Assert
      expect(result.appliedAmount).toBe(20000000);
      expect(result.remainingDeficit).toBe(30000000); // 50M - 20M
      expect(result.remainingBanked).toBe(0);

      const updated = complianceRepository.getUpdatedCompliance();
      expect(updated?.complianceBalance).toBe(-30000000);
      expect(updated?.status).toBe('deficit');
    });
  });

  describe('No deficit scenario', () => {
    it('should throw error when compliance balance is positive', async () => {
      // Arrange
      const shipId = 'SHIP003';
      const year = 2026;

      const compliance: ShipCompliance = {
        complianceId: 'C003',
        shipId,
        year,
        complianceBalance: 10000000,
        status: 'surplus',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      complianceRepository.setMockCompliance(shipId, year, compliance);

      // Act & Assert
      await expect(useCase.execute(shipId, year)).rejects.toThrow(
        'No deficit to apply banked surplus to'
      );
    });
  });

  describe('No banked surplus available', () => {
    it('should throw error when no active banking records exist', async () => {
      // Arrange
      const shipId = 'SHIP004';
      const year = 2026;

      const compliance: ShipCompliance = {
        complianceId: 'C004',
        shipId,
        year,
        complianceBalance: -20000000,
        status: 'deficit',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      complianceRepository.setMockCompliance(shipId, year, compliance);
      bankingRepository.setMockBankingRecords([]);

      // Act & Assert
      await expect(useCase.execute(shipId, year)).rejects.toThrow(
        'No banked surplus available for ship'
      );
    });
  });
});
