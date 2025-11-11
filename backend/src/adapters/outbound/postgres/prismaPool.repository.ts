// backend/src/adapters/outbound/postgres/prismaPool.repository.ts
import { PrismaClient } from '@prisma/client';
import { IPoolRepository } from '../../../core/ports/pool.repository';
import { Pool, PoolMember } from '../../../core/domain/pool.entity';

export class PrismaPoolRepository implements IPoolRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(poolId: string): Promise<Pool | null> {
    const pool = await this.prisma.pool.findUnique({
      where: { pool_id: poolId },
      include: { members: true },
    });
    return pool ? this.toDomain(pool) : null;
  }

  async findByYear(year: number): Promise<Pool[]> {
    const pools = await this.prisma.pool.findMany({
      where: { year },
      include: { members: true },
      orderBy: { created_at: 'desc' },
    });
    return pools.map(this.toDomain);
  }

  async findByShip(shipId: string): Promise<Pool[]> {
    const pools = await this.prisma.pool.findMany({
      where: {
        member_ships: {
          has: shipId,
        },
      },
      include: { members: true },
      orderBy: { created_at: 'desc' },
    });
    return pools.map(this.toDomain);
  }

  async save(pool: Pool): Promise<Pool> {
    const saved = await this.prisma.pool.create({
      data: {
        pool_id: pool.poolId,
        pool_name: pool.poolName,
        year: pool.year,
        member_ships: pool.memberShips,
        total_balance: pool.totalBalance,
      },
      include: { members: true },
    });
    return this.toDomain(saved);
  }

  async update(poolId: string, pool: Partial<Pool>): Promise<Pool> {
    const updated = await this.prisma.pool.update({
      where: { pool_id: poolId },
      data: {
        pool_name: pool.poolName,
        member_ships: pool.memberShips,
        total_balance: pool.totalBalance,
      },
      include: { members: true },
    });
    return this.toDomain(updated);
  }

  async delete(poolId: string): Promise<void> {
    await this.prisma.pool.delete({
      where: { pool_id: poolId },
    });
  }

  // Pool member operations
  async addMember(member: PoolMember): Promise<PoolMember> {
    const saved = await this.prisma.poolMember.create({
      data: {
        member_id: member.memberId,
        pool_id: member.poolId,
        ship_id: member.shipId,
        contribution_balance: member.contributionBalance,
        allocated_deficit: member.allocatedDeficit,
      },
    });
    return this.memberToDomain(saved);
  }

  async removeMember(memberId: string): Promise<void> {
    await this.prisma.poolMember.delete({
      where: { member_id: memberId },
    });
  }

  async findMembersByPool(poolId: string): Promise<PoolMember[]> {
    const members = await this.prisma.poolMember.findMany({
      where: { pool_id: poolId },
      orderBy: { joined_at: 'asc' },
    });
    return members.map(this.memberToDomain);
  }

  async updateMember(memberId: string, member: Partial<PoolMember>): Promise<PoolMember> {
    const updated = await this.prisma.poolMember.update({
      where: { member_id: memberId },
      data: {
        contribution_balance: member.contributionBalance,
        allocated_deficit: member.allocatedDeficit,
      },
    });
    return this.memberToDomain(updated);
  }

  private toDomain(prismaPool: any): Pool {
    return {
      poolId: prismaPool.pool_id,
      poolName: prismaPool.pool_name,
      year: prismaPool.year,
      memberShips: prismaPool.member_ships,
      totalBalance: prismaPool.total_balance,
      createdAt: prismaPool.created_at,
      updatedAt: prismaPool.updated_at,
    };
  }

  private memberToDomain(prismaMember: any): PoolMember {
    return {
      memberId: prismaMember.member_id,
      poolId: prismaMember.pool_id,
      shipId: prismaMember.ship_id,
      contributionBalance: prismaMember.contribution_balance,
      allocatedDeficit: prismaMember.allocated_deficit,
      joinedAt: prismaMember.joined_at,
    };
  }
}
