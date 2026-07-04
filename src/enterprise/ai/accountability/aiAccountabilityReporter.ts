import { AIAccountableDecision, requiresAccountabilityEscalation } from "./aiAccountableDecision";
import { AIAccountabilityImpact, requiresImpactEscalation } from "./aiAccountabilityImpact";
import { AIAccountabilityMetrics } from "./aiAccountabilityMetrics";
import { AIAccountabilityReview, reviewRequiresFollowUp } from "./aiAccountabilityReview";
import {
  AIAccountabilityRemediationPlan,
  isRemediationOverdue,
} from "./aiAccountabilityRemediation";
import { AIResponsibilityAssignment } from "./aiResponsibilityAssignment";

export type AIAccountabilityReportStatus =
  | "healthy"
  | "attention_required"
  | "escalation_required";

export interface AIAccountabilityReport {
  organizationId: string;
  status: AIAccountabilityReportStatus;
  executiveSummary: string;
  totalDecisions: number;
  decisionsRequiringEscalation: string[];
  impactsRequiringEscalation: string[];
  reviewsRequiringFollowUp: string[];
  overdueRemediationPlans: string[];
  unassignedDecisionIds: string[];
  pendingResponsibilityIds: string[];
  metrics: AIAccountabilityMetrics;
  generatedAt: Date;
}

export interface BuildAIAccountabilityReportInput {
  organizationId: string;
  decisions: AIAccountableDecision[];
  assignments: AIResponsibilityAssignment[];
  impacts: AIAccountabilityImpact[];
  reviews: AIAccountabilityReview[];
  remediationPlans: AIAccountabilityRemediationPlan[];
  metrics: AIAccountabilityMetrics;
}

export function buildAIAccountabilityReport(
  input: BuildAIAccountabilityReportInput,
  now: Date = new Date(),
): AIAccountabilityReport {
  const organizationDecisions = input.decisions.filter(
    (decision) => decision.organizationId === input.organizationId,
  );

  const organizationAssignments = input.assignments.filter(
    (assignment) => assignment.organizationId === input.organizationId,
  );

  const organizationImpacts = input.impacts.filter(
    (impact) => impact.organizationId === input.organizationId,
  );

  const organizationReviews = input.reviews.filter(
    (review) => review.organizationId === input.organizationId,
  );

  const organizationRemediationPlans = input.remediationPlans.filter(
    (plan) => plan.organizationId === input.organizationId,
  );

  const decisionsRequiringEscalation = organizationDecisions
    .filter(requiresAccountabilityEscalation)
    .map((decision) => decision.id);

  const impactsRequiringEscalation = organizationImpacts
    .filter(requiresImpactEscalation)
    .map((impact) => impact.id);

  const reviewsRequiringFollowUp = organizationReviews
    .filter(reviewRequiresFollowUp)
    .map((review) => review.id);

  const overdueRemediationPlans = organizationRemediationPlans
    .filter((plan) => isRemediationOverdue(plan, now))
    .map((plan) => plan.id);

  const unassignedDecisionIds = organizationDecisions
    .filter((decision) => decision.accountableOwnerId === undefined)
    .map((decision) => decision.id);

  const pendingResponsibilityIds = organizationAssignments
    .filter((assignment) => assignment.status === "assigned")
    .map((assignment) => assignment.id);

  const escalationCount =
    decisionsRequiringEscalation.length +
    impactsRequiringEscalation.length +
    reviewsRequiringFollowUp.length +
    overdueRemediationPlans.length;

  const status: AIAccountabilityReportStatus =
    escalationCount > 0
      ? "escalation_required"
      : unassignedDecisionIds.length > 0 || pendingResponsibilityIds.length > 0
        ? "attention_required"
        : "healthy";

  return {
    organizationId: input.organizationId,
    status,
    executiveSummary: buildExecutiveSummary(status, organizationDecisions.length, escalationCount),
    totalDecisions: organizationDecisions.length,
    decisionsRequiringEscalation,
    impactsRequiringEscalation,
    reviewsRequiringFollowUp,
    overdueRemediationPlans,
    unassignedDecisionIds,
    pendingResponsibilityIds,
    metrics: input.metrics,
    generatedAt: now,
  };
}

function buildExecutiveSummary(
  status: AIAccountabilityReportStatus,
  totalDecisions: number,
  escalationCount: number,
): string {
  if (status === "healthy") {
    return `AI accountability posture is healthy across ${totalDecisions} accountable decisions.`;
  }

  if (status === "attention_required") {
    return `AI accountability posture requires attention across ${totalDecisions} accountable decisions due to incomplete ownership or pending responsibilities.`;
  }

  return `AI accountability posture requires escalation across ${totalDecisions} accountable decisions with ${escalationCount} escalation signals.`;
}