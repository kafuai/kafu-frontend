export type DecisionUrgency = "low" | "medium" | "high" | "critical";

export type DecisionConfidenceLevel =
  | "uncertain"
  | "moderate"
  | "strong"
  | "high-confidence";

export type DecisionImpactLevel =
  | "minimal"
  | "limited"
  | "meaningful"
  | "major"
  | "strategic";

export type DecisionRiskLevel =
  | "low"
  | "medium"
  | "high"
  | "severe";

export type DecisionSupportStatus =
  | "supported"
  | "needs-review"
  | "insufficient-context"
  | "blocked";