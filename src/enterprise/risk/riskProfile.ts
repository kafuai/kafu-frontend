import {
  EnterpriseRisk,
  RiskCategory,
  RiskSeverity,
} from "./riskTypes";

export type RiskAppetiteLevel =
  | "conservative"
  | "balanced"
  | "growth_oriented"
  | "aggressive";

export type RiskTolerance = {
  category: RiskCategory;
  maxSeverity: RiskSeverity;
  maxOpenRisks: number;
  requiresExecutiveReview: boolean;
};

export type EnterpriseRiskProfile = {
  organizationId: string;
  appetite: RiskAppetiteLevel;
  tolerances: RiskTolerance[];
  criticalRiskThreshold: number;
  reviewCadenceDays: number;
};

export function createRiskProfile(
  organizationId: string,
  appetite: RiskAppetiteLevel,
  tolerances: RiskTolerance[],
): EnterpriseRiskProfile {
  return {
    organizationId,
    appetite,
    tolerances,
    criticalRiskThreshold: appetite === "conservative" ? 70 : 85,
    reviewCadenceDays: appetite === "aggressive" ? 60 : 30,
  };
}

export function findRiskTolerance(
  profile: EnterpriseRiskProfile,
  risk: EnterpriseRisk,
): RiskTolerance | undefined {
  return profile.tolerances.find(
    (tolerance) => tolerance.category === risk.category,
  );
}

export function isRiskOutsideTolerance(
  profile: EnterpriseRiskProfile,
  risk: EnterpriseRisk,
): boolean {
  const tolerance = findRiskTolerance(profile, risk);

  if (!tolerance) {
    return risk.severity === "critical";
  }

  const severityRank: Record<RiskSeverity, number> = {
    low: 1,
    medium: 2,
    high: 3,
    critical: 4,
  };

  return severityRank[risk.severity] > severityRank[tolerance.maxSeverity];
}