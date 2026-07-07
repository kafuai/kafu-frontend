import { GoToMarketCompetitiveAssessment } from "./goToMarketCompetitiveIntelligence";
import { GoToMarketMarketResearch } from "./goToMarketMarketResearch";
import { GoToMarketOpportunity } from "./goToMarketOpportunity";

export interface GoToMarketIntelligenceReport {
  research: GoToMarketMarketResearch;
  opportunities: GoToMarketOpportunity[];
  competition: GoToMarketCompetitiveAssessment;
  recommendation: string;
  generatedAt: string;
}

export function generateGoToMarketIntelligence(
  research: GoToMarketMarketResearch,
  opportunities: GoToMarketOpportunity[],
  competition: GoToMarketCompetitiveAssessment,
): GoToMarketIntelligenceReport {
  const recommendation =
    opportunities.length > 0 &&
    competition.averageDifferentiationScore >= 60
      ? "Proceed with market validation."
      : "Collect additional market intelligence.";

  return {
    research,
    opportunities,
    competition,
    recommendation,
    generatedAt: new Date().toISOString(),
  };
}