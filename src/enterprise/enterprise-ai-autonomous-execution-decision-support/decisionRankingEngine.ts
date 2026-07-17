import type { RankedDecisionOption } from "./decisionSupportResult";
import type { DecisionSupportContext } from "./decisionSupportContext";
import { DecisionScoreCalculator } from "./decisionScoreCalculator";

export class DecisionRankingEngine {
  private readonly calculator = new DecisionScoreCalculator();

  public rank(
    context: DecisionSupportContext
  ): RankedDecisionOption[] {
    return context.options
      .map((option) => ({
        ...option,
        decisionScore: this.calculator.calculate(option),
        rankingReason:
          "Ranked using business value, confidence, effort, and risk.",
      }))
      .sort((a, b) => b.decisionScore - a.decisionScore);
  }
}