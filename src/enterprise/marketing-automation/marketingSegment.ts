import { MarketingPriority, MarketingSegment } from "./marketingAutomationTypes";

export function createMarketingSegment(input: MarketingSegment): MarketingSegment {
  return {
    ...input,
    estimatedSize: Math.max(0, input.estimatedSize),
    criteria: input.criteria.filter(Boolean),
  };
}

export function rankMarketingSegment(segment: MarketingSegment): number {
  const priorityWeight: Record<MarketingPriority, number> = {
    low: 1,
    medium: 2,
    high: 3,
    critical: 4,
  };

  return segment.estimatedSize * priorityWeight[segment.priority];
}

export function isSegmentActionable(segment: MarketingSegment): boolean {
  return segment.estimatedSize > 0 && segment.criteria.length > 0;
}
