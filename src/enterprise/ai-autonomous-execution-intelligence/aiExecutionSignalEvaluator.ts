import { AIExecutionInsight } from "./aiExecutionInsight";

export interface AIExecutionSignalEvaluation {
  accepted: AIExecutionInsight[];
  rejected: AIExecutionInsight[];
}

export interface AIExecutionSignalEvaluationConfig {
  minimumConfidence: number;
}

export function evaluateAIExecutionSignals(
  insights: AIExecutionInsight[],
  config: AIExecutionSignalEvaluationConfig,
): AIExecutionSignalEvaluation {
  const accepted: AIExecutionInsight[] = [];
  const rejected: AIExecutionInsight[] = [];

  for (const insight of insights) {
    if (insight.confidenceScore >= config.minimumConfidence) {
      accepted.push(insight);
    } else {
      rejected.push(insight);
    }
  }

  return {
    accepted,
    rejected,
  };
}