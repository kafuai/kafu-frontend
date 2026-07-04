import { createObservabilitySnapshot } from "./observabilityEngine";
import { ObservabilityRegistryState } from "./observabilityRegistry";

export type ObservabilityIntegrationPayload = {
  layer: "observability";
  generatedAt: Date;
  snapshot: ReturnType<typeof createObservabilitySnapshot>;
};

export function createObservabilityIntegrationPayload(
  state: ObservabilityRegistryState,
): ObservabilityIntegrationPayload {
  return {
    layer: "observability",
    generatedAt: new Date(),
    snapshot: createObservabilitySnapshot(state),
  };
}