import {
  SustainabilityImpactLevel,
  SustainabilityMetricCategory,
  SustainabilityScope,
  SustainabilityStatus,
  SustainabilityTarget,
  SustainabilityUnit,
} from "./sustainabilityTypes";

export type SustainabilityPolicyRule = {
  id: string;
  category: SustainabilityMetricCategory;
  maxValue?: number;
  minValue?: number;
  unit: SustainabilityUnit;
  impactLevel: SustainabilityImpactLevel;
  message: string;
};

export type SustainabilityPolicy = {
  id: string;
  organizationId: string;
  name: string;
  scope: SustainabilityScope;
  scopeId?: string;
  status: SustainabilityStatus;
  rules: SustainabilityPolicyRule[];
  targets: SustainabilityTarget[];
  createdAt: Date;
  updatedAt: Date;
};

export function isSustainabilityPolicyActive(
  policy: SustainabilityPolicy,
): boolean {
  return policy.status === "active";
}