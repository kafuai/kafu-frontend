import type {
  ExecutiveDemoIntelligenceAction,
} from "./executiveDemoIntelligenceActions";
import type {
  ExecutiveDemoIntelligenceDecision,
} from "./executiveDemoIntelligenceDecision";
import type {
  ExecutiveDemoIntelligenceContext,
  ExecutiveDemoIntelligenceResult,
} from "./executiveDemoIntelligenceTypes";

export interface ExecutiveDemoIntelligenceNarrative {
  opening: string;
  situation: string;
  finding: string;
  decision: string;
  action: string;
  closing: string;
}

export function buildExecutiveDemoIntelligenceNarrative(
  context: ExecutiveDemoIntelligenceContext,
  result: ExecutiveDemoIntelligenceResult,
  decision: ExecutiveDemoIntelligenceDecision,
  actions: ExecutiveDemoIntelligenceAction[],
): ExecutiveDemoIntelligenceNarrative {
  const primaryAction = actions[0];

  return {
    opening:
      `KAFU AI has analyzed the available executive context for ${context.companyName}.`,
    situation: buildSituation(context),
    finding: result.executiveSummary,
    decision:
      `${decision.title}. ${decision.summary} Confidence is ${decision.confidence}.`,
    action: primaryAction
      ? `${primaryAction.title}: ${primaryAction.description}`
      : decision.recommendedAction,
    closing:
      "The executive can now move from fragmented information to a clear, evidence-based and accountable action.",
  };
}

function buildSituation(
  context: ExecutiveDemoIntelligenceContext,
): string {
  const details = [
    context.industry
      ? `${context.companyName} operates in the ${context.industry} sector`
      : `${context.companyName} is under executive evaluation`,
    context.country ? `in ${context.country}` : undefined,
    context.currentStage
      ? `and is currently at ${context.currentStage}`
      : undefined,
  ]
    .filter(Boolean)
    .join(" ");

  return `${details}.`;
}

export function formatExecutiveDemoIntelligenceNarrative(
  narrative: ExecutiveDemoIntelligenceNarrative,
): string {
  return [
    narrative.opening,
    narrative.situation,
    narrative.finding,
    narrative.decision,
    narrative.action,
    narrative.closing,
  ].join(" ");
}
