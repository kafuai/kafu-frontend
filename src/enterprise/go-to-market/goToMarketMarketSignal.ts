import {
  GoToMarketChannel,
  GoToMarketSegment,
} from "./goToMarketTypes";
import {
  GoToMarketMarketResearch,
  calculateMarketOpportunityScore,
} from "./goToMarketMarketResearch";

export interface GoToMarketMarketSignal {
  id: string;
  market: string;
  segment: GoToMarketSegment;
  channel: GoToMarketChannel;
  score: number;
  confidence: number;
  insight: string;
  detectedAt: string;
}

export function createMarketSignalFromResearch(
  research: GoToMarketMarketResearch,
  channel: GoToMarketChannel,
): GoToMarketMarketSignal {
  const score = calculateMarketOpportunityScore(research);

  return {
    id: `market-signal-${Date.now()}`,
    market: research.market,
    segment: research.segment,
    channel,
    score,
    confidence: Math.min(100, Math.max(0, score)),
    insight: `${research.market} shows a market opportunity score of ${score}.`,
    detectedAt: new Date().toISOString(),
  };
}