export type AIInnovationSignalSource =
  | "autonomous-evolution"
  | "learning-feedback"
  | "market-shift"
  | "customer-behavior"
  | "operational-gap"
  | "risk-pattern"
  | "performance-anomaly"
  | "strategic-objective";

export type AIInnovationOpportunityType =
  | "product"
  | "process"
  | "automation"
  | "experience"
  | "intelligence"
  | "risk-reduction"
  | "cost-optimization"
  | "revenue-expansion";

export type AIInnovationPriority = "low" | "medium" | "high" | "critical";

export type AIInnovationStatus =
  | "identified"
  | "scored"
  | "planned"
  | "experimenting"
  | "validated"
  | "adopted"
  | "rejected";

export type AIInnovationRiskLevel = "low" | "medium" | "high" | "critical";

export interface AIInnovationImpactEstimate {
  revenuePotential: number;
  costReductionPotential: number;
  customerValue: number;
  operationalEfficiency: number;
  strategicAlignment: number;
}

export interface AIInnovationFeasibilityEstimate {
  technicalFeasibility: number;
  dataReadiness: number;
  implementationEffort: number;
  organizationalReadiness: number;
  dependencyComplexity: number;
}

export interface AIInnovationScoreBreakdown {
  impactScore: number;
  feasibilityScore: number;
  riskAdjustedScore: number;
  confidenceScore: number;
  totalScore: number;
}

export interface AIInnovationAuditMetadata {
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  sourceMilestone?: string;
  traceId?: string;
}