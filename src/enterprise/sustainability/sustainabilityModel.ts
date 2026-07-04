import {
  SustainabilityAssessment,
  SustainabilityImpactLevel,
  SustainabilityMetric,
  SustainabilityScope,
} from "./sustainabilityTypes";

export type SustainabilityModelInput = {
  organizationId: string;
  scope: SustainabilityScope;
  scopeId: string;
  metrics: SustainabilityMetric[];
};

function resolveImpactLevel(score: number): SustainabilityImpactLevel {
  if (score >= 85) return "low";
  if (score >= 65) return "medium";
  if (score >= 40) return "high";
  return "critical";
}

export function calculateSustainabilityScore(
  metrics: SustainabilityMetric[],
): number {
  if (metrics.length === 0) return 0;

  const normalized = metrics.map((metric) => {
    if (metric.unit === "percentage" || metric.unit === "score") {
      return Math.max(0, Math.min(100, metric.value));
    }

    return Math.max(0, 100 - Math.min(100, metric.value));
  });

  const total = normalized.reduce((sum, value) => sum + value, 0);

  return Math.round(total / normalized.length);
}

export function createSustainabilityAssessment(
  input: SustainabilityModelInput,
): SustainabilityAssessment {
  const score = calculateSustainabilityScore(input.metrics);

  return {
    id: `${input.organizationId}:${input.scope}:${input.scopeId}:sustainability-assessment`,
    organizationId: input.organizationId,
    scope: input.scope,
    scopeId: input.scopeId,
    score,
    impactLevel: resolveImpactLevel(score),
    metrics: input.metrics,
    assessedAt: new Date(),
  };
}