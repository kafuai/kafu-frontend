import {
  AIObservabilitySignal,
  AIObservabilitySnapshot,
  AIObservabilityStatus,
} from "./aiObservabilityTypes";

export function calculateAIObservabilityStatus(
  signals: AIObservabilitySignal[],
): AIObservabilityStatus {
  if (signals.some((signal) => signal.status === "unhealthy")) {
    return "unhealthy";
  }

  if (signals.some((signal) => signal.status === "at_risk")) {
    return "at_risk";
  }

  if (signals.some((signal) => signal.status === "degraded")) {
    return "degraded";
  }

  return "healthy";
}

export function createAIObservabilitySnapshot(
  organizationId: string,
  environment: string,
  serviceName: string,
  signals: AIObservabilitySignal[],
): AIObservabilitySnapshot {
  return {
    organizationId,
    environment,
    serviceName,
    status: calculateAIObservabilityStatus(signals),
    totalSignals: signals.length,
    criticalSignals: signals.filter((signal) => signal.severity === "critical").length,
    warningSignals: signals.filter((signal) => signal.severity === "warning").length,
    healthySignals: signals.filter((signal) => signal.status === "healthy").length,
    generatedAt: new Date(),
  };
}