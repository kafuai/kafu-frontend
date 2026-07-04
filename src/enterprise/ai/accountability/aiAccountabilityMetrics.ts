import { AIAccountableDecision } from "./aiAccountableDecision";
import { AIAccountabilityImpact, calculateImpactScore } from "./aiAccountabilityImpact";
import {
  AIAccountabilityRemediationPlan,
  calculateRemediationCompletionRate,
  isRemediationOverdue,
} from "./aiAccountabilityRemediation";
import { AIResponsibilityAssignment } from "./aiResponsibilityAssignment";

export interface AIAccountabilityMetrics {
  organizationId: string;
  totalDecisions: number;
  assignedDecisions: number;
  humanReviewedDecisions: number;
  highRiskDecisions: number;
  criticalRiskDecisions: number;
  activeResponsibilities: number;
  acceptedResponsibilities: number;
  openRemediations: number;
  overdueRemediations: number;
  averageImpactScore: number;
  averageRemediationCompletionRate: number;
  generatedAt: Date;
}

export interface BuildAIAccountabilityMetricsInput {
  organizationId: string;
  decisions: AIAccountableDecision[];
  assignments: AIResponsibilityAssignment[];
  impacts: AIAccountabilityImpact[];
  remediationPlans: AIAccountabilityRemediationPlan[];
}

export function buildAIAccountabilityMetrics(
  input: BuildAIAccountabilityMetricsInput,
  now: Date = new Date(),
): AIAccountabilityMetrics {
  const organizationDecisions = input.decisions.filter(
    (decision) => decision.organizationId === input.organizationId,
  );

  const organizationAssignments = input.assignments.filter(
    (assignment) => assignment.organizationId === input.organizationId,
  );

  const organizationImpacts = input.impacts.filter(
    (impact) => impact.organizationId === input.organizationId,
  );

  const organizationRemediationPlans = input.remediationPlans.filter(
    (plan) => plan.organizationId === input.organizationId,
  );

  const impactScores = organizationImpacts.map(calculateImpactScore);
  const remediationCompletionRates = organizationRemediationPlans.map(
    calculateRemediationCompletionRate,
  );

  return {
    organizationId: input.organizationId,
    totalDecisions: organizationDecisions.length,
    assignedDecisions: organizationDecisions.filter(
      (decision) => decision.accountableOwnerId !== undefined,
    ).length,
    humanReviewedDecisions: organizationDecisions.filter(
      (decision) => decision.humanReviewed,
    ).length,
    highRiskDecisions: organizationDecisions.filter(
      (decision) => decision.riskLevel === "high",
    ).length,
    criticalRiskDecisions: organizationDecisions.filter(
      (decision) => decision.riskLevel === "critical",
    ).length,
    activeResponsibilities: organizationAssignments.filter(
      (assignment) => assignment.status === "assigned",
    ).length,
    acceptedResponsibilities: organizationAssignments.filter(
      (assignment) => assignment.status === "accepted",
    ).length,
    openRemediations: organizationRemediationPlans.filter(
      (plan) =>
        plan.status === "open" ||
        plan.status === "in_progress" ||
        plan.status === "blocked",
    ).length,
    overdueRemediations: organizationRemediationPlans.filter((plan) =>
      isRemediationOverdue(plan, now),
    ).length,
    averageImpactScore:
      impactScores.length === 0
        ? 0
        : impactScores.reduce((total, score) => total + score, 0) /
          impactScores.length,
    averageRemediationCompletionRate:
      remediationCompletionRates.length === 0
        ? 0
        : remediationCompletionRates.reduce((total, rate) => total + rate, 0) /
          remediationCompletionRates.length,
    generatedAt: now,
  };
}

export function calculateHumanReviewCoverage(
  metrics: AIAccountabilityMetrics,
): number {
  if (metrics.totalDecisions === 0) {
    return 1;
  }

  return metrics.humanReviewedDecisions / metrics.totalDecisions;
}

export function calculateAccountabilityAssignmentCoverage(
  metrics: AIAccountabilityMetrics,
): number {
  if (metrics.totalDecisions === 0) {
    return 1;
  }

  return metrics.assignedDecisions / metrics.totalDecisions;
}