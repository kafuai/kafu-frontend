import { AIExecutionComplianceAssessment } from "./aiAutonomousExecutionComplianceTypes";

export interface AIExecutionComplianceGateDecision {
  approved: boolean;
  reason: string;
}

export function evaluateAIExecutionComplianceGate(
  assessment: AIExecutionComplianceAssessment,
  minimumScore = 85
): AIExecutionComplianceGateDecision {
  if (assessment.status === "blocked") {
    return {
      approved: false,
      reason: "Execution blocked due to compliance violations.",
    };
  }

  if (assessment.score < minimumScore) {
    return {
      approved: false,
      reason: "Compliance score below required threshold.",
    };
  }

  return {
    approved: true,
    reason: "Execution satisfies compliance requirements.",
  };
}