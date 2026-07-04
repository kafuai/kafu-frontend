import {
  ObservabilityAlert,
  ObservabilityContext,
  ObservabilitySeverity,
} from "./observabilityTypes";

export function createObservabilityAlert(
  severity: ObservabilitySeverity,
  title: string,
  message: string,
  context: ObservabilityContext,
): ObservabilityAlert {
  return {
    id: crypto.randomUUID(),
    timestamp: new Date(),
    severity,
    title,
    message,
    context,
    resolved: false,
  };
}

export function resolveObservabilityAlert(
  alert: ObservabilityAlert,
): ObservabilityAlert {
  return {
    ...alert,
    resolved: true,
  };
}