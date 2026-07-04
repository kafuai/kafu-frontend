import { AIPlanningOption } from "./aiPlanningOption";
import {
  AIPlanningScore,
  scoreAIPlanningOption,
} from "./aiPlanningScoring";

export interface AIPlanningSelectionResult {
  selected: AIPlanningOption;
  score: AIPlanningScore;
  ranking: AIPlanningScore[];
}

export function selectBestAIPlanningOption(
  options: AIPlanningOption[],
): AIPlanningSelectionResult {
  if (options.length === 0) {
    throw new Error("At least one planning option is required.");
  }

  const ranking = options
    .map(scoreAIPlanningOption)
    .sort((a, b) => b.totalScore - a.totalScore);

  const selected = options.find(
    (option) => option.id === ranking[0].optionId,
  );

  if (!selected) {
    throw new Error("Selected planning option could not be resolved.");
  }

  return {
    selected,
    score: ranking[0],
    ranking,
  };
}