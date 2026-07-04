import {
  SustainabilityMetric,
  SustainabilityScope,
} from "./sustainabilityTypes";

export type ResourceEfficiencyInput = {
  organizationId: string;
  scope: SustainabilityScope;
  scopeId: string;
  resourceId: string;
  usefulOutput: number;
  consumedResource: number;
  measuredAt?: Date;
};

export type ResourceEfficiencyResult = {
  resourceId: string;
  usefulOutput: number;
  consumedResource: number;
  efficiencyPercentage: number;
};

export function calculateResourceEfficiency(
  input: ResourceEfficiencyInput,
): ResourceEfficiencyResult {
  const efficiencyPercentage =
    input.consumedResource === 0
      ? 0
      : Number(((input.usefulOutput / input.consumedResource) * 100).toFixed(2));

  return {
    resourceId: input.resourceId,
    usefulOutput: input.usefulOutput,
    consumedResource: input.consumedResource,
    efficiencyPercentage,
  };
}

export function mapResourceEfficiencyToMetric(
  input: ResourceEfficiencyInput,
): SustainabilityMetric {
  const result = calculateResourceEfficiency(input);

  return {
    id: `${input.organizationId}:${input.scope}:${input.scopeId}:resource-efficiency:${input.resourceId}`,
    organizationId: input.organizationId,
    scope: input.scope,
    scopeId: input.scopeId,
    category: "efficiency",
    name: `Resource efficiency - ${input.resourceId}`,
    value: result.efficiencyPercentage,
    unit: "percentage",
    measuredAt: input.measuredAt ?? new Date(),
    metadata: {
      resourceId: input.resourceId,
      usefulOutput: input.usefulOutput,
      consumedResource: input.consumedResource,
    },
  };
}