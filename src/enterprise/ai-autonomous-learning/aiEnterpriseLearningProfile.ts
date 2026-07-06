import { AIAutonomousLearningFeedback } from "./aiAutonomousLearningFeedback";
import { AIAutonomousLearningInsight } from "./aiAutonomousLearningInsight";
import { AIAutonomousLearningPlan } from "./aiAutonomousLearningPlan";
import { AIAutonomousLearningSignal } from "./aiAutonomousLearningSignal";

export interface AIEnterpriseLearningProfile {
  organizationId: string;
  totalSignals: number;
  totalFeedback: number;
  totalInsights: number;
  totalPlans: number;
  highConfidenceSignals: number;
  negativeSignals: number;
  strongestLearningTags: string[];
  updatedAt: Date;
}

export function buildAIEnterpriseLearningProfile(input: {
  organizationId: string;
  signals: AIAutonomousLearningSignal[];
  feedback: AIAutonomousLearningFeedback[];
  insights: AIAutonomousLearningInsight[];
  plans: AIAutonomousLearningPlan[];
}): AIEnterpriseLearningProfile {
  const organizationSignals = input.signals.filter(
    (signal) => signal.organizationId === input.organizationId,
  );

  const organizationFeedback = input.feedback.filter(
    (feedback) => feedback.organizationId === input.organizationId,
  );

  const organizationInsights = input.insights.filter(
    (insight) => insight.organizationId === input.organizationId,
  );

  const organizationPlans = input.plans.filter(
    (plan) => plan.organizationId === input.organizationId,
  );

  return {
    organizationId: input.organizationId,
    totalSignals: organizationSignals.length,
    totalFeedback: organizationFeedback.length,
    totalInsights: organizationInsights.length,
    totalPlans: organizationPlans.length,
    highConfidenceSignals: organizationSignals.filter(
      (signal) => signal.confidence === "high",
    ).length,
    negativeSignals: organizationSignals.filter(
      (signal) => signal.impact === "negative" || signal.impact === "mixed",
    ).length,
    strongestLearningTags: resolveStrongestLearningTags(organizationSignals),
    updatedAt: new Date(),
  };
}

function resolveStrongestLearningTags(
  signals: AIAutonomousLearningSignal[],
): string[] {
  const counts = new Map<string, number>();

  for (const signal of signals) {
    for (const tag of signal.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag]) => tag);
}