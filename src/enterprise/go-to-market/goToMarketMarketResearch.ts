import {
  GoToMarketSegment,
  GoToMarketPriority,
} from "./goToMarketTypes";

export interface GoToMarketMarketResearch {
  id: string;
  market: string;
  segment: GoToMarketSegment;
  priority: GoToMarketPriority;
  marketSize: number;
  growthRate: number;
  demandScore: number;
  competitionScore: number;
  notes: string;
  analyzedAt: string;
}

export function createMarketResearch(
  market: string,
  segment: GoToMarketSegment,
  priority: GoToMarketPriority,
  marketSize: number,
  growthRate: number,
  demandScore: number,
  competitionScore: number,
  notes: string,
): GoToMarketMarketResearch {
  return {
    id: `market-research-${Date.now()}`,
    market,
    segment,
    priority,
    marketSize,
    growthRate,
    demandScore,
    competitionScore,
    notes,
    analyzedAt: new Date().toISOString(),
  };
}

export function calculateMarketOpportunityScore(
  research: GoToMarketMarketResearch,
): number {
  const score =
    research.marketSize * 0.35 +
    research.growthRate * 0.25 +
    research.demandScore * 0.25 +
    (100 - research.competitionScore) * 0.15;

  return Math.round(score);
}