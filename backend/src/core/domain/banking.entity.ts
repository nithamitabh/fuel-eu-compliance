// backend/src/core/domain/banking.entity.ts
// Banking entity for Article 20 - banking and borrowing compliance balance

export type BankingRecord = {
  bankingId: string;
  shipId: string;
  year: number;
  bankedAmount: number; // in MJ (positive for surplus, negative for borrowed)
  expiryYear: number; // year when the banked surplus expires (year + 3)
  isExpired: boolean;
  createdAt: Date;
  updatedAt: Date;
};
