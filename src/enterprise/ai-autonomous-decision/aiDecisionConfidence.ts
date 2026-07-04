import { AIDecisionConfidenceLevel } from "./aiAutonomousDecisionTypes";
import { AIDecisionScorecard } from "./aiDecisionScorecard";

export interface AIDecisionConfidenceAssessment {
  optionId: string;
  confidenceScore: number;
  confidenceLevel: AIDecisionConfidenceLevel;
  reasons: string[];
  assessedAt: Date;
}

function resolveConfidenceLevel(score: number): AIDecisionConfidenceLevel {
  if (score >= 0.9) {
    return "very_high";
  }

  if (score >= 0.75) {
    return "high";
  }

  if (score >= 0.5) {
    return "medium";
  }

  return "low";
}

export function assessAIDecisionConfidence(
  scorecard: AIDecisionScorecard,
): AIDecisionConfidenceAssessment {
  const missingStrongSignals = scorecard.criteriaScores.filter(
    (item) => item.score.value < 0.5 && item.weight >= 0.15,
  );

  const confidenceScore = Math.max(
    0,
    Math.min(1, scorecard.totalScore - missingStrongSignals.length * 0.05),
  );

  return {
    optionId: scorecard.optionId,
    confidenceScore,
    confidenceLevel: resolveConfidenceLevel(confidenceScore),
    reasons:
      missingStrongSignals.length > 0
        ? missingStrongSignals.map(
            (item) =>
              `Low signal on weighted criterion "${item.criterionName}": ${item.score.reason}`,
          )
        : ["Decision has consistent signals across weighted criteria."],
    assessedAt: new Date(),
  };
}