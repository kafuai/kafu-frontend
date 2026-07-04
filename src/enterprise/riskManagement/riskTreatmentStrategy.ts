import { EnterpriseRisk } from "./riskTypes";
import { EnterpriseRiskScore } from "./riskScoring";

export interface EnterpriseRiskTreatmentDecision {
  riskId: string;
  strategy: "avoid" | "reduce" | "transfer" | "accept";
  rationale: string;
  requiresExecutiveApproval: boolean;
}

export function recommendEnterpriseRiskTreatment(
  risk: EnterpriseRisk,
  score: EnterpriseRiskScore,
): EnterpriseRiskTreatmentDecision {
  if (score.rating === "critical") {
    return {
      riskId: risk.riskId,
      strategy: "avoid",
      rationale:
        "Critical risks require avoidance or immediate executive mitigation unless formally accepted.",
      requiresExecutiveApproval: true,
    };
  }

  if (score.rating === "high") {
    return {
      riskId: risk.riskId,
      strategy: "reduce",
      rationale:
        "High risks should be actively reduced through controls and mitigation actions.",
      requiresExecutiveApproval: true,
    };
  }

  if (score.rating === "medium") {
    return {
      riskId: risk.riskId,
      strategy: "reduce",
      rationale:
        "Medium risks should be reduced or monitored depending on business tolerance.",
      requiresExecutiveApproval: false,
    };
  }

  return {
    riskId: risk.riskId,
    strategy: "accept",
    rationale:
      "Low risks may be accepted with routine monitoring.",
    requiresExecutiveApproval: false,
  };
}