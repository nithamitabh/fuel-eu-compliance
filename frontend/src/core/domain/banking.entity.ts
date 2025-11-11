/**
 * Domain Entity: BankingRecord
 * Represents banked surplus compliance balance (Article 20)
 * Mirrors backend domain entity
 */

export type BankingRecord = {
  bankingId: string;
  shipId: string;
  year: number;
  bankedAmount: number;
  expiryYear: number;
  isExpired: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type BankSurplusInput = {
  shipId: string;
  year: number;
};

export type ApplyBankedSurplusInput = {
  shipId: string;
  year: number;
};

export type BankingResult = {
  bankingId: string;
  shipId: string;
  year: number;
  bankedAmount: number;
  expiryYear: number;
};
