import { AIExecutionPredictionRiskLevel } from "./aiExecutionPredictionTypes";

export type AIExecutionPredictionModelType =
  | "trend_based"
  | "risk_based"
  | "scenario_based"
  | "hybrid";

export interface AIExecutionPredictionModelFactor {
  id: string;
  name: string;
  weight: number;
  riskLevel: AIExecutionPredictionRiskLevel;
  description: string;
}

export interface AIExecutionPredictionModel {
  id: string;
  name: string;
  type: AIExecutionPredictionModelType;
  version: string;
  factors: AIExecutionPredictionModelFactor[];
  confidenceThreshold: number;
  createdAt: Date;
  updatedAt: Date;
}

export function calculateAIExecutionPredictionModelConfidence(
  model: AIExecutionPredictionModel,
): number {
  if (model.factors.length === 0) {
    return 0;
  }

  const totalWeight = model.factors.reduce(
    (total, factor) => total + factor.weight,
    0,
  );

  return Math.min(1, Math.max(0, totalWeight / model.factors.length));
}