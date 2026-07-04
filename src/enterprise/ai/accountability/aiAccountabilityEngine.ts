import { AIAccountableDecision } from "./aiAccountableDecision";
import { AIAccountabilityEvidence } from "./aiAccountabilityEvidence";
import { AIAccountabilityImpact } from "./aiAccountabilityImpact";
import {
  AIAccountabilityMetrics,
  buildAIAccountabilityMetrics,
} from "./aiAccountabilityMetrics";
import {
  AIAccountabilityReport,
  buildAIAccountabilityReport,
} from "./aiAccountabilityReporter";
import { AIAccountabilityReview } from "./aiAccountabilityReview";
import { AIAccountabilityRemediationPlan } from "./aiAccountabilityRemediation";
import { AIResponsibilityAssignment } from "./aiResponsibilityAssignment";
import {
  AIAccountabilityDashboard,
  buildAIAccountabilityDashboard,
} from "./aiAccountabilityDashboard";

export interface AIAccountabilityEngineState {
  organizationId: string;
  decisions: AIAccountableDecision[];
  assignments: AIResponsibilityAssignment[];
  evidence: AIAccountabilityEvidence[];
  impacts: AIAccountabilityImpact[];
  reviews: AIAccountabilityReview[];
  remediationPlans: AIAccountabilityRemediationPlan[];
}

export interface AIAccountabilityEngineSnapshot {
  organizationId: string;
  metrics: AIAccountabilityMetrics;
  report: AIAccountabilityReport;
  dashboard: AIAccountabilityDashboard;
  generatedAt: Date;
}

export function buildAIAccountabilityEngineSnapshot(
  state: AIAccountabilityEngineState,
  now: Date = new Date(),
): AIAccountabilityEngineSnapshot {
  const metrics = buildAIAccountabilityMetrics(
    {
      organizationId: state.organizationId,
      decisions: state.decisions,
      assignments: state.assignments,
      impacts: state.impacts,
      remediationPlans: state.remediationPlans,
    },
    now,
  );

  const report = buildAIAccountabilityReport(
    {
      organizationId: state.organizationId,
      decisions: state.decisions,
      assignments: state.assignments,
      impacts: state.impacts,
      reviews: state.reviews,
      remediationPlans: state.remediationPlans,
      metrics,
    },
    now,
  );

  const dashboard = buildAIAccountabilityDashboard(
    state.organizationId,
    metrics,
    report,
    now,
  );

  return {
    organizationId: state.organizationId,
    metrics,
    report,
    dashboard,
    generatedAt: now,
  };
}

export function filterAccountabilityStateByOrganization(
  state: AIAccountabilityEngineState,
  organizationId: string,
): AIAccountabilityEngineState {
  return {
    organizationId,
    decisions: state.decisions.filter(
      (decision) => decision.organizationId === organizationId,
    ),
    assignments: state.assignments.filter(
      (assignment) => assignment.organizationId === organizationId,
    ),
    evidence: state.evidence.filter(
      (item) => item.organizationId === organizationId,
    ),
    impacts: state.impacts.filter(
      (impact) => impact.organizationId === organizationId,
    ),
    reviews: state.reviews.filter(
      (review) => review.organizationId === organizationId,
    ),
    remediationPlans: state.remediationPlans.filter(
      (plan) => plan.organizationId === organizationId,
    ),
  };
}