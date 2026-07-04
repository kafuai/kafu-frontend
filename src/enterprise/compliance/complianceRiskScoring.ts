import {
  ComplianceSeverity,
  ComplianceStatus,
} from "./complianceTypes";

export interface ComplianceRiskScore {
  likelihood: number;
  impact: number;
  controlEffectiveness: number;
  residualRisk: number;
  rating: ComplianceSeverity;
}

export function calculateComplianceRiskScore(
  likelihood: number,
  impact: number,
  controlEffectiveness: number,
): ComplianceRiskScore {
  const normalizedControl = Math.max(0, Math.min(controlEffectiveness, 100));

  const residualRisk =
    (likelihood * impact) * ((100 - normalizedControl) / 100);

  let rating: ComplianceSeverity = "low";

  if (residualRisk >= 75) {
    rating = "critical";
  } else if (residualRisk >= 50) {
    rating = "high";
  } else if (residualRisk >= 25) {
    rating = "medium";
  }

  return {
    likelihood,
    impact,
    controlEffectiveness: normalizedControl,
    residualRisk: Math.round(residualRisk),
    rating,
  };
}

export function complianceStatusFromRisk(
  score: ComplianceRiskScore,
): ComplianceStatus {
  switch (score.rating) {
    case "low":
      return "compliant";
    case "medium":
      return "partially_compliant";
    default:
      return "non_compliant";
  }
}