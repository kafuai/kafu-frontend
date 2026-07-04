import { createDefaultObservabilityConfiguration } from "./observabilityConfiguration";
import { createObservabilityRegistryState } from "./observabilityRegistry";

export type ObservabilityFactoryResult = {
  configuration: ReturnType<typeof createDefaultObservabilityConfiguration>;
  registry: ReturnType<typeof createObservabilityRegistryState>;
};

export function createObservabilityLayer(): ObservabilityFactoryResult {
  return {
    configuration: createDefaultObservabilityConfiguration(),
    registry: createObservabilityRegistryState(),
  };
}