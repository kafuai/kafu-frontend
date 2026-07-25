import {
  createDiscoveryCommunicationRuntime,
  type DiscoveryCommunicationRuntime,
} from "./discovery-workflow";

import {
  createLeadCommunicationRuntime,
  type LeadCommunicationRuntime,
} from "./lead-workflow";

import {
  createOpportunityCommunicationRuntime,
  type OpportunityCommunicationRuntime,
} from "./opportunity-workflow";

import type {
  SalesCommunicationRuntime,
} from "./salesCommunicationRuntime";

export interface SalesCommunicationWorkflowRuntime {
  readonly lead:
    LeadCommunicationRuntime;

  readonly opportunity:
    OpportunityCommunicationRuntime;

  readonly discovery:
    DiscoveryCommunicationRuntime;
}

export function createSalesCommunicationWorkflowRuntime(
  salesCommunication:
    Pick<SalesCommunicationRuntime, "orchestrator">,
): SalesCommunicationWorkflowRuntime {
  return {
    lead:
      createLeadCommunicationRuntime(
        salesCommunication,
      ),

    opportunity:
      createOpportunityCommunicationRuntime(
        salesCommunication,
      ),

    discovery:
      createDiscoveryCommunicationRuntime(
        salesCommunication,
      ),
  };
}
