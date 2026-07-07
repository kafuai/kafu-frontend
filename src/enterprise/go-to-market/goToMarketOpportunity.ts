import { GoToMarketPriority } from "./goToMarketTypes";
import { GoToMarketMarketSignal } from "./goToMarketMarketSignal";

export interface GoToMarketOpportunity {
  id: string;
  market: string;
  priority: GoToMarketPriority;
  score: number;
  summary: string;
  createdAt: string;
}

export function createGoToMarketOpportunity(
  signal: GoToMarketMarketSignal,
): GoToMarketOpportunity {
  return {
    id: `gtm-opportunity-${Date.now()}`,
    market: signal.market,
    priority: resolveOpportunityPriority(signal.score),
    score: signal.score,
    summary: signal.insight,
    createdAt: new Date().toISOString(),
  };
}

function resolveOpportunityPriority(score: number): GoToMarketPriority {
  if (score >= 85) return "critical";
  if (score >= 70) return "high";
  if (score >= 50) return "medium";
  return "low";
}