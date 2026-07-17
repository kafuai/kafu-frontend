import {
  EnterpriseDecisionRecommendation,
  EnterpriseDecisionRisk,
} from "./decisionIntelligenceTypes";
import {
  EnterpriseDecisionEngine,
  EnterpriseDecisionEngineInput,
} from "./enterpriseDecisionEngine";

export interface DecisionRecommendationBuilderInput
  extends EnterpriseDecisionEngineInput {
  recommendedOwner?: string | null;
}

function buildRiskRationale(risks: EnterpriseDecisionRisk[]): string {
  const criticalRisks = risks.filter(
    (risk) => risk.severity === "critical",
  );

  const highRisks = risks.filter(
    (risk) => risk.severity === "high",
  );

  if (criticalRisks.length > 0) {
    return `${criticalRisks.length} critical risk${criticalRisks.length === 1 ? "" : "s"} must be mitigated before full execution.`;
  }

  if (highRisks.length > 0) {
    return `${highRisks.length} high-priority risk${highRisks.length === 1 ? "" : "s"} should be actively monitored during execution.`;
  }

  return "No critical execution risk is currently preventing progression.";
}

export function buildEnterpriseDecisionRecommendation(
  input: DecisionRecommendationBuilderInput,
): EnterpriseDecisionRecommendation | null {
  const engine = new EnterpriseDecisionEngine();
  const evaluation = engine.evaluate(input);

  if (!evaluation.recommendedOption) {
    return null;
  }

  const riskRationale = buildRiskRationale(input.risks);

  return {
    decisionId: input.decisionId,
    title: `Recommended Decision: ${evaluation.recommendedOption.title}`,
    executiveSummary: evaluation.reasoningSummary,
    recommendedOptionId: evaluation.recommendedOption.id,
    rationale: `${evaluation.recommendedOption.description} ${riskRationale}`,
    priority: evaluation.priority,
    confidence: evaluation.confidence,
    expectedImpact: evaluation.expectedImpact,
    recommendedOwner: input.recommendedOwner ?? null,
    recommendedNextAction:
      evaluation.priority === "critical"
        ? "Initiate executive review and assign an accountable decision owner immediately."
        : evaluation.priority === "high"
          ? "Validate the recommendation with the responsible executive and begin execution planning."
          : "Add the recommendation to the enterprise decision pipeline for structured review.",
  };
}
