import { mapCarbonFootprintToMetric } from "./carbonFootprint";
import { mapEnergyConsumptionToMetric } from "./energyConsumption";
import { calculateResourceEfficiency } from "./resourceEfficiency";
import { createSustainabilityAssessment } from "./sustainabilityModel";
import { evaluateSustainabilityPolicy } from "./sustainabilityPolicyEvaluator";
import { createSustainabilityRecommendations } from "./sustainabilityRecommendation";
import { generateSustainabilityReport } from "./sustainabilityReport";
import {
  SustainabilityMetric,
  SustainabilityScope,
  SustainabilityTimeWindow,
} from "./sustainabilityTypes";
import { SustainabilityPolicy } from "./sustainabilityPolicy";

export type SustainabilityRuntimeInput = {
  organizationId: string;
  scope: SustainabilityScope;
  scopeId: string;
  window: SustainabilityTimeWindow;
  carbonSources?: {
    source: string;
    activityAmount: number;
    emissionFactorKgCo2e: number;
  }[];
  energySources?: {
    resourceId: string;
    powerKw: number;
    usageHours: number;
  }[];
  resourceEfficiencySources?: {
    resourceId: string;
    usefulOutput: number;
    consumedResource: number;
  }[];
  policies?: SustainabilityPolicy[];
};

export function runSustainabilityRuntime(input: SustainabilityRuntimeInput) {
  const carbonMetrics = (input.carbonSources ?? []).map((source) =>
    mapCarbonFootprintToMetric({
      organizationId: input.organizationId,
      scope: input.scope,
      scopeId: input.scopeId,
      ...source,
    }),
  );

  const energyMetrics = (input.energySources ?? []).map((source) =>
    mapEnergyConsumptionToMetric({
      organizationId: input.organizationId,
      scope: input.scope,
      scopeId: input.scopeId,
      ...source,
    }),
  );

  const efficiencyMetrics: SustainabilityMetric[] = (
    input.resourceEfficiencySources ?? []
  ).map((source) => {
    const result = calculateResourceEfficiency({
      organizationId: input.organizationId,
      scope: input.scope,
      scopeId: input.scopeId,
      ...source,
    });

    return {
      id: `${input.organizationId}:${input.scope}:${input.scopeId}:efficiency:${source.resourceId}`,
      organizationId: input.organizationId,
      scope: input.scope,
      scopeId: input.scopeId,
      category: "efficiency",
      name: `Resource efficiency - ${source.resourceId}`,
      value: result.efficiencyPercentage,
      unit: "percentage",
      measuredAt: new Date(),
      metadata: {
        resourceId: source.resourceId,
        usefulOutput: source.usefulOutput,
        consumedResource: source.consumedResource,
      },
    };
  });

  const metrics = [...carbonMetrics, ...energyMetrics, ...efficiencyMetrics];

  const assessment = createSustainabilityAssessment({
    organizationId: input.organizationId,
    scope: input.scope,
    scopeId: input.scopeId,
    metrics,
  });

  const policyEvaluations = (input.policies ?? []).map((policy) =>
    evaluateSustainabilityPolicy(policy, metrics),
  );

  const recommendations = createSustainabilityRecommendations(metrics);

  const report = generateSustainabilityReport({
    organizationId: input.organizationId,
    scope: input.scope,
    scopeId: input.scopeId,
    window: input.window,
    metrics,
    assessments: [assessment],
    recommendations,
  });

  return {
    metrics,
    assessment,
    policyEvaluations,
    recommendations,
    report,
  };
}