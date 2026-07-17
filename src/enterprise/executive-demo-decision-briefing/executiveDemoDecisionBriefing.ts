import {
  ExecutiveDecisionBriefing,
  ExecutiveDecisionBriefingInput,
} from "./executiveDemoDecisionBriefingTypes";

function createBriefingId(organizationId: string): string {
  const normalizedOrganizationId = organizationId
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `decision-briefing-${normalizedOrganizationId || "organization"}-${Date.now()}`;
}

export function createExecutiveDecisionBriefing(
  input: ExecutiveDecisionBriefingInput,
): ExecutiveDecisionBriefing {
  const timestamp = new Date().toISOString();

  return {
    id: createBriefingId(input.organizationId),
    organizationId: input.organizationId.trim(),
    companyName: input.companyName.trim(),
    title: input.title.trim(),
    executiveSummary: input.executiveSummary.trim(),
    decisionRequired: input.decisionRequired.trim(),
    recommendedDecision: input.recommendedDecision.trim(),
    rationale: input.rationale.trim(),
    priority: input.priority ?? "high",
    confidence: input.confidence ?? "high",
    status: "draft",
    impactAreas: input.impactAreas ?? [],
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
  return {
    ...briefing,
    status: "ready",
    updatedAt: new Date().toISOString(),
  };
}

export function approveExecutiveDecisionBriefing(
  briefing: ExecutiveDecisionBriefing,
): ExecutiveDecisionBriefing {
  return {
    ...briefing,
    status: "approved",
    updatedAt: new Date().toISOString(),
  };
}

export function deferExecutiveDecisionBriefing(
  briefing: ExecutiveDecisionBriefing,
): ExecutiveDecisionBriefing {
  return {
    ...briefing,
    status: "deferred",
    updatedAt: new Date().toISOString(),
  };
}
