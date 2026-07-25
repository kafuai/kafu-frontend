import type {
  SalesCommunicationRuntime,
} from "../salesCommunicationRuntime";

import {
  LeadCommunicationWorkflow,
} from "./leadCommunicationWorkflow";

export interface LeadCommunicationRuntime {
  readonly workflow:
    LeadCommunicationWorkflow;
}

export function createLeadCommunicationRuntime(
  salesCommunication:
    Pick<SalesCommunicationRuntime, "orchestrator">,
): LeadCommunicationRuntime {
  return {
    workflow:
      new LeadCommunicationWorkflow(
        salesCommunication.orchestrator,
      ),
  };
}
