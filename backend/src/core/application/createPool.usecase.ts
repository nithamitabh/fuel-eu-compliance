// backend/src/core/application/createPool.usecase.ts
import { IPoolRepository } from '../ports/pool.repository';
import { IComplianceRepository } from '../ports/compliance.repository';
import { Pool, PoolMember } from '../domain/pool.entity';
import { randomUUID } from 'crypto';

/**
 * Use case for creating compliance pools (Article 21)
 * Allows multiple ships to pool their compliance balances
 * Uses greedy allocation to distribute surplus to deficits
 */
export class CreatePoolUseCase {
  constructor(
    private readonly poolRepository: IPoolRepository,
    private readonly complianceRepository: IComplianceRepository
  ) {}

  async execute(
    poolName: string,
    year: number,
    shipIds: string[]
  ): Promise<{
    pool: Pool;
    members: PoolMember[];
  }> {
    // Fetch compliance records for all ships
    const complianceRecords = await Promise.all(
      shipIds.map(async (shipId) => {
        const compliance = await this.complianceRepository.findByShipAndYear(shipId, year);
        if (!compliance) {
          throw new Error(`Compliance record not found for ship ${shipId} in year ${year}`);
        }
        return compliance;
      })
    );

    // Calculate total balance
    const totalBalance = complianceRecords.reduce(
      (sum, record) => sum + record.complianceBalance,
      0
    );

    // Validate that total balance is non-negative (Article 21 requirement)
    if (totalBalance < 0) {
      throw new Error('Pool total balance must be non-negative');
    }

    // Create the pool
    const pool: Pool = {
      poolId: randomUUID(),
      poolName,
      year,
      memberShips: shipIds,
      totalBalance,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.poolRepository.save(pool);

    // Greedy allocation: Allocate surplus to deficits starting with largest deficit
    const members = await this.allocateDeficits(pool.poolId, complianceRecords);

    return { pool, members };
  }

  /**
   * Greedy allocation algorithm:
   * 1. Separate ships into surplus and deficit groups
   * 2. Sort deficits by size (largest first)
   * 3. Allocate available surplus to deficits in order
   */
  private async allocateDeficits(
    poolId: string,
    complianceRecords: Array<{
      shipId: string;
      complianceBalance: number;
      complianceId: string;
    }>
  ): Promise<PoolMember[]> {
    const members: PoolMember[] = [];

    // Separate surplus and deficit ships
    const deficitShips = complianceRecords.filter((r) => r.complianceBalance < 0);
    const surplusShips = complianceRecords.filter((r) => r.complianceBalance >= 0);

    // Calculate total available surplus
    let availableSurplus = surplusShips.reduce(
      (sum, ship) => sum + ship.complianceBalance,
      0
    );

    // Sort deficit ships by deficit size (largest first - greedy approach)
    const sortedDeficits = deficitShips.sort(
      (a, b) => Math.abs(b.complianceBalance) - Math.abs(a.complianceBalance)
    );

    // Allocate surplus to deficits
    for (const deficitShip of sortedDeficits) {
      const deficitAmount = Math.abs(deficitShip.complianceBalance);
      let allocated = 0;

      if (availableSurplus >= deficitAmount) {
        // Can fully cover this deficit
        allocated = deficitAmount;
        availableSurplus -= deficitAmount;
      } else {
        // Partially cover with remaining surplus
        allocated = availableSurplus;
        availableSurplus = 0;
      }

      const member: PoolMember = {
        memberId: randomUUID(),
        poolId,
        shipId: deficitShip.shipId,
        contributionBalance: deficitShip.complianceBalance,
        allocatedDeficit: allocated,
        joinedAt: new Date(),
      };

      members.push(member);
      await this.poolRepository.addMember(member);

      if (availableSurplus <= 0) break;
    }

    // Add surplus ships to pool
    for (const surplusShip of surplusShips) {
      const member: PoolMember = {
        memberId: randomUUID(),
        poolId,
        shipId: surplusShip.shipId,
        contributionBalance: surplusShip.complianceBalance,
        allocatedDeficit: 0, // Surplus ships don't receive allocation
        joinedAt: new Date(),
      };

      members.push(member);
      await this.poolRepository.addMember(member);
    }

    return members;
  }
}
