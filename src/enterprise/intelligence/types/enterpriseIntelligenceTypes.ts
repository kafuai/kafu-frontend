export type EnterpriseIntelligenceStatus =
  | "idle"
  | "learning"
  | "reasoning"
  | "planning"
  | "ready"
  | "failed";

export type EnterpriseIntelligencePriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type EnterpriseIntelligenceConfidence =
  | "low"
  | "medium"
  | "high";

export type EnterpriseIntelligenceDomain =
  | "strategy"
  | "operations"
  | "finance"
  | "people"
  | "risk"
  | "technology"
  | "customer"
  | "governance";