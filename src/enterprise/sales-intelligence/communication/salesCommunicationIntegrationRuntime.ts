import {
  createSalesCommunicationRuntime,
  type CreateSalesCommunicationRuntimeInput,
  type SalesCommunicationRuntime,
} from "./salesCommunicationRuntime";

import {
  createSalesCommunicationWorkflowRuntime,
  type SalesCommunicationWorkflowRuntime,
} from "./salesCommunicationWorkflowRuntime";

export interface SalesCommunicationIntegrationRuntime {
  readonly communication:
    SalesCommunicationRuntime;

  readonly workflows:
    SalesCommunicationWorkflowRuntime;
}

export function createSalesCommunicationIntegrationRuntime(
  input: CreateSalesCommunicationRuntimeInput,
): SalesCommunicationIntegrationRuntime {
  const communication =
    createSalesCommunicationRuntime(input);

  const workflows =
    createSalesCommunicationWorkflowRuntime(
      communication,
    );

  return {
    communication,
    workflows,
  };
}
