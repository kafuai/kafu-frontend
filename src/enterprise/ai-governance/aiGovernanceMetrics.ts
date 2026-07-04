import { AIGovernanceRiskLevel } from "./aiGovernanceTypes";

export interface AIGovernanceMetric {
  id: string;
  organizationId: string;
  name: string;
  value: number;
  unit: "count" | "percentage" | "score";
  riskLevel?: AIGovernanceRiskLevel;
  measuredAt: Date;
}

export function createAIGovernanceMetric(
  metric: Omit<AIGovernanceMetric, "measuredAt">,
): AIGovernanceMetric {
  return {
    ...metric,
    measuredAt: new Date(),
  };
}