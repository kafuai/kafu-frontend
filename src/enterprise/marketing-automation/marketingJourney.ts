import { MarketingJourney } from "./marketingAutomationTypes";

export function createMarketingJourney(input: MarketingJourney): MarketingJourney {
  return {
    ...input,
    steps: input.steps.map((step, index) => ({
      ...step,
      delayHours: Math.max(0, step.delayHours ?? index * 24),
    })),
  };
}

export function isJourneyExecutable(journey: MarketingJourney): boolean {
  return journey.active && journey.steps.length > 0;
}

export function getJourneyChannelCount(journey: MarketingJourney): number {
  return new Set(journey.steps.map((step) => step.channel)).size;
}
