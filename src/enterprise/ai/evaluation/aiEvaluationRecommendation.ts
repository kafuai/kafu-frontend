import { AIEvaluationRun } from "./aiEvaluationTypes";

export function generateEvaluationRecommendations(
  run: AIEvaluationRun,
): string[] {
  const recommendations = new Set<string>();

  for (const result of run.results) {
    if (!result.passed) {
      recommendations.add(
        "Review failed evaluation samples and identify recurring issues.",
      );
    }

    if (result.riskLevel === "critical") {
      recommendations.add(
        "Block deployment until critical risks are mitigated.",
      );
    }

    if (result.riskLevel === "high") {
      recommendations.add(
        "Perform additional validation before production rollout.",
      );
    }

    if (result.percentageScore < 70) {
      recommendations.add(
        "Improve prompts, datasets, or model configuration.",
      );
    }
  }

  if (recommendations.size === 0) {
    recommendations.add(
      "Evaluation results meet current enterprise quality expectations.",
    );
  }

  return [...recommendations];
}