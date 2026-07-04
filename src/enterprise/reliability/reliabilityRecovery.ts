import {
  ReliabilityAssessment,
  ReliabilityRecoveryAction,
  ReliabilitySeverity,
} from "./reliabilityTypes";

export type ReliabilityRecoveryPlan = {
  assessmentId: string;
  targetId: string;
  actions: ReliabilityRecoveryAction[];
  severity: ReliabilitySeverity;
  createdAt: Date;
};

export function createReliabilityRecoveryPlan(
  assessment: ReliabilityAssessment,
  actions: ReliabilityRecoveryAction[],
): ReliabilityRecoveryPlan {
  return {
    assessmentId: `${assessment.targetId}:${assessment.assessedAt.toISOString()}`,
    targetId: assessment.targetId,
    actions,
    severity: assessment.severity,
    createdAt: new Date(),
  };
}

export function shouldEscalateReliabilityRecovery(
  plan: ReliabilityRecoveryPlan,
): boolean {
  return plan.severity === "high" || plan.severity === "critical";
}