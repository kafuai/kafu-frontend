import { AIObservabilitySignal } from "./aiObservabilityTypes";

export interface AIErrorObservabilitySummary {
  totalErrors: number;
  criticalErrors: number;
  warningErrors: number;
  affectedServices: string[];
  affectedModels: string[];
}

export function summarizeAIErrorObservability(
  signals: AIObservabilitySignal[],
): AIErrorObservabilitySummary {
  const errorSignals = signals.filter((signal) => signal.type === "error");

  return {
    totalErrors: errorSignals.length,
    criticalErrors: errorSignals.filter((signal) => signal.severity === "critical").length,
    warningErrors: errorSignals.filter((signal) => signal.severity === "warning").length,
    affectedServices: Array.from(
      new Set(errorSignals.map((signal) => signal.metadata.serviceName)),
    ),
    affectedModels: Array.from(
      new Set(
        errorSignals
          .map((signal) => signal.metadata.modelName)
          .filter((modelName): modelName is string => Boolean(modelName)),
      ),
    ),
  };
}