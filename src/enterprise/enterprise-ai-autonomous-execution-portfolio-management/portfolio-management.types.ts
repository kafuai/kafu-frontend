export type PortfolioPriority = "critical" | "high" | "medium" | "low";

export type PortfolioRiskLevel = "low" | "moderate" | "high" | "severe";

export type PortfolioExecutionStatus =
  | "planned"
  | "active"
  | "at_risk"
  | "blocked"
  | "completed";

export interface PortfolioInitiative {
  id: string;
  name: string;
  strategicObjective: string;
  priority: PortfolioPriority;
  status: PortfolioExecutionStatus;
  expectedValue: number;
  executionCost: number;
  riskScore: number;
  confidenceScore: number;
  dependencies: string[];
}

export interface PortfolioProfile {
  portfolioId: string;
  portfolioName: string;
  businessUnit: string;
  planningHorizon: string;
  initiatives: PortfolioInitiative[];
}

export interface PortfolioHealthScore {
  portfolioId: string;
  overallScore: number;
  valueScore: number;
  riskScore: number;
  executionScore: number;
  alignmentScore: number;
  riskLevel: PortfolioRiskLevel;
}

export interface PortfolioAllocationRecommendation {
  initiativeId: string;
  recommendedAllocationWeight: number;
  rationale: string;
}

export interface PortfolioManagementResult {
  portfolioId: string;
  health: PortfolioHealthScore;
  prioritizedInitiatives: PortfolioInitiative[];
  allocationRecommendations: PortfolioAllocationRecommendation[];
  executiveSummary: string;
}