// backend/src/core/ports/pool.repository.ts
import { Pool, PoolMember } from '../domain/pool.entity';

// Interface for PoolRepository port
export interface IPoolRepository {
  findById(poolId: string): Promise<Pool | null>;
  findByYear(year: number): Promise<Pool[]>;
  findByShip(shipId: string): Promise<Pool[]>;
  save(pool: Pool): Promise<Pool>;
  update(poolId: string, pool: Partial<Pool>): Promise<Pool>;
  delete(poolId: string): Promise<void>;
  
  // Pool member operations
  addMember(member: PoolMember): Promise<PoolMember>;
  removeMember(memberId: string): Promise<void>;
  findMembersByPool(poolId: string): Promise<PoolMember[]>;
  updateMember(memberId: string, member: Partial<PoolMember>): Promise<PoolMember>;
}
