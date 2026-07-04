import {
  AIObservabilitySignal,
  AIObservabilityStatus,
} from "./aiObservabilityTypes";

export interface AIServiceObservabilityHealth {
  organizationId: string;
  serviceName: string;
  environment: string;
  status: AIObservabilityStatus;
  totalSignals: number;
  unhealthySignals: number;
  degradedSignals: number;
  atRiskSignals: number;
  criticalSignals: number;
}

export function evaluateAIServiceObservabilityHealth(
  organizationId: string,
  serviceName: string,
  environment: string,
  signals: AIObservabilitySignal[],
): AIServiceObservabilityHealth {
  const scopedSignals = signals.filter(
    (signal) =>
      signal.metadata.organizationId === organizationId &&
      signal.metadata.serviceName === serviceName &&
      signal.metadata.environment === environment,
  );

  const unhealthySignals = scopedSignals.filter(
    (signal) => signal.status === "unhealthy",
  ).length;

  const degradedSignals = scopedSignals.filter(
    (signal) => signal.status === "degraded",
  ).length;

  const atRiskSignals = scopedSignals.filter(
    (signal) => signal.status === "at_risk",
  ).length;

  const criticalSignals = scopedSignals.filter(
    (signal) => signal.severity === "critical",
  ).length;

  const status: AIObservabilityStatus =
    unhealthySignals > 0 || criticalSignals > 0
      ? "unhealthy"
      : atRiskSignals > 0
        ? "at_risk"
        : degradedSignals > 0
          ? "degraded"
          : "healthy";

  return {
    organizationId,
    serviceName,
    environment,
    status,
    totalSignals: scopedSignals.length,
    unhealthySignals,
    degradedSignals,
    atRiskSignals,
    criticalSignals,
  };
}