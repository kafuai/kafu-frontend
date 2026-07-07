export type PortfolioPriority = "low" | "medium" | "high" | "critical";

export type PortfolioStatus =
  | "draft"
  | "proposed"
  | "approved"
  | "active"
  | "paused"
  | "completed"
  | "cancelled";

export type PortfolioRiskLevel = "low" | "medium" | "high" | "critical";

export type PortfolioHealthStatus =
  | "healthy"
  | "watch"
  | "at_risk"
  | "critical";

export type PortfolioTimeHorizon =
  | "short_term"
  | "mid_term"
  | "long_term";

export interface PortfolioOwner {
  id: string;
  name: string;
  role: string;
}

export interface PortfolioMetric {
  name: string;
  value: number;
  target: number;
  unit: string;
}

export interface PortfolioDecisionContext {
  strategyAlignmentScore: number;
  businessValueScore: number;
  readinessScore: number;
  riskScore: number;
  investmentScore: number;
}