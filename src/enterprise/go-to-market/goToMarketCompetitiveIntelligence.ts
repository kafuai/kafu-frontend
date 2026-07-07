import { GoToMarketMarketResearch } from "./goToMarketMarketResearch";

export interface GoToMarketCompetitorProfile {
  id: string;
  name: string;
  marketShare: number;
  strengths: string[];
  weaknesses: string[];
  differentiationScore: number;
}

export interface GoToMarketCompetitiveAssessment {
  competitorCount: number;
  averageMarketShare: number;
  averageDifferentiationScore: number;
}

export function assessCompetitiveLandscape(
  _research: GoToMarketMarketResearch,
  competitors: GoToMarketCompetitorProfile[],
): GoToMarketCompetitiveAssessment {
  if (competitors.length === 0) {
    return {
      competitorCount: 0,
      averageMarketShare: 0,
      averageDifferentiationScore: 0,
    };
  }

  const totalMarketShare = competitors.reduce(
    (sum, competitor) => sum + competitor.marketShare,
    0,
  );

  const totalDifferentiation = competitors.reduce(
    (sum, competitor) => sum + competitor.differentiationScore,
    0,
  );

  return {
    competitorCount: competitors.length,
    averageMarketShare: Math.round(
      totalMarketShare / competitors.length,
    ),
    averageDifferentiationScore: Math.round(
      totalDifferentiation / competitors.length,
    ),
  };
}