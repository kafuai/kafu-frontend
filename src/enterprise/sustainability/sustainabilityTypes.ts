export type SustainabilityStatus =
  | "draft"
  | "active"
  | "paused"
  | "archived";

export type SustainabilityScope =
  | "organization"
  | "department"
  | "team"
  | "project"
  | "service"
  | "resource";

export type SustainabilityImpactLevel =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type SustainabilityMetricCategory =
  | "carbon"
  | "energy"
  | "resource"
  | "waste"
  | "efficiency"
  | "compliance";

export type SustainabilityUnit =
  | "kg_co2e"
  | "kwh"
  | "liters"
  | "gb_hours"
  | "cpu_hours"
  | "requests"
  | "percentage"
  | "score"
  | "count";

export type SustainabilityTimeWindow = {
  startsAt: Date;
  endsAt: Date;
};

export type SustainabilityTarget = {
  id: string;
  organizationId: string;
  scope: SustainabilityScope;
  scopeId: string;
  category: SustainabilityMetricCategory;
  targetValue: number;
  unit: SustainabilityUnit;
  window: SustainabilityTimeWindow;
  status: SustainabilityStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type SustainabilityMetric = {
  id: string;
  organizationId: string;
  scope: SustainabilityScope;
  scopeId: string;
  category: SustainabilityMetricCategory;
  name: string;
  value: number;
  unit: SustainabilityUnit;
  measuredAt: Date;
  metadata?: Record<string, string | number | boolean>;
};

export type SustainabilityAssessment = {
  id: string;
  organizationId: string;
  scope: SustainabilityScope;
  scopeId: string;
  score: number;
  impactLevel: SustainabilityImpactLevel;
  metrics: SustainabilityMetric[];
  assessedAt: Date;
};