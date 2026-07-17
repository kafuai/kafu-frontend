import { RankedStrategicDecision } from "./strategicDecisionRankingEngine";
import { StrategicDecisionRecommendation } from "./strategicDecisionResult";

export function buildStrategicDecisionRecommendation(
  rankedDecision: RankedStrategicDecision,
): StrategicDecisionRecommendation {

  const actions: string[] = [];

  if (rankedDecision.riskAssessment.riskLevel === "critical") {
    actions.push(
      "Resolve critical execution risks before approval.",
    );
  }

  if (
    rankedDecision.score.executionFeasibilityScore < 60
  ) {
    actions.push(
      "Increase execution capacity or budget allocation.",
    );
  }

  if (
    rankedDecision.score.strategicAlignmentScore < 70
  ) {
    actions.push(
      "Improve alignment with enterprise strategic objectives.",
    );
  }

  if (
    rankedDecision.score.financialValueScore < 60
  ) {
    actions.push(
      "Reassess expected financial impact and ROI.",
    );
  }

  if (actions.length === 0) {
    actions.push(
      "Proceed with executive approval and execution planning.",
    );
  }

  return {
    title: rankedDecision.decision.title,
    summary:
      "AI recommends prioritizing this strategic decision based on enterprise impact, execution readiness, financial value, and organizational alignment.",
    rationale: rankedDecision.decision.rationale,
    recommendedActions: actions,
  };
}
