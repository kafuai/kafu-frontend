import { GoToMarketStatus } from "./goToMarketTypes";

export interface GoToMarketEvent {
  id: string;
  type: string;
  status: GoToMarketStatus;
  timestamp: string;
  actor: string;
  description: string;
}

export function createGoToMarketEvent(
  type: string,
  status: GoToMarketStatus,
  actor: string,
  description: string,
): GoToMarketEvent {
  return {
    id: `gtm-event-${Date.now()}`,
    type,
    status,
    timestamp: new Date().toISOString(),
    actor,
    description,
  };
}