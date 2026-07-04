import { AIInnovationOpportunity } from "./aiInnovationOpportunity";
import { AIInnovationScoreBreakdown } from "./aiAutonomousInnovationTypes";
import { scoreAIInnovationOpportunity } from "./aiInnovationScoring";

export interface AIInnovationPortfolioItem {
  opportunity: AIInnovationOpportunity;
  score: AIInnovationScoreBreakdown;
  rank: number;
}

export interface AIInnovationPortfolio {
  organizationId: string;
  items: AIInnovationPortfolioItem[];
  generatedAt: Date;
  totalOpportunities: number;
  adoptedCount: number;
  experimentingCount: number;
  rejectedCount: number;
}

export function createAIInnovationPortfolio(
  organizationId: string,
  opportunities: AIInnovationOpportunity[],
): AIInnovationPortfolio {
  const rankedItems = opportunities
    .filter((opportunity) => opportunity.organizationId === organizationId)
    .map((opportunity) => ({
      opportunity,
      score: scoreAIInnovationOpportunity(opportunity),
      rank: 0,
    }))
    .sort((a, b) => b.score.totalScore - a.score.totalScore)
    .map((item, index) => ({
      ...item,
      rank: index + 1,
    }));

  return {
    organizationId,
    items: rankedItems,
    generatedAt: new Date(),
    totalOpportunities: rankedItems.length,
    adoptedCount: rankedItems.filter((item) => item.opportunity.status === "adopted").length,
    experimentingCount: rankedItems.filter(
      (item) => item.opportunity.status === "experimenting",
    ).length,
    rejectedCount: rankedItems.filter((item) => item.opportunity.status === "rejected").length,
  };
}

export function getTopAIInnovationPortfolioItems(
  portfolio: AIInnovationPortfolio,
  limit: number,
): AIInnovationPortfolioItem[] {
  return portfolio.items.slice(0, Math.max(0, limit));
}

export function calculateAIInnovationPortfolioAverageScore(
  portfolio: AIInnovationPortfolio,
): number {
  if (portfolio.items.length === 0) {
    return 0;
  }

  return (
    portfolio.items.reduce((total, item) => total + item.score.totalScore, 0) /
    portfolio.items.length
  );
}