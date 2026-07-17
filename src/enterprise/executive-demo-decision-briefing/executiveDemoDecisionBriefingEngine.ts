import {
  buildExecutiveDecisionBriefing,
  ExecutiveDecisionBriefingBuilderInput,
} from "./executiveDemoDecisionBriefingBuilder";
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

export interface ExecutiveDecisionBriefingEngineInput {
  context: ExecutiveDemoDecisionBriefingContext;
  objective: string;
  businessChallenge: string;
  recommendedDecision: string;
  expectedOutcome: string;
  metrics?: ExecutiveDecisionBriefingMetric[];
  evidence?: ExecutiveDecisionBriefingEvidence[];
  risks?: ExecutiveDecisionBriefingRisk[];
  actions?: ExecutiveDecisionBriefingAction[];
  options?: ExecutiveDecisionBriefingOption[];
  ready?: boolean;
}

function buildExecutiveSummary(
  input: ExecutiveDecisionBriefingEngineInput,
): string {
  return (
    `${input.context.companyName} requires an executive decision to address ` +
    `${input.businessChallenge.trim()}. The recommended direction is ` +
    `${input.recommendedDecision.trim()}, with the expected outcome of ` +
    `${input.expectedOutcome.trim()}.`
  );
}

function buildDecisionRequired(
  input: ExecutiveDecisionBriefingEngineInput,
): string {
  return (
    `Approve, defer, or revise the proposed decision supporting the objective: ` +
    `${input.objective.trim()}.`
  );
}

function buildRationale(
  input: ExecutiveDecisionBriefingEngineInput,
): string {
  return (
    `${input.context.executiveContextSummary} The recommendation addresses ` +
    `${input.businessChallenge.trim()} while prioritizing ` +
    `${input.context.primaryImpactAreas.join(", ")}.`
  );
}

export class ExecutiveDecisionBriefingEngine {
  create(
    input: ExecutiveDecisionBriefingEngineInput,
  ): ExecutiveDecisionBriefing {
    const builderInput: ExecutiveDecisionBriefingBuilderInput = {
      context: input.context,
      title: `${input.context.companyName} Executive Decision Briefing`,
      executiveSummary: buildExecutiveSummary(input),
      decisionRequired: buildDecisionRequired(input),
      recommendedDecision: input.recommendedDecision.trim(),
      rationale: buildRationale(input),
      keyMetrics: input.metrics ?? [],
      evidence: input.evidence ?? [],
      risks: input.risks ?? [],
      actions: input.actions ?? [],
      options: input.options ?? [],
      markReady: input.ready ?? false,
    };

    return buildExecutiveDecisionBriefing(builderInput);
  }
}
