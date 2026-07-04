import type { DecisionSupportContext } from "./decisionSupportContext";
import type { DecisionSupportResult } from "./decisionSupportResult";
import { DecisionRankingEngine } from "./decisionRankingEngine";

export class DecisionRecommendationEngine {
  private readonly rankingEngine = new DecisionRankingEngine();

  public evaluate(
    context: DecisionSupportContext
  ): DecisionSupportResult {
    const rankedOptions = this.rankingEngine.rank(context);

    return {
      decisionId: context.decisionId,
      status: rankedOptions.length
        ? "supported"
        : "insufficient-context",
      recommendedOption: rankedOptions[0],
      rankedOptions,
      overallRiskLevel:
        rankedOptions[0]?.riskLevel ?? "low",
      confidenceLevel:
        rankedOptions[0]?.confidenceScore >= 90
          ? "high-confidence"
          : rankedOptions[0]?.confidenceScore >= 75
          ? "strong"
          : rankedOptions[0]?.confidenceScore >= 50
          ? "moderate"
          : "uncertain",
      reasoning: [
        "Evaluated all available decision options.",
        "Ranked by weighted business impact model.",
      ],
      executiveSummary: rankedOptions.length
        ? `Recommended option: ${rankedOptions[0].title}`
        : "No decision options available.",
    };
  }
}