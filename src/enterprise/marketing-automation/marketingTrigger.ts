export type MarketingTrigger = {
  id: string;
  name: string;
  event: string;
  enabled: boolean;
};

export function createMarketingTrigger(
  id: string,
  name: string,
  event: string,
): MarketingTrigger {
  return {
    id,
    name,
    event,
    enabled: true,
  };
}

export function isTriggerEnabled(trigger: MarketingTrigger): boolean {
  return trigger.enabled;
}
