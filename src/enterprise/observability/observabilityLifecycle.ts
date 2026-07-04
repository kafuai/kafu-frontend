import { ObservabilityConfiguration } from "./observabilityConfiguration";

export type ObservabilityLifecycleState =
  | "created"
  | "started"
  | "stopped";

export type ObservabilityLifecycleResult = {
  state: ObservabilityLifecycleState;
  timestamp: Date;
  configuration: ObservabilityConfiguration;
};

export function startObservabilityLifecycle(
  configuration: ObservabilityConfiguration,
): ObservabilityLifecycleResult {
  return {
    state: "started",
    timestamp: new Date(),
    configuration,
  };
}

export function stopObservabilityLifecycle(
  configuration: ObservabilityConfiguration,
): ObservabilityLifecycleResult {
  return {
    state: "stopped",
    timestamp: new Date(),
    configuration,
  };
}