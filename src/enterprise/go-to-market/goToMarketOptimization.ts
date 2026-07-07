import { GoToMarketChannelPerformance } from "./goToMarketChannelOptimization";
import { GoToMarketRecommendation } from "./goToMarketRecommendation";
import { GoToMarketWinLossSummary } from "./goToMarketWinLossAnalysis";

export interface GoToMarketOptimizationReport {
  generatedAt: string;
  winLoss: GoToMarketWinLossSummary;
  channels: GoToMarketChannelPerformance[];
  recommendations: GoToMarketRecommendation[];
}

export function createGoToMarketOptimizationReport(
  winLoss: GoToMarketWinLossSummary,
  channels: GoToMarketChannelPerformance[],
  recommendations: GoToMarketRecommendation[],
): GoToMarketOptimizationReport {
  return {
    generatedAt: new Date().toISOString(),
    winLoss,
    channels,
    recommendations,
  };
}