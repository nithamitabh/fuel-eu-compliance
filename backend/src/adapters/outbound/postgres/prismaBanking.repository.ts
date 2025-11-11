// backend/src/adapters/outbound/postgres/prismaBanking.repository.ts
import { PrismaClient } from '@prisma/client';
import { IBankingRepository } from '../../../core/ports/banking.repository';
import { BankingRecord } from '../../../core/domain/banking.entity';

export class PrismaBankingRepository implements IBankingRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByShipAndYear(shipId: string, year: number): Promise<BankingRecord | null> {
    const banking = await this.prisma.bankingRecord.findUnique({
      where: {
        ship_id_year: {
          ship_id: shipId,
          year,
        },
      },
    });
    return banking ? this.toDomain(banking) : null;
  }

  async findActiveByShip(shipId: string): Promise<BankingRecord[]> {
    const bankingRecords = await this.prisma.bankingRecord.findMany({
      where: {
        ship_id: shipId,
        is_expired: false,
      },
      orderBy: { year: 'asc' },
    });
    return bankingRecords.map(this.toDomain);
  }

  async save(banking: BankingRecord): Promise<BankingRecord> {
    const saved = await this.prisma.bankingRecord.create({
      data: {
        banking_id: banking.bankingId,
        ship_id: banking.shipId,
        year: banking.year,
        banked_amount: banking.bankedAmount,
        expiry_year: banking.expiryYear,
        is_expired: banking.isExpired,
      },
    });
    return this.toDomain(saved);
  }

  async update(bankingId: string, banking: Partial<BankingRecord>): Promise<BankingRecord> {
    const updated = await this.prisma.bankingRecord.update({
      where: { banking_id: bankingId },
      data: {
        banked_amount: banking.bankedAmount,
        is_expired: banking.isExpired,
      },
    });
    return this.toDomain(updated);
  }

  async markExpired(bankingId: string): Promise<void> {
    await this.prisma.bankingRecord.update({
      where: { banking_id: bankingId },
      data: { is_expired: true },
    });
  }

  async findExpiredRecords(currentYear: number): Promise<BankingRecord[]> {
    const bankingRecords = await this.prisma.bankingRecord.findMany({
      where: {
        expiry_year: { lte: currentYear },
        is_expired: false,
      },
    });
    return bankingRecords.map(this.toDomain);
  }

  async getTotalBanked(shipId: string): Promise<number> {
    const result = await this.prisma.bankingRecord.aggregate({
      where: {
        ship_id: shipId,
        is_expired: false,
      },
      _sum: {
        banked_amount: true,
      },
    });
    return result._sum.banked_amount || 0;
  }

  async delete(bankingId: string): Promise<void> {
    await this.prisma.bankingRecord.delete({
      where: { banking_id: bankingId },
    });
  }

  private toDomain(prismaBanking: any): BankingRecord {
    return {
      bankingId: prismaBanking.banking_id,
      shipId: prismaBanking.ship_id,
      year: prismaBanking.year,
      bankedAmount: prismaBanking.banked_amount,
      expiryYear: prismaBanking.expiry_year,
      isExpired: prismaBanking.is_expired,
      createdAt: prismaBanking.created_at,
      updatedAt: prismaBanking.updated_at,
    };
  }
}
