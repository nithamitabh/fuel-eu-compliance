/**
 * Domain Entity: Pool
 * Represents compliance pooling arrangement (Article 21)
 * Mirrors backend domain entity
 */

export type Pool = {
  poolId: string;
  poolName: string;
  year: number;
  totalBalance: number;
  createdAt: Date;
  updatedAt: Date;
};

export type PoolMember = {
  memberId: string;
  poolId: string;
  shipId: string;
  contributionBalance: number;
  allocatedSurplus: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CreatePoolInput = {
  poolName: string;
  year: number;
  shipIds: string[];
};

export type PoolResult = {
  pool: Pool;
  members: PoolMember[];
};
