export type AIAutonomousStrategyStatus =
  | "draft"
  | "evaluating"
  | "planned"
  | "approved"
  | "executing"
  | "completed"
  | "rejected";

export type AIAutonomousStrategyPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type AIAutonomousStrategyRiskLevel =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type AIAutonomousStrategyTimeHorizon =
  | "immediate"
  | "short-term"
  | "mid-term"
  | "long-term";

export interface AIAutonomousStrategyScore {
  value: number;
  confidence: number;
}

export interface AIAutonomousStrategyImpact {
  revenueGrowth: number;
  costReduction: number;
  customerValue: number;
  operationalEfficiency: number;
  strategicAdvantage: number;
}

export interface AIAutonomousStrategyRisk {
  level: AIAutonomousStrategyRiskLevel;
  summary: string;
  mitigation?: string;
}

export interface AIAutonomousStrategyRecommendation {
  summary: string;
  justification: string;
}