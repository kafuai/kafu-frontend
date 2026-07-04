import { createObservabilityIntegrationPayload } from "./observabilityIntegration";
import { ObservabilityRegistryState } from "./observabilityRegistry";

export type ObservabilityRuntimeAdapterResult = {
  ready: boolean;
  layer: "observability";
  generatedAt: Date;
  payload: ReturnType<typeof createObservabilityIntegrationPayload>;
};

export function createObservabilityRuntimeAdapterResult(
  state: ObservabilityRegistryState,
): ObservabilityRuntimeAdapterResult {
  return {
    ready: true,
    layer: "observability",
    generatedAt: new Date(),
    payload: createObservabilityIntegrationPayload(state),
  };
}