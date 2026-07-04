import type { DecisionSupportContext } from "./decisionSupportContext";
import type { RankedDecisionOption } from "./decisionSupportResult";

export class DecisionSupportNarrativeBuilder {
  public buildExecutiveSummary(
    context: DecisionSupportContext,
    recommendedOption?: RankedDecisionOption
  ): string {
    if (!recommendedOption) {
      return `Decision ${context.decisionId} cannot be supported because no viable options were provided.`;
    }

    return `Decision ${context.decisionId} supports "${recommendedOption.title}" for objective "${context.objective}" with score ${recommendedOption.decisionScore.toFixed(
      2
    )}.`;
  }

  public buildReasoning(
    context: DecisionSupportContext,
    rankedOptions: readonly RankedDecisionOption[]
  ): readonly string[] {
    if (!rankedOptions.length) {
      return [
        "No decision options were available for evaluation.",
        "Decision support requires at least one option with value, effort, confidence, and risk signals.",
      ];
    }

    return [
      `Evaluated ${rankedOptions.length} decision option(s).`,
      `Primary objective: ${context.objective}.`,
      `Top option selected based on weighted value, confidence, effort, and risk scoring.`,
    ];
  }
}