import { ReliabilityAssessment } from "./reliabilityTypes";

export type ReliabilityCircuitBreakerState = "closed" | "open" | "half-open";

export type ReliabilityCircuitBreakerDecision = {
  targetId: string;
  state: ReliabilityCircuitBreakerState;
  reason: string;
  decidedAt: Date;
};

export function evaluateReliabilityCircuitBreaker(
  assessment: ReliabilityAssessment,
): ReliabilityCircuitBreakerDecision {
  if (assessment.status === "failed") {
    return {
      targetId: assessment.targetId,
      state: "open",
      reason: "Target is failed. Circuit breaker opened.",
      decidedAt: new Date(),
    };
  }

  if (assessment.status === "recovering" || assessment.status === "unstable") {
    return {
      targetId: assessment.targetId,
      state: "half-open",
      reason: "Target is recovering or unstable. Circuit breaker half-open.",
      decidedAt: new Date(),
    };
  }

  return {
    targetId: assessment.targetId,
    state: "closed",
    reason: "Target is healthy or degraded. Circuit breaker remains closed.",
    decidedAt: new Date(),
  };
}