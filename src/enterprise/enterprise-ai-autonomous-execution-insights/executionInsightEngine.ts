import {
  ExecutionInsight,
  ExecutionInsightGenerationInput,
  ExecutionInsightSeverity,
  ExecutionInsightSignal,
} from "./executionInsightTypes";

const resolveSeverity = (signal: ExecutionInsightSignal): ExecutionInsightSeverity => {
  if (signal.threshold === undefined) {
    return "low";
  }

  const ratio = signal.value / signal.threshold;

  if (ratio >= 2) {
    return "critical";
  }

  if (ratio >= 1.5) {
    return "high";
  }

  if (ratio >= 1) {
    return "medium";
  }

  return "low";
};

const resolveConfidence = (signal: ExecutionInsightSignal): number => {
  if (signal.baseline === undefined || signal.baseline === 0) {
    return 0.7;
  }

  const delta = Math.abs(signal.value - signal.baseline) / Math.abs(signal.baseline);
  return Math.min(0.99, Math.max(0.55, 0.65 + delta));
};

export const generateExecutionInsights = (
  input: ExecutionInsightGenerationInput,
): ExecutionInsight[] => {
  const createdAt = input.generatedAt ?? new Date().toISOString();

  return input.signals
    .filter((signal) => {
      if (signal.threshold === undefined) {
        return false;
      }

      return signal.value >= signal.threshold;
    })
    .map((signal) => {
      const severity = resolveSeverity(signal);

      return {
        insightId: `insight-${signal.signalId}`,
        title: `Execution insight detected for ${signal.metric}`,
        description: `${signal.metric} from ${signal.source} reached ${signal.value}, exceeding the configured threshold of ${signal.threshold}.`,
        category: "performance",
        severity,
        confidence: resolveConfidence(signal),
        signals: [signal],
        recommendation:
          severity === "critical"
            ? "Trigger immediate investigation and prioritize autonomous remediation."
            : "Review execution behavior and monitor whether the signal continues trending upward.",
        createdAt,
      };
    });
};