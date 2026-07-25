import {
  communicationRuntime,
} from "../../communicationLayer/communicationRuntime";

import {
  communicationRepository,
} from "../../communicationLayer/supabaseCommunicationRepository";

import {
  communicationAuditWriter,
} from "../../communicationLayer/supabaseCommunicationAuditWriter";

import {
  bootstrapOmnichannelRuntime,
} from "../../communicationLayer/omnichannel/omnichannelBootstrap";

import {
  QueuedOmnichannelDeliveryRuntime,
} from "../../communicationLayer/omnichannel/queuedOmnichannelDeliveryRuntime";

import {
  createSalesCommunicationRuntime,
} from "./salesCommunicationRuntime";

const salesOmnichannelRuntime =
  bootstrapOmnichannelRuntime();

export const salesQueuedOmnichannelDeliveryRuntime =
  new QueuedOmnichannelDeliveryRuntime({
    repository: communicationRepository,
    runtime: salesOmnichannelRuntime,
    auditWriter: communicationAuditWriter,
    auditSource:
      "sales-intelligence-production-runtime",
  });

export const salesCommunicationProductionRuntime =
  createSalesCommunicationRuntime({
    communicationApplicationService:
      communicationRuntime.application,
    communicationRepository,
    queuedDeliveryRuntime:
      salesQueuedOmnichannelDeliveryRuntime,
  });

export const salesCommunicationOrchestrator =
  salesCommunicationProductionRuntime.orchestrator;

export const salesCommunicationLinkRepository =
  salesCommunicationProductionRuntime.links;
