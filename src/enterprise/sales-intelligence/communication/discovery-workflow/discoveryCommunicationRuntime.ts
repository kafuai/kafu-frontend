import type {
  SalesCommunicationRuntime,
} from "../salesCommunicationRuntime";

import {
  DiscoveryCommunicationWorkflow,
} from "./discoveryCommunicationWorkflow";

export interface DiscoveryCommunicationRuntime {
  readonly workflow:
    DiscoveryCommunicationWorkflow;
}

export function createDiscoveryCommunicationRuntime(
  salesCommunication:
    Pick<SalesCommunicationRuntime, "orchestrator">,
): DiscoveryCommunicationRuntime {
  return {
    workflow:
      new DiscoveryCommunicationWorkflow(
        salesCommunication.orchestrator,
      ),
  };
}
