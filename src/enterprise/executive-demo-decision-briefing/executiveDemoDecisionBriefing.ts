import type {
  CreateExecutiveDecisionBriefingInput,
  ExecutiveDecisionBriefing,
} from "./executiveDemoDecisionBriefingTypes";

function createBriefingId(): string {
  return `executive-decision-briefing-${crypto.randomUUID()}`;
}

export function createExecutiveDecisionBriefing(
  input: CreateExecutiveDecisionBriefingInput,
): ExecutiveDecisionBriefing {
  const timestamp = new Date().toISOString();

  return {
    id: createBriefingId(),
    organizationId: input.organizationId.trim(),
    companyName: input.companyName.trim(),
    title: input.title.trim(),
    executiveSummary: input.executiveSummary.trim(),
    decisionRequired: input.decisionRequired.trim(),
    recommendedDecision: input.recommendedDecision.trim(),
    rationale: input.rationale.trim(),
    status: "draft",
    priority: input.priority,
    confidence: input.confidence,
    impactAreas: input.impactAreas.map((area) => area.trim()).filter(Boolean),
    keyMetrics: input.keyMetrics ?? [],
    evidence: input.evidence ?? [],
    risks: input.risks ?? [],
    actions: input.actions ?? [],
    options: input.options ?? [],
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function markExecutiveDecisionBriefingReady(
  briefing: ExecutiveDecisionBriefing,
): ExecutiveDecisionBriefing {
  const timestamp = new Date().toISOString();

  return {
    ...briefing,
    status: "ready",
    readyAt: timestamp,
    updatedAt: timestamp,
  };
}

export function approveExecutiveDecisionBriefing(
  briefing: ExecutiveDecisionBriefing,
): ExecutiveDecisionBriefing {
  const timestamp = new Date().toISOString();

  return {
    ...briefing,
    status: "approved",
    approvedAt: timestamp,
    updatedAt: timestamp,
  };
}
