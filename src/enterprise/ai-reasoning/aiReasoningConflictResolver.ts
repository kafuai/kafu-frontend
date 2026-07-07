import { AIReasoningHypothesis } from "./aiReasoningHypothesis";

export function resolveAIReasoningConflicts(
  hypotheses: readonly AIReasoningHypothesis[],
): AIReasoningHypothesis[] {
  return [...hypotheses].sort((left, right) => {
    const leftScore = left.score?.confidence ?? 0;
    const rightScore = right.score?.confidence ?? 0;

    if (rightScore !== leftScore) {
      return rightScore - leftScore;
    }

    const leftCoverage = left.score?.evidenceCoverage ?? 0;
    const rightCoverage = right.score?.evidenceCoverage ?? 0;

    return rightCoverage - leftCoverage;
  });
}