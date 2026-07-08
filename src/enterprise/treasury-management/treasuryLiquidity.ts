import type { TreasuryLiquidityPlan, TreasuryCurrency, TreasuryRiskLevel } from "./treasuryManagementTypes";

export function createTreasuryLiquidityPlan(input: {
  id: string;
  entityId: string;
  planningHorizonDays: number;
  openingLiquidity: number;
  projectedInflows: number;
  projectedOutflows: number;
  minimumLiquidityBuffer: number;
  currency: TreasuryCurrency;
  createdBy: string;
}): TreasuryLiquidityPlan {
  const liquidityGap =
    input.openingLiquidity + input.projectedInflows - input.projectedOutflows - input.minimumLiquidityBuffer;

  return {
    id: input.id,
    entityId: input.entityId,
    planningHorizonDays: input.planningHorizonDays,
    openingLiquidity: input.openingLiquidity,
    projectedInflows: input.projectedInflows,
    projectedOutflows: input.projectedOutflows,
    minimumLiquidityBuffer: input.minimumLiquidityBuffer,
    liquidityGap,
    currency: input.currency,
    status: liquidityGap >= 0 ? "active" : "flagged",
    audit: {
      createdBy: input.createdBy,
      createdAt: new Date().toISOString(),
    },
  };
}

export function assessLiquidityRisk(plan: TreasuryLiquidityPlan): TreasuryRiskLevel {
  if (plan.liquidityGap < -plan.minimumLiquidityBuffer) return "critical";
  if (plan.liquidityGap < 0) return "high";
  if (plan.liquidityGap < plan.minimumLiquidityBuffer * 0.25) return "medium";
  return "low";
}
