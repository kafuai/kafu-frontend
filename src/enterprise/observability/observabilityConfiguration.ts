export type ObservabilityConfiguration = {
  enabled: boolean;
  loggingEnabled: boolean;
  metricsEnabled: boolean;
  tracingEnabled: boolean;
  healthEnabled: boolean;
  diagnosticsEnabled: boolean;
  alertingEnabled: boolean;
  telemetryEnabled: boolean;
  retentionDays: number;
  samplingRate: number;
};

export function createDefaultObservabilityConfiguration(): ObservabilityConfiguration {
  return {
    enabled: true,
    loggingEnabled: true,
    metricsEnabled: true,
    tracingEnabled: true,
    healthEnabled: true,
    diagnosticsEnabled: true,
    alertingEnabled: true,
    telemetryEnabled: true,
    retentionDays: 30,
    samplingRate: 1,
  };
}

export function isObservabilitySignalEnabled(
  configuration: ObservabilityConfiguration,
  signal: keyof Omit<
    ObservabilityConfiguration,
    "enabled" | "retentionDays" | "samplingRate"
  >,
): boolean {
  return configuration.enabled && configuration[signal];
}