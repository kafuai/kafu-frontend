import { AIInnovationPortfolio } from "./aiInnovationPortfolio";

export interface AIInnovationReportSummary {
  organizationId: string;
  generatedAt: Date;
  totalOpportunities: number;
  adoptedCount: number;
  experimentingCount: number;
  rejectedCount: number;
  averageScore: number;
  topOpportunityIds: string[];
}

export function createAIInnovationReportSummary(
  portfolio: AIInnovationPortfolio,
): AIInnovationReportSummary {
  const averageScore =
    portfolio.items.length === 0
      ? 0
      : portfolio.items.reduce((total, item) => total + item.score.totalScore, 0) /
        portfolio.items.length;

  return {
    organizationId: portfolio.organizationId,
    generatedAt: new Date(),
    totalOpportunities: portfolio.totalOpportunities,
    adoptedCount: portfolio.adoptedCount,
    experimentingCount: portfolio.experimentingCount,
    rejectedCount: portfolio.rejectedCount,
    averageScore,
    topOpportunityIds: portfolio.items.slice(0, 5).map((item) => item.opportunity.id),
  };
}

export function formatAIInnovationReportSummary(
  summary: AIInnovationReportSummary,
): string {
  return [
    `AI Innovation Report`,
    `Organization: ${summary.organizationId}`,
    `Generated At: ${summary.generatedAt.toISOString()}`,
    `Total Opportunities: ${summary.totalOpportunities}`,
    `Adopted: ${summary.adoptedCount}`,
    `Experimenting: ${summary.experimentingCount}`,
    `Rejected: ${summary.rejectedCount}`,
    `Average Score: ${summary.averageScore.toFixed(2)}`,
    `Top Opportunities: ${summary.topOpportunityIds.join(", ") || "None"}`,
  ].join("\n");
}