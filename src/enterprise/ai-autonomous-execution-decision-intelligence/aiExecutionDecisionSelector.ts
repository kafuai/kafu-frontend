import {
  AIExecutionDecisionOption,
  hasBlockingAIExecutionDecisionConstraint,
} from "./aiExecutionDecisionOption";
import { AIExecutionDecisionScore } from "./aiExecutionDecisionIntelligenceTypes";
import { scoreAIExecutionDecisionOption } from "./aiExecutionDecisionScoring";

export interface AIExecutionDecisionSelection {
  selectedOption?: AIExecutionDecisionOption;
  selectedScore?: AIExecutionDecisionScore;
  eligibleOptions: AIExecutionDecisionOption[];
  rejectedOptions: AIExecutionDecisionOption[];
  rationale: string;
}

export function selectBestAIExecutionDecisionOption(
  options: AIExecutionDecisionOption[],
): AIExecutionDecisionSelection {
  const eligibleOptions = options.filter(
    (option) => !hasBlockingAIExecutionDecisionConstraint(option),
  );

  const rejectedOptions = options.filter((option) =>
    hasBlockingAIExecutionDecisionConstraint(option),
  );

  if (eligibleOptions.length === 0) {
    return {
      eligibleOptions,
      rejectedOptions,
      rationale: "No eligible decision option available because all options are blocked by constraints.",
    };
  }

  const rankedOptions = eligibleOptions
    .map((option) => ({
      option,
      score: scoreAIExecutionDecisionOption(option),
    }))
    .sort((first, second) => second.score.total - first.score.total);

  const best = rankedOptions[0];

  return {
    selectedOption: {
      ...best.option,
      status: "selected",
    },
    selectedScore: best.score,
    eligibleOptions: eligibleOptions.map((option) => ({
      ...option,
      status: option.id === best.option.id ? "selected" : "eligible",
    })),
    rejectedOptions: rejectedOptions.map((option) => ({
      ...option,
      status: "rejected",
    })),
    rationale: `Selected option "${best.option.title}" with score ${best.score.total.toFixed(
      2,
    )}.`,
  };
}