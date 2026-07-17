import {
  ExecutiveDecisionBriefingConfidence,
  ExecutiveDecisionBriefingImpactArea,
  ExecutiveDecisionBriefingPriority,
} from "./executiveDemoDecisionBriefingTypes";

export interface ExecutiveDemoDecisionBriefingContextInput {
  organizationId: string;
  companyName: string;
  industry?: string | null;
  country?: string | null;
  employeeCount?: number | null;
  readinessScore?: number | null;
  corporateBrainScore?: number | null;
  overdueLeads?: number | null;
  activeRisks?: number | null;
  expectedBusinessImpact?: string | null;
}

export interface ExecutiveDemoDecisionBriefingContext {
  organizationId: string;
  companyName: string;
  organizationProfile: string;
  decisionUrgency: ExecutiveDecisionBriefingPriority;
  confidence: ExecutiveDecisionBriefingConfidence;
  primaryImpactAreas: ExecutiveDecisionBriefingImpactArea[];
  executiveContextSummary: string;
}

function resolveDecisionUrgency(
  input: ExecutiveDemoDecisionBriefingContextInput,
): ExecutiveDecisionBriefingPriority {
  const readinessScore = input.readinessScore ?? 0;
  const activeRisks = input.activeRisks ?? 0;
  const overdueLeads = input.overdueLeads ?? 0;

  if (activeRisks >= 5 || overdueLeads >= 10 || readinessScore < 40) {
    return "critical";
  }

  if (activeRisks >= 2 || overdueLeads >= 3 || readinessScore < 65) {
    return "high";
  }

  if (readinessScore < 80) {
    return "medium";
  }

  return "low";
}

function resolveConfidence(
  input: ExecutiveDemoDecisionBriefingContextInput,
): ExecutiveDecisionBriefingConfidence {
  const availableSignals = [
    input.industry,
    input.country,
    input.employeeCount,
    input.readinessScore,
    input.corporateBrainScore,
    input.overdueLeads,
    input.activeRisks,
    input.expectedBusinessImpact,
  ].filter(
    (value) => value !== null && value !== undefined && value !== "",
  ).length;

  if (availableSignals >= 7) {
    return "very-high";
  }

  if (availableSignals >= 5) {
    return "high";
  }

  if (availableSignals >= 3) {
    return "moderate";
  }

  return "low";
}

function resolveImpactAreas(
  input: ExecutiveDemoDecisionBriefingContextInput,
): ExecutiveDecisionBriefingImpactArea[] {
  const impactAreas = new Set<ExecutiveDecisionBriefingImpactArea>();

  if ((input.overdueLeads ?? 0) > 0) {
    impactAreas.add("revenue");
    impactAreas.add("customer");
  }

  if ((input.activeRisks ?? 0) > 0) {
    impactAreas.add("risk");
    impactAreas.add("governance");
  }

  if ((input.readinessScore ?? 100) < 70) {
    impactAreas.add("operations");
    impactAreas.add("technology");
  }

  if ((input.employeeCount ?? 0) >= 100) {
    impactAreas.add("workforce");
  }

  if (impactAreas.size === 0) {
    impactAreas.add("operations");
  }

  return Array.from(impactAreas);
}

export function buildExecutiveDemoDecisionBriefingContext(
  input: ExecutiveDemoDecisionBriefingContextInput,
): ExecutiveDemoDecisionBriefingContext {
  const organizationProfile = [
    input.industry?.trim(),
    input.country?.trim(),
    input.employeeCount
      ? `${input.employeeCount.toLocaleString()} employees`
      : null,
  ]
    .filter(Boolean)
    .join(" | ");

  const decisionUrgency = resolveDecisionUrgency(input);
  const confidence = resolveConfidence(input);
  const primaryImpactAreas = resolveImpactAreas(input);

  return {
    organizationId: input.organizationId.trim(),
    companyName: input.companyName.trim(),
    organizationProfile:
      organizationProfile || "Enterprise organization profile",
    decisionUrgency,
    confidence,
    primaryImpactAreas,
    executiveContextSummary:
      `${input.companyName.trim()} requires an executive decision briefing ` +
      `with ${decisionUrgency} urgency and ${confidence} confidence. ` +
      `The primary impact areas are ${primaryImpactAreas.join(", ")}.`,
  };
}
