import type {
  ExecutiveDecisionBriefingConfidence,
  ExecutiveDecisionBriefingPriority,
} from "./executiveDemoDecisionBriefingTypes";

export interface ExecutiveDemoDecisionBriefingContext {
  organizationId: string;
  companyName: string;
  industry?: string | null;
  country?: string | null;
  executiveContextSummary: string;
  decisionUrgency: ExecutiveDecisionBriefingPriority;
  confidence: ExecutiveDecisionBriefingConfidence;
  primaryImpactAreas: string[];
  executiveSponsor?: string | null;
  transformationStage?: string | null;
  strategicObjective?: string | null;
}

export function createExecutiveDemoDecisionBriefingContext(
  context: ExecutiveDemoDecisionBriefingContext,
): ExecutiveDemoDecisionBriefingContext {
  return {
    ...context,
    organizationId: context.organizationId.trim(),
    companyName: context.companyName.trim(),
    executiveContextSummary: context.executiveContextSummary.trim(),
    primaryImpactAreas: context.primaryImpactAreas
      .map((area) => area.trim())
      .filter(Boolean),
  };
}
