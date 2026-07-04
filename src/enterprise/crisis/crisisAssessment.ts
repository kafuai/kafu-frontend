import {
  CrisisAssessment,
  CrisisAssessmentInput,
  CrisisSeverity,
} from "./crisisTypes";

const severityWeight: Record<CrisisSeverity, number> = {
  low: 10,
  medium: 30,
  high: 60,
  critical: 85,
};

function severityFromScore(score: number): CrisisSeverity {
  if (score >= 85) return "critical";
  if (score >= 60) return "high";
  if (score >= 30) return "medium";
  return "low";
}

export function assessCrisisImpact(
  input: CrisisAssessmentInput,
): CrisisAssessment {
  const reasons: string[] = [];
  let score = severityWeight[input.crisis.severity];

  if (input.affectedServices?.length) {
    score += Math.min(input.affectedServices.length * 5, 20);
    reasons.push("Affected services detected");
  }

  if (input.affectedRegions?.length) {
    score += Math.min(input.affectedRegions.length * 5, 15);
    reasons.push("Multi-region impact detected");
  }

  if ((input.estimatedCustomerImpact ?? 0) > 1000) {
    score += 15;
    reasons.push("High customer impact detected");
  }

  if ((input.estimatedFinancialImpact ?? 0) > 100000) {
    score += 15;
    reasons.push("Significant financial exposure detected");
  }

  if (input.regulatoryExposure) {
    score += 20;
    reasons.push("Regulatory exposure detected");
  }

  if (input.publicVisibility) {
    score += 15;
    reasons.push("Public visibility detected");
  }

  const normalizedScore = Math.min(score, 100);
  const severity = severityFromScore(normalizedScore);

  return {
    crisisId: input.crisis.id,
    severity,
    score: normalizedScore,
    reasons,
    requiresExecutiveAttention: normalizedScore >= 60,
    requiresPublicCommunication:
      Boolean(input.publicVisibility) || normalizedScore >= 85,
  };
}