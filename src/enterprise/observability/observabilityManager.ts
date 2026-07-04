import {
  ObservabilityConfiguration,
  createDefaultObservabilityConfiguration,
} from "./observabilityConfiguration";
import {
  ObservabilityRegistryState,
  createObservabilityRegistryState,
} from "./observabilityRegistry";
import {
  ObservabilityLifecycleResult,
  startObservabilityLifecycle,
  stopObservabilityLifecycle,
} from "./observabilityLifecycle";

export type ObservabilityManagerState = {
  configuration: ObservabilityConfiguration;
  registry: ObservabilityRegistryState;
  lifecycle?: ObservabilityLifecycleResult;
};

export function createObservabilityManagerState(): ObservabilityManagerState {
  return {
    configuration: createDefaultObservabilityConfiguration(),
    registry: createObservabilityRegistryState(),
  };
}

export function startObservabilityManager(
  state: ObservabilityManagerState,
): ObservabilityManagerState {
  return {
    ...state,
    lifecycle: startObservabilityLifecycle(state.configuration),
  };
}

export function stopObservabilityManager(
  state: ObservabilityManagerState,
): ObservabilityManagerState {
  return {
    ...state,
    lifecycle: stopObservabilityLifecycle(state.configuration),
  };
}