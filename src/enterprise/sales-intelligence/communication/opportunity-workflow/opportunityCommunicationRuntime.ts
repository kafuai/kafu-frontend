import type {
  SalesCommunicationRuntime,
} from "../salesCommunicationRuntime";

import {
  OpportunityCommunicationWorkflow,
} from "./opportunityCommunicationWorkflow";

export interface OpportunityCommunicationRuntime {
  readonly workflow:
    OpportunityCommunicationWorkflow;
}

export function createOpportunityCommunicationRuntime(
  salesCommunication:
    Pick<SalesCommunicationRuntime, "orchestrator">,
): OpportunityCommunicationRuntime {
  return {
    workflow:
      new OpportunityCommunicationWorkflow(
        salesCommunication.orchestrator,
      ),
  };
}
