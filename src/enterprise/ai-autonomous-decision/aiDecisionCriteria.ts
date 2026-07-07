export type AIDecisionCriterionType =
  | "impact"
  | "confidence"
  | "cost"
  | "speed"
  | "risk"
  | "strategic_alignment"
  | "operational_feasibility"
  | "business_value"
  | "feasibility"
  | "urgency"
  | "customer_impact"
  | "operational_impact"
  | "compliance";

export interface AIDecisionCriterion {
  id: string;
  name: string;
  type: AIDecisionCriterionType;
  weight: number;
  required?: boolean;
}

export interface AIDecisionCriteria {
  impactWeight: number;
  confidenceWeight: number;
  costWeight: number;
  speedWeight: number;
  riskWeight: number;
}

export const defaultAIDecisionCriteria: AIDecisionCriteria = {
  impactWeight: 0.3,
  confidenceWeight: 0.25,
  costWeight: 0.15,
  speedWeight: 0.15,
  riskWeight: 0.15,
};

export function normalizeAIDecisionCriteriaWeights(
  criteria: AIDecisionCriterion[],
): AIDecisionCriterion[] {
  const totalWeight = criteria.reduce(
    (sum, criterion) => sum + Math.max(0, criterion.weight),
    0,
  );

  if (totalWeight === 0) {
    return criteria.map((criterion) => ({
      ...criterion,
      weight: 0,
    }));
  }

  return criteria.map((criterion) => ({
    ...criterion,
    weight: Math.max(0, criterion.weight) / totalWeight,
  }));
}