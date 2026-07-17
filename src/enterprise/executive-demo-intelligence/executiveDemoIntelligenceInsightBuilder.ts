import type {
  ExecutiveDemoIntelligenceConfidence,
  ExecutiveDemoIntelligenceInsight,
  ExecutiveDemoIntelligencePriority,
  ExecutiveDemoIntelligenceSignal,
} from "./executiveDemoIntelligenceTypes";

export interface BuildExecutiveDemoInsightInput {
  id: string;
  title: string;
  summary: string;
  rationale: string;
  priority: ExecutiveDemoIntelligencePriority;
  confidence: ExecutiveDemoIntelligenceConfidence;
  supportingSignals?: ExecutiveDemoIntelligenceSignal[];
  recommendedAction?: string;
}

export function buildExecutiveDemoIntelligenceInsight(
  input: BuildExecutiveDemoInsightInput,
): ExecutiveDemoIntelligenceInsight {
  return {
    id: input.id.trim(),
    title: input.title.trim(),
    summary: input.summary.trim(),
    rationale: input.rationale.trim(),
    priority: input.priority,
    confidence: input.confidence,
    supportingSignalIds: Array.from(
      new Set(
        (input.supportingSignals ?? [])
          .map((signal) => signal.id.trim())
          .filter(Boolean),
      ),
    ),
    recommendedAction: input.recommendedAction?.trim(),
  };
}

export function buildInsightsFromExecutiveDemoSignals(
  signals: ExecutiveDemoIntelligenceSignal[],
  confidence: ExecutiveDemoIntelligenceConfidence,
): ExecutiveDemoIntelligenceInsight[] {
  return signals.map((signal) =>
    buildExecutiveDemoIntelligenceInsight({
      id: `insight-${signal.id}`,
      title: signal.title,
      summary: signal.description,
      rationale:
        signal.evidence.length > 0
          ? `This insight is supported by: ${signal.evidence.join(", ")}.`
          : `This insight was derived from ${signal.source}.`,
      priority: signal.priority,
      confidence,
      supportingSignals: [signal],
      recommendedAction: resolveSignalRecommendedAction(signal),
    }),
  );
}

function resolveSignalRecommendedAction(
  signal: ExecutiveDemoIntelligenceSignal,
): string {
  switch (signal.type) {
    case "risk":
      return "Assign an executive owner and initiate a focused intervention.";
    case "opportunity":
      return "Prioritize this opportunity within the executive demo narrative.";
    case "readiness":
      return signal.score < 60
        ? "Launch a targeted AI readiness improvement plan."
        : "Use the readiness level to accelerate enterprise adoption.";
    case "performance":
      return "Review performance drivers and define a measurable improvement action.";
    case "execution":
      return "Convert the insight into an accountable execution plan.";
    case "engagement":
      return "Collect additional executive discovery evidence before final commitment.";
  }
}

export function rankExecutiveDemoIntelligenceInsights(
  insights: ExecutiveDemoIntelligenceInsight[],
): ExecutiveDemoIntelligenceInsight[] {
  const priorityWeight: Record<
    ExecutiveDemoIntelligencePriority,
    number
  > = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1,
  };

  const confidenceWeight: Record<
    ExecutiveDemoIntelligenceConfidence,
    number
  > = {
    high: 3,
    medium: 2,
    low: 1,
  };

  return [...insights].sort((left, right) => {
    const priorityDifference =
      priorityWeight[right.priority] - priorityWeight[left.priority];

    if (priorityDifference !== 0) {
      return priorityDifference;
    }

    return (
      confidenceWeight[right.confidence] -
      confidenceWeight[left.confidence]
    );
  });
}
