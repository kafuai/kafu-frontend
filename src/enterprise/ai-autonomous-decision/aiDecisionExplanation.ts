import { AIDecisionConfidenceAssessment } from "./aiDecisionConfidence";
import { AIDecisionImpactAnalysis } from "./aiDecisionImpactAnalysis";
import { AIDecisionOutcomeResolution } from "./aiDecisionOutcome";
import { AIDecisionRiskAssessment } from "./aiDecisionRiskAssessment";
import { AIDecisionSelection } from "./aiDecisionSelection";

export interface AIDecisionExplanation {
  decisionId: string;
  selectedOptionId?: string;
  summary: string;
  reasoning: string[];
  confidenceExplanation?: string;
  riskExplanation?: string;
  impactExplanation?: string;
  outcomeExplanation: string;
}

export function explainAIDecision(input: {
  decisionId: string;
  selection: AIDecisionSelection;
  outcome: AIDecisionOutcomeResolution;
  confidence?: AIDecisionConfidenceAssessment;
  risk?: AIDecisionRiskAssessment;
  impact?: AIDecisionImpactAnalysis;
}): AIDecisionExplanation {
  const riskExplanation = input.risk
    ? [...input.risk.blockers, ...input.risk.warnings].join(" ")
    : undefined;

  return {
    decisionId: input.decisionId,
    selectedOptionId: input.selection.selectedOption?.id,
    summary: input.selection.selectedOption
      ? `Selected decision option ${input.selection.selectedOption.id}.`
      : "No decision option was selected.",
    reasoning: [
      input.selection.reason,
      input.outcome.reason,
      input.confidence
        ? `Confidence level is ${input.confidence.confidenceLevel}.`
        : "Confidence assessment was not available.",
      input.risk ? `Risk level is ${input.risk.riskLevel}.` : "Risk assessment was not available.",
      input.impact
        ? `Overall impact is ${input.impact.overallImpact}.`
        : "Impact analysis was not available.",
    ],
    confidenceExplanation: input.confidence?.reasons.join(" "),
    riskExplanation,
    impactExplanation: input.impact?.rationale,
    outcomeExplanation: input.outcome.reason,
  };
}