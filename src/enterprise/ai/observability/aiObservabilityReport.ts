import {
  AIObservabilityDashboard,
  buildAIObservabilityDashboard,
} from "./aiObservabilityDashboard";
import { AIObservabilitySignal } from "./aiObservabilityTypes";

export interface AIObservabilityReport {
  organizationId: string;
  environment: string;
  serviceName: string;
  generatedAt: Date;
  dashboard: AIObservabilityDashboard;
  executiveSummary: string;
}

export function generateAIObservabilityReport(
  organizationId: string,
  environment: string,
  serviceName: string,
  signals: AIObservabilitySignal[],
): AIObservabilityReport {
  const scopedSignals = signals.filter(
    (signal) =>
      signal.metadata.organizationId === organizationId &&
      signal.metadata.environment === environment &&
      signal.metadata.serviceName === serviceName,
  );

  const dashboard = buildAIObservabilityDashboard(scopedSignals);

  const executiveSummary =
    dashboard.errors.criticalErrors > 0
      ? "Critical AI observability issues detected. Immediate review is required."
      : dashboard.errors.totalErrors > 0
        ? "AI service is operating with observable errors. Engineering review is recommended."
        : dashboard.drift.highDriftSignals > 0
          ? "AI service is showing model drift signals. Monitoring and validation are recommended."
          : dashboard.quality.lowQualitySignals > 0
            ? "AI quality degradation detected. Review model output quality and prompts."
            : "AI service observability indicators are within healthy operating range.";

  return {
    organizationId,
    environment,
    serviceName,
    generatedAt: new Date(),
    dashboard,
    executiveSummary,
  };
}