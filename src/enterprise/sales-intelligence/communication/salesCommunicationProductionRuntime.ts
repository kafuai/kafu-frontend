import {
  communicationRuntime,
} from "../../communicationLayer/communicationRuntime";

import {
  communicationRepository,
} from "../../communicationLayer/supabaseCommunicationRepository";

import {
  createSalesCommunicationRuntime,
} from "./salesCommunicationRuntime";

export const salesCommunicationProductionRuntime =
  createSalesCommunicationRuntime({
    communicationApplicationService:
      communicationRuntime.application,
    communicationRepository,
  });

export const salesCommunicationOrchestrator =
  salesCommunicationProductionRuntime.orchestrator;

export const salesCommunicationLinkRepository =
  salesCommunicationProductionRuntime.links;
