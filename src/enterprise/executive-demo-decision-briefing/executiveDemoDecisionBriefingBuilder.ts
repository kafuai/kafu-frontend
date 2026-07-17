import {
  createExecutiveDecisionBriefing,
  markExecutiveDecisionBriefingReady,
} from "./executiveDemoDecisionBriefing";
import {
  ExecutiveDemoDecisionBriefingContext,
} from "./executiveDemoDecisionBriefingContext";
import {
  ExecutiveDecisionBriefing,
  ExecutiveDecisionBriefingAction,
  ExecutiveDecisionBriefingEvidence,
  ExecutiveDecisionBriefingMetric,
  ExecutiveDecisionBriefingOption,
  ExecutiveDecisionBriefingRisk,
} from "./executiveDemoDecisionBriefingTypes";
import {
  assertExecutiveDecisionBriefingValid,
} from "./executiveDemoDecisionBriefingValidator";

export interface ExecutiveDecisionBriefingBuilderInput {
  context: ExecutiveDemoDecisionBriefingContext;
  title: string;
  executiveSummary: string;
  decisionRequired: string;
  recommendedDecision: string;
  rationale: string;
  keyMetrics?: ExecutiveDecisionBriefingMetric[];
  evidence?: ExecutiveDecisionBriefingEvidence[];
  risks?: ExecutiveDecisionBriefingRisk[];
  actions?: ExecutiveDecisionBriefingAction[];
  options?: ExecutiveDecisionBriefingOption[];
  markReady?: boolean;
}

export function buildExecutiveDecisionBriefing(
  input: ExecutiveDecisionBriefingBuilderInput,
): ExecutiveDecisionBriefing {
  const briefing = createExecutiveDecisionBriefing({
    organizationId: input.context.organizationId,
    companyName: input.context.companyName,
    title: input.title,
    executiveSummary: input.executiveSummary,
    decisionRequired: input.decisionRequired,
    recommendedDecision: input.recommendedDecision,
    rationale: input.rationale,
    priority: input.context.decisionUrgency,
    confidence: input.context.confidence,
    impactAreas: input.context.primaryImpactAreas,
    keyMetrics: input.keyMetrics ?? [],
    evidence: input.evidence ?? [],
    risks: input.risks ?? [],
    actions: input.actions ?? [],
    options: input.options ?? [],
  });

  const finalizedBriefing = input.markReady
    ? markExecutiveDecisionBriefingReady(briefing)
    : briefing;

  assertExecutiveDecisionBriefingValid(finalizedBriefing);

  return finalizedBriefing;
}
