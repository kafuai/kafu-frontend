import type { CorporateDNA, CorporateTrait } from "./corporateDNA";
export type DecisionReadiness =
  | "ready"
  | "needs_alignment"
  | "needs_data"
  | "high_risk";

export type StrategicFocus =
  | "stabilize_foundation"
  | "improve_operations"
  | "strengthen_leadership"
  | "accelerate_growth"
  | "reduce_risk"
  | "build_digital_maturity";

export type BrainAlertLevel = "low" | "medium" | "high" | "critical";

export type CorporateBrainSignal = {
  title: string;
  description: string;
  level: BrainAlertLevel;
  source: string;
};

export type CorporateBrainRecommendation = {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  expectedImpact: string;
};

export type ExecutiveMemory = {
  keyObservations: string[];
  recurringPatterns: string[];
  strategicConcerns: string[];
};

export type CorporateBrain = {
  dna: CorporateDNA;

  decisionReadiness: DecisionReadiness;
  strategicFocus: StrategicFocus[];

  intelligenceScore: number;
  confidenceScore: number;

  strengths: CorporateTrait[];
  risks: CorporateTrait[];

  alerts: CorporateBrainSignal[];
  opportunities: CorporateBrainSignal[];
  recommendations: CorporateBrainRecommendation[];

  executiveMemory: ExecutiveMemory;

  nextActions: string[];
  generatedAt: string;
};