// backend/src/core/domain/pool.entity.ts
// Pool entity for Article 21 - compliance pooling between ships

export type Pool = {
  poolId: string;
  poolName: string;
  year: number;
  memberShips: string[]; // array of shipIds
  totalBalance: number; // sum of all members' compliance balances (must be >= 0)
  createdAt: Date;
  updatedAt: Date;
};

export type PoolMember = {
  memberId: string;
  poolId: string;
  shipId: string;
  contributionBalance: number; // the ship's compliance balance contribution
  allocatedDeficit: number; // deficit allocated to this ship from pool surplus
  joinedAt: Date;
};
