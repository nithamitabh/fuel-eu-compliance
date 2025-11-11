// backend/src/core/ports/banking.repository.ts
import { BankingRecord } from '../domain/banking.entity';

// Interface for BankingRepository port
export interface IBankingRepository {
  findByShipAndYear(shipId: string, year: number): Promise<BankingRecord | null>;
  findActiveByShip(shipId: string): Promise<BankingRecord[]>;
  save(banking: BankingRecord): Promise<BankingRecord>;
  update(bankingId: string, banking: Partial<BankingRecord>): Promise<BankingRecord>;
  markExpired(bankingId: string): Promise<void>;
  findExpiredRecords(currentYear: number): Promise<BankingRecord[]>;
  getTotalBanked(shipId: string): Promise<number>;
  delete(bankingId: string): Promise<void>;
}
