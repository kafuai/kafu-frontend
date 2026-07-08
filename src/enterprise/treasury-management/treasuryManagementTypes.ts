export type TreasuryCurrency = "USD" | "EUR" | "GBP" | "JOD" | "SAR" | "AED";

export type TreasuryStatus =
  | "draft"
  | "active"
  | "under_review"
  | "approved"
  | "settled"
  | "closed"
  | "flagged";

export type TreasuryRiskLevel = "low" | "medium" | "high" | "critical";

export interface TreasuryAuditTrail {
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface TreasuryCashPosition {
  id: string;
  entityId: string;
  accountId: string;
  currency: TreasuryCurrency;
  availableBalance: number;
  bookBalance: number;
  restrictedCash: number;
  asOfDate: string;
  status: TreasuryStatus;
  audit: TreasuryAuditTrail;
}

export interface TreasuryLiquidityPlan {
  id: string;
  entityId: string;
  planningHorizonDays: number;
  openingLiquidity: number;
  projectedInflows: number;
  projectedOutflows: number;
  minimumLiquidityBuffer: number;
  liquidityGap: number;
  currency: TreasuryCurrency;
  status: TreasuryStatus;
  audit: TreasuryAuditTrail;
}

export interface TreasuryBankAccount {
  id: string;
  entityId: string;
  bankName: string;
  accountName: string;
  accountNumberMasked: string;
  ibanMasked?: string;
  currency: TreasuryCurrency;
  country: string;
  isPrimary: boolean;
  status: TreasuryStatus;
  audit: TreasuryAuditTrail;
}
