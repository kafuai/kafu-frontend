import type {
  DecisionImpactLevel,
  DecisionRiskLevel,
} from "./decisionSupportTypes";

export interface DecisionOption {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly expectedImpact: DecisionImpactLevel;
  readonly riskLevel: DecisionRiskLevel;
  readonly confidenceScore: number;
  readonly estimatedEffort: number;
  readonly businessValue: number;
  readonly constraints?: readonly string[];
  readonly dependencies?: readonly string[];
}