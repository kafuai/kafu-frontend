import type { DecisionRiskLevel } from "./decisionSupportTypes";
import type { RankedDecisionOption } from "./decisionSupportResult";

export class DecisionRiskAssessor {
  public assess(options: readonly RankedDecisionOption[]): DecisionRiskLevel {
    if (options.some((option) => option.riskLevel === "severe")) {
      return "severe";
    }

    if (options.some((option) => option.riskLevel === "high")) {
      return "high";
    }

    if (options.some((option) => option.riskLevel === "medium")) {
      return "medium";
    }

    return "low";
  }
}