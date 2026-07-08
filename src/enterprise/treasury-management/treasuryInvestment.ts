import type { TreasuryCurrency, TreasuryRiskLevel, TreasuryStatus, TreasuryAuditTrail } from "./treasuryManagementTypes";

export interface TreasuryInvestmentPosition {
  id: string;
  entityId: string;
  instrumentName: string;
  instrumentType: "deposit" | "money_market" | "bond" | "fund" | "other";
  principalAmount: number;
  marketValue: number;
  currency: TreasuryCurrency;
  maturityDate?: string;
  expectedYieldPercent: number;
  riskLevel: TreasuryRiskLevel;
  status: TreasuryStatus;
  audit: TreasuryAuditTrail;
}

export function createTreasuryInvestmentPosition(input: {
  id: string;
  entityId: string;
  instrumentName: string;
  instrumentType: TreasuryInvestmentPosition["instrumentType"];
  principalAmount: number;
  marketValue: number;
  currency: TreasuryCurrency;
  maturityDate?: string;
  expectedYieldPercent: number;
  riskLevel: TreasuryRiskLevel;
  createdBy: string;
}): TreasuryInvestmentPosition {
  return {
    ...input,
    status: "active",
    audit: {
      createdBy: input.createdBy,
      createdAt: new Date().toISOString(),
    },
  };
}

export function calculateTreasuryInvestmentGainLoss(position: TreasuryInvestmentPosition): number {
  return position.marketValue - position.principalAmount;
}

export function isTreasuryInvestmentMaturingSoon(
  position: TreasuryInvestmentPosition,
  withinDays = 30
): boolean {
  if (!position.maturityDate) return false;

  const maturity = new Date(position.maturityDate).getTime();
  const now = Date.now();
  const diffDays = Math.ceil((maturity - now) / 86_400_000);

  return diffDays >= 0 && diffDays <= withinDays;
}
