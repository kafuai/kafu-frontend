import {
  SustainabilityMetric,
  SustainabilityScope,
} from "./sustainabilityTypes";

export type EnergyConsumptionInput = {
  organizationId: string;
  scope: SustainabilityScope;
  scopeId: string;
  resourceId: string;
  powerKw: number;
  usageHours: number;
  measuredAt?: Date;
};

export type EnergyConsumptionResult = {
  resourceId: string;
  powerKw: number;
  usageHours: number;
  totalKwh: number;
};

export function calculateEnergyConsumption(
  input: EnergyConsumptionInput,
): EnergyConsumptionResult {
  return {
    resourceId: input.resourceId,
    powerKw: input.powerKw,
    usageHours: input.usageHours,
    totalKwh: Number((input.powerKw * input.usageHours).toFixed(4)),
  };
}

export function mapEnergyConsumptionToMetric(
  input: EnergyConsumptionInput,
): SustainabilityMetric {
  const result = calculateEnergyConsumption(input);

  return {
    id: `${input.organizationId}:${input.scope}:${input.scopeId}:energy:${input.resourceId}`,
    organizationId: input.organizationId,
    scope: input.scope,
    scopeId: input.scopeId,
    category: "energy",
    name: `Energy consumption - ${input.resourceId}`,
    value: result.totalKwh,
    unit: "kwh",
    measuredAt: input.measuredAt ?? new Date(),
    metadata: {
      resourceId: input.resourceId,
      powerKw: input.powerKw,
      usageHours: input.usageHours,
    },
  };
}