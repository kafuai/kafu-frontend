import type {
  CommunicationApplicationService,
} from "../../communicationLayer/application/communicationApplicationService";

import type {
  CommunicationRepository,
} from "../../communicationLayer/communicationRepository";

import type {
  QueuedOmnichannelDeliveryRuntime,
} from "../../communicationLayer/omnichannel/queuedOmnichannelDeliveryRuntime";

import {
  SalesCommunicationFacade,
} from "./salesCommunicationFacade";

import {
  RepositorySalesCommunicationLinkRepository,
  type SalesCommunicationLinkRepository,
} from "./salesCommunicationLinkRepository";

import {
  SalesCommunicationOrchestrator,
} from "./salesCommunicationOrchestrator";

import {
  SalesCommunicationService,
} from "./salesCommunicationService";

export interface SalesCommunicationRuntime {
  readonly service: SalesCommunicationService;
  readonly facade: SalesCommunicationFacade;
  readonly links: SalesCommunicationLinkRepository;
  readonly orchestrator:
    SalesCommunicationOrchestrator;
}

export interface CreateSalesCommunicationRuntimeInput {
  readonly communicationApplicationService:
    CommunicationApplicationService;
  readonly communicationRepository:
    CommunicationRepository;
  readonly queuedDeliveryRuntime?:
    QueuedOmnichannelDeliveryRuntime;
}

export function createSalesCommunicationRuntime(
  input: CreateSalesCommunicationRuntimeInput,
): SalesCommunicationRuntime {
  const service =
    new SalesCommunicationService(
      input.communicationApplicationService,
      input.queuedDeliveryRuntime,
    );

  const facade =
    new SalesCommunicationFacade(service);

  const links =
    new RepositorySalesCommunicationLinkRepository(
      input.communicationRepository,
    );

  const orchestrator =
    new SalesCommunicationOrchestrator(
      facade,
      links,
    );

  return {
    service,
    facade,
    links,
    orchestrator,
  };
}
