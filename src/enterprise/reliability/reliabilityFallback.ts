import { ReliabilityAssessment } from "./reliabilityTypes";

export type ReliabilityFallbackDecision = {
  targetId: string;
  required: boolean;
  reason?: string;
  decidedAt: Date;
};

export function decideReliabilityFallback(
  assessment: ReliabilityAssessment,
): ReliabilityFallbackDecision {
  const required =
    assessment.status === "failed" ||
    assessment.status === "unstable" ||
    assessment.severity === "critical";

  return {
    targetId: assessment.targetId,
    required,
    reason: required
      ? "Reliability fallback is required for unstable or failed target."
      : undefined,
    decidedAt: new Date(),
  };
}