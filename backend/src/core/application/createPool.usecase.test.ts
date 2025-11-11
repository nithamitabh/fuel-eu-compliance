// backend/src/core/application/createPool.usecase.test.ts
import { CreatePoolUseCase } from './createPool.usecase';
import { IPoolRepository } from '../ports/pool.repository';
import { IComplianceRepository } from '../ports/compliance.repository';
import { Pool, PoolMember } from '../domain/pool.entity';
import { ShipCompliance } from '../domain/shipCompliance.entity';

// Mock repositories
class MockPoolRepository implements IPoolRepository {
  private savedPool: Pool | null = null;
  private savedMembers: PoolMember[] = [];

  getSavedPool(): Pool | null {
    return this.savedPool;
  }

  getSavedMembers(): PoolMember[] {
    return this.savedMembers;
  }

  async save(pool: Pool): Promise<Pool> {
    this.savedPool = pool;
    return pool;
  }

  async addMember(member: PoolMember): Promise<PoolMember> {
    this.savedMembers.push(member);
    return member;
  }

  async findById(poolId: string): Promise<Pool | null> {
    return null;
  }

  async findByYear(year: number): Promise<Pool[]> {
    return [];
  }

  async findByShip(shipId: string): Promise<Pool[]> {
    return [];
  }

  async update(poolId: string, pool: Partial<Pool>): Promise<Pool> {
    throw new Error('Not implemented');
  }

  async delete(poolId: string): Promise<void> {}

  async removeMember(memberId: string): Promise<void> {}

  async findMembersByPool(poolId: string): Promise<PoolMember[]> {
    return [];
  }

  async updateMember(memberId: string, member: Partial<PoolMember>): Promise<PoolMember> {
    throw new Error('Not implemented');
  }
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

describe('CreatePoolUseCase', () => {
  let useCase: CreatePoolUseCase;
  let poolRepository: MockPoolRepository;
  let complianceRepository: MockComplianceRepository;

  beforeEach(() => {
    poolRepository = new MockPoolRepository();
    complianceRepository = new MockComplianceRepository();
    useCase = new CreatePoolUseCase(poolRepository, complianceRepository);
  });

  describe('Valid pool creation', () => {
    it('should create pool with total balance >= 0', async () => {
      // Arrange
      const poolName = 'Test Pool';
      const year = 2025;
      const shipIds = ['SHIP001', 'SHIP002', 'SHIP003'];

      const compliances: ShipCompliance[] = [
        {
          complianceId: 'C001',
          shipId: 'SHIP001',
          year,
          complianceBalance: 50000000, // +50M MJ
          status: 'surplus',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          complianceId: 'C002',
          shipId: 'SHIP002',
          year,
          complianceBalance: -20000000, // -20M MJ
          status: 'deficit',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          complianceId: 'C003',
          shipId: 'SHIP003',
          year,
          complianceBalance: -10000000, // -10M MJ
          status: 'deficit',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      compliances.forEach((c) => complianceRepository.setMockCompliance(c.shipId, year, c));

      // Act
      const result = await useCase.execute(poolName, year, shipIds);

      // Assert
      expect(result.pool.totalBalance).toBe(20000000); // 50M - 20M - 10M = 20M
      expect(result.pool.memberShips).toEqual(shipIds);
      expect(result.pool.year).toBe(year);

      const savedPool = poolRepository.getSavedPool();
      expect(savedPool).not.toBeNull();
      expect(savedPool?.poolName).toBe(poolName);
    });

    it('should apply greedy allocation to distribute surplus to deficits', async () => {
      // Arrange
      const poolName = 'Greedy Pool';
      const year = 2025;
      const shipIds = ['SHIP001', 'SHIP002', 'SHIP003'];

      const compliances: ShipCompliance[] = [
        {
          complianceId: 'C001',
          shipId: 'SHIP001',
          year,
          complianceBalance: 60000000, // +60M MJ surplus
          status: 'surplus',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          complianceId: 'C002',
          shipId: 'SHIP002',
          year,
          complianceBalance: -30000000, // -30M MJ deficit (larger)
          status: 'deficit',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          complianceId: 'C003',
          shipId: 'SHIP003',
          year,
          complianceBalance: -20000000, // -20M MJ deficit (smaller)
          status: 'deficit',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      compliances.forEach((c) => complianceRepository.setMockCompliance(c.shipId, year, c));

      // Act
      const result = await useCase.execute(poolName, year, shipIds);

      // Assert
      const members = poolRepository.getSavedMembers();
      expect(members).toHaveLength(3);

      // Greedy allocation: largest deficit first
      const ship2Member = members.find((m) => m.shipId === 'SHIP002');
      const ship3Member = members.find((m) => m.shipId === 'SHIP003');

      // SHIP002 should get 30M allocated (fully covered)
      expect(ship2Member?.allocatedDeficit).toBe(30000000);

      // SHIP003 should get remaining 30M allocated (fully covered)
      expect(ship3Member?.allocatedDeficit).toBe(20000000);

      // Total should be 10M surplus remaining
      expect(result.pool.totalBalance).toBe(10000000);
    });
  });

  describe('Invalid pool creation', () => {
    it('should throw error when total balance is negative', async () => {
      // Arrange
      const poolName = 'Invalid Pool';
      const year = 2025;
      const shipIds = ['SHIP001', 'SHIP002'];

      const compliances: ShipCompliance[] = [
        {
          complianceId: 'C001',
          shipId: 'SHIP001',
          year,
          complianceBalance: 10000000, // +10M MJ
          status: 'surplus',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          complianceId: 'C002',
          shipId: 'SHIP002',
          year,
          complianceBalance: -30000000, // -30M MJ
          status: 'deficit',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      compliances.forEach((c) => complianceRepository.setMockCompliance(c.shipId, year, c));

      // Act & Assert
      await expect(useCase.execute(poolName, year, shipIds)).rejects.toThrow(
        'Pool total balance must be non-negative'
      );
    });

    it('should throw error when ship compliance record not found', async () => {
      // Arrange
      const poolName = 'Incomplete Pool';
      const year = 2025;
      const shipIds = ['SHIP001', 'SHIP999']; // SHIP999 doesn't exist

      const compliance: ShipCompliance = {
        complianceId: 'C001',
        shipId: 'SHIP001',
        year,
        complianceBalance: 10000000,
        status: 'surplus',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      complianceRepository.setMockCompliance('SHIP001', year, compliance);

      // Act & Assert
      await expect(useCase.execute(poolName, year, shipIds)).rejects.toThrow(
        'Compliance record not found for ship SHIP999 in year 2025'
      );
    });
  });

  describe('Edge cases', () => {
    it('should handle pool with only surplus ships', async () => {
      // Arrange
      const poolName = 'Surplus Only Pool';
      const year = 2025;
      const shipIds = ['SHIP001', 'SHIP002'];

      const compliances: ShipCompliance[] = [
        {
          complianceId: 'C001',
          shipId: 'SHIP001',
          year,
          complianceBalance: 40000000,
          status: 'surplus',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          complianceId: 'C002',
          shipId: 'SHIP002',
          year,
          complianceBalance: 30000000,
          status: 'surplus',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      compliances.forEach((c) => complianceRepository.setMockCompliance(c.shipId, year, c));

      // Act
      const result = await useCase.execute(poolName, year, shipIds);

      // Assert
      expect(result.pool.totalBalance).toBe(70000000);
      const members = poolRepository.getSavedMembers();
      members.forEach((m) => expect(m.allocatedDeficit).toBe(0));
    });
  });
});
