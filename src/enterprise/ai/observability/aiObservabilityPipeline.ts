import {
  AIObservabilityAlert,
} from "./aiObservabilityAlert";
import {
  AIObservabilityAlertRule,
} from "./aiObservabilityAlertRules";
import {
  evaluateAIObservabilityAlerts,
} from "./aiObservabilityAlertEngine";
import {
  buildAIObservabilityDashboard,
  AIObservabilityDashboard,
} from "./aiObservabilityDashboard";
import {
  AIObservabilityReport,
  generateAIObservabilityReport,
} from "./aiObservabilityReport";
import {
  AIObservabilitySnapshot,
} from "./aiObservabilityTypes";
import {
  AIObservabilitySignal,
} from "./aiObservabilityTypes";
import {
  createAIObservabilitySnapshot,
} from "./aiObservabilitySnapshot";

export interface AIObservabilityPipelineInput {
  organizationId: string;
  environment: string;
  serviceName: string;
  signals: AIObservabilitySignal[];
  alertRules: AIObservabilityAlertRule[];
}

export interface AIObservabilityPipelineResult {
  snapshot: AIObservabilitySnapshot;
  dashboard: AIObservabilityDashboard;
  alerts: AIObservabilityAlert[];
  report: AIObservabilityReport;
}

export function runAIObservabilityPipeline(
  input: AIObservabilityPipelineInput,
): AIObservabilityPipelineResult {
  const scopedSignals = input.signals.filter(
    (signal) =>
      signal.metadata.organizationId === input.organizationId &&
      signal.metadata.environment === input.environment &&
      signal.metadata.serviceName === input.serviceName,
  );

  return {
    snapshot: createAIObservabilitySnapshot(
      input.organizationId,
      input.environment,
      input.serviceName,
      scopedSignals,
    ),
    dashboard: buildAIObservabilityDashboard(scopedSignals),
    alerts: evaluateAIObservabilityAlerts(scopedSignals, input.alertRules),
    report: generateAIObservabilityReport(
      input.organizationId,
      input.environment,
      input.serviceName,
      scopedSignals,
    ),
  };
}