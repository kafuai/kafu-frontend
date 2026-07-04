import {
  SustainabilityAssessment,
  SustainabilityMetric,
  SustainabilityScope,
} from "./sustainabilityTypes";
import { SustainabilityPolicyEvaluation } from "./sustainabilityPolicyEvaluator";
import { SustainabilityRecommendation } from "./sustainabilityRecommendation";

export type SustainabilityEventType =
  | "metric_recorded"
  | "assessment_created"
  | "policy_evaluated"
  | "recommendation_created"
  | "report_generated";

export type SustainabilityEvent = {
  id: string;
  organizationId: string;
  scope: SustainabilityScope;
  scopeId: string;
  type: SustainabilityEventType;
  payload:
    | SustainabilityMetric
    | SustainabilityAssessment
    | SustainabilityPolicyEvaluation
    | SustainabilityRecommendation
    | Record<string, string | number | boolean | Date>;
  occurredAt: Date;
};

export function createSustainabilityEvent(
  input: Omit<SustainabilityEvent, "id" | "occurredAt">,
): SustainabilityEvent {
  return {
    ...input,
    id: `${input.organizationId}:${input.scope}:${input.scopeId}:${input.type}:${Date.now()}`,
    occurredAt: new Date(),
  };
}