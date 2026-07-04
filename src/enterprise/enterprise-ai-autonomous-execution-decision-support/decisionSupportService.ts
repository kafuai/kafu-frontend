import type { DecisionSupportContext } from "./decisionSupportContext";
import type { DecisionSupportResult } from "./decisionSupportResult";
import { DecisionRankingEngine } from "./decisionRankingEngine";
import { DecisionRiskAssessor } from "./decisionRiskAssessor";
import { DecisionSupportNarrativeBuilder } from "./decisionSupportNarrativeBuilder";

export class DecisionSupportService {
  private readonly rankingEngine = new DecisionRankingEngine();
  private readonly riskAssessor = new DecisionRiskAssessor();
  private readonly narrativeBuilder = new DecisionSupportNarrativeBuilder();

  public supportDecision(
    context: DecisionSupportContext
  ): DecisionSupportResult {
    const rankedOptions = this.rankingEngine.rank(context);
    const recommendedOption = rankedOptions[0];

    return {
      decisionId: context.decisionId,
      status: rankedOptions.length ? "supported" : "insufficient-context",
      recommendedOption,
      rankedOptions,
      overallRiskLevel: this.riskAssessor.assess(rankedOptions),
      confidenceLevel: this.resolveConfidenceLevel(
        recommendedOption?.confidenceScore ?? 0
      ),
      reasoning: this.narrativeBuilder.buildReasoning(context, rankedOptions),
      executiveSummary: this.narrativeBuilder.buildExecutiveSummary(
        context,
        recommendedOption
      ),
    };
  }

  private resolveConfidenceLevel(score: number): DecisionSupportResult["confidenceLevel"] {
    if (score >= 90) {
      return "high-confidence";
    }

    if (score >= 75) {
      return "strong";
    }

    if (score >= 50) {
      return "moderate";
    }

    return "uncertain";
  }
}