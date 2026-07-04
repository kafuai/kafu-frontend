import {
  AIDecisionScorecard,
  createAIDecisionScorecard,
} from "./aiDecisionScorecard";
import {
  AIDecisionCriterion,
  normalizeAIDecisionCriteriaWeights,
} from "./aiDecisionCriteria";
import { AIDecisionOption } from "./aiDecisionOption";

export interface AIDecisionEvaluationResult {
  evaluatedOptions: AIDecisionOption[];
  scorecards: AIDecisionScorecard[];
  highestScore: number;
  evaluatedAt: Date;
}

export function evaluateAIDecisionOptions(
  options: AIDecisionOption[],
  criteria: AIDecisionCriterion[],
): AIDecisionEvaluationResult {
  const normalizedCriteria = normalizeAIDecisionCriteriaWeights(criteria);

  const scorecards = options.map((option) =>
    createAIDecisionScorecard(option, normalizedCriteria),
  );

  const highestScore = scorecards.reduce(
    (max, scorecard) => Math.max(max, scorecard.totalScore),
    0,
  );

  return {
    evaluatedOptions: options.map((option) => ({
      ...option,
      status: "evaluated",
    })),
    scorecards,
    highestScore,
    evaluatedAt: new Date(),
  };
}