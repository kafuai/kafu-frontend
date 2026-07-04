import {
  SustainabilityMetric,
  SustainabilityScope,
} from "./sustainabilityTypes";

export type CarbonFootprintInput = {
  organizationId: string;
  scope: SustainabilityScope;
  scopeId: string;
  source: string;
  activityAmount: number;
  emissionFactorKgCo2e: number;
  measuredAt?: Date;
};

export type CarbonFootprintResult = {
  source: string;
  activityAmount: number;
  emissionFactorKgCo2e: number;
  totalKgCo2e: number;
};

export function calculateCarbonFootprint(
  input: CarbonFootprintInput,
): CarbonFootprintResult {
  return {
    source: input.source,
    activityAmount: input.activityAmount,
    emissionFactorKgCo2e: input.emissionFactorKgCo2e,
    totalKgCo2e: Number(
      (input.activityAmount * input.emissionFactorKgCo2e).toFixed(4),
    ),
  };
}

export function mapCarbonFootprintToMetric(
  input: CarbonFootprintInput,
): SustainabilityMetric {
  const result = calculateCarbonFootprint(input);

  return {
    id: `${input.organizationId}:${input.scope}:${input.scopeId}:carbon:${input.source}`,
    organizationId: input.organizationId,
    scope: input.scope,
    scopeId: input.scopeId,
    category: "carbon",
    name: `Carbon footprint - ${input.source}`,
    value: result.totalKgCo2e,
    unit: "kg_co2e",
    measuredAt: input.measuredAt ?? new Date(),
    metadata: {
      source: input.source,
      activityAmount: input.activityAmount,
      emissionFactorKgCo2e: input.emissionFactorKgCo2e,
    },
  };
}