export type StrategicPlanningHorizon =
  | "quarterly"
  | "semi_annual"
  | "annual"
  | "multi_year";

export type StrategicPriorityLevel = "low" | "medium" | "high" | "critical";

export type StrategicPlanningConfidence =
  | "low"
  | "moderate"
  | "strong"
  | "validated";

export interface StrategicObjective {
  id: string;
  title: string;
  description: string;
  priority: StrategicPriorityLevel;
  targetOutcome: string;
  successMetrics: string[];
  dependencies: string[];
  risks: string[];
}

export interface StrategicPlanningContext {
  organizationId: string;
  planningHorizon: StrategicPlanningHorizon;
  currentStateSummary: string;
  strategicObjectives: StrategicObjective[];
  operationalConstraints: string[];
  marketSignals: string[];
  executionSignals: string[];
}

export interface StrategicPlanningAssessment {
  objectiveId: string;
  feasibilityScore: number;
  impactScore: number;
  urgencyScore: number;
  dependencyComplexityScore: number;
  riskExposureScore: number;
  confidence: StrategicPlanningConfidence;
  recommendedFocus: string;
}

export interface StrategicPlanningResult {
  organizationId: string;
  planningHorizon: StrategicPlanningHorizon;
  assessments: StrategicPlanningAssessment[];
  strategicThemes: string[];
  executiveSummary: string;
  generatedAt: string;
}