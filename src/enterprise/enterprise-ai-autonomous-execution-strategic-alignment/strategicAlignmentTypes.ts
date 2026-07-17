export type StrategicAlignmentStatus =
  | "aligned"
  | "partially_aligned"
  | "misaligned"
  | "insufficient_context";

export type StrategicAlignmentLevel =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type StrategicAlignmentDimension =
  | "strategic_objectives"
  | "enterprise_priorities"
  | "portfolio_alignment"
  | "initiative_alignment"
  | "risk_constraints"
  | "execution_readiness";

export interface StrategicAlignmentDimensionScore {
  dimension: StrategicAlignmentDimension;
  score: number;
  weight: number;
  weightedScore: number;
  rationale: string;
}
