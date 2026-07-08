import type { TreasuryCashPosition, TreasuryLiquidityPlan } from "./treasuryManagementTypes";
import type { TreasuryDebtFacility } from "./treasuryDebt";
import type { TreasuryInvestmentPosition } from "./treasuryInvestment";
import type { TreasuryRiskExposure } from "./treasuryRisk";
import { calculateNetAvailableCash } from "./treasuryCashPosition";
import { assessLiquidityRisk } from "./treasuryLiquidity";
import { calculateTreasuryInvestmentGainLoss } from "./treasuryInvestment";
import { assessTreasuryDebtRisk } from "./treasuryDebt";
import { requiresTreasuryRiskCommittee } from "./treasuryRisk";

export interface TreasuryDashboardSummary {
  entityId: string;
  totalNetAvailableCash: number;
  liquidityRisk: ReturnType<typeof assessLiquidityRisk>;
  totalInvestmentGainLoss: number;
  annualDebtServiceEstimate: number;
  highRiskExposureCount: number;
  committeeReviewRequired: boolean;
}

export function buildTreasuryDashboardSummary(input: {
  entityId: string;
  cashPositions: TreasuryCashPosition[];
  liquidityPlan: TreasuryLiquidityPlan;
  investments: TreasuryInvestmentPosition[];
  debtFacilities: TreasuryDebtFacility[];
  riskExposures: TreasuryRiskExposure[];
}): TreasuryDashboardSummary {
  const totalNetAvailableCash = input.cashPositions.reduce(
    (sum, position) => sum + calculateNetAvailableCash(position),
    0
  );

  const totalInvestmentGainLoss = input.investments.reduce(
    (sum, investment) => sum + calculateTreasuryInvestmentGainLoss(investment),
    0
  );

  const annualDebtServiceEstimate = input.debtFacilities.reduce(
    (sum, facility) => sum + facility.principalOutstanding * (facility.interestRatePercent / 100),
    0
  );

  const highRiskExposureCount = input.riskExposures.filter(
    (exposure) => exposure.riskLevel === "high" || exposure.riskLevel === "critical"
  ).length;

  return {
    entityId: input.entityId,
    totalNetAvailableCash,
    liquidityRisk: assessLiquidityRisk(input.liquidityPlan),
    totalInvestmentGainLoss,
    annualDebtServiceEstimate,
    highRiskExposureCount,
    committeeReviewRequired:
      highRiskExposureCount > 0 ||
      input.debtFacilities.some((facility) => assessTreasuryDebtRisk(facility) === "critical") ||
      input.riskExposures.some(requiresTreasuryRiskCommittee),
  };
}
