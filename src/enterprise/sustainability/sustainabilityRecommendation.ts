import {
  SustainabilityImpactLevel,
  SustainabilityMetric,
  SustainabilityMetricCategory,
  SustainabilityScope,
} from "./sustainabilityTypes";

export type SustainabilityRecommendationType =
  | "reduce_carbon"
  | "optimize_energy"
  | "improve_efficiency"
  | "reduce_waste"
  | "policy_action";

export type SustainabilityRecommendation = {
  id: string;
  organizationId: string;
  scope: SustainabilityScope;
  scopeId: string;
  category: SustainabilityMetricCategory;
  type: SustainabilityRecommendationType;
  title: string;
  description: string;
  impactLevel: SustainabilityImpactLevel;
  estimatedImprovementPercentage: number;
  createdAt: Date;
};

function resolveRecommendationType(
  category: SustainabilityMetricCategory,
): SustainabilityRecommendationType {
  if (category === "carbon") return "reduce_carbon";
  if (category === "energy") return "optimize_energy";
  if (category === "efficiency") return "improve_efficiency";
  if (category === "waste") return "reduce_waste";
  return "policy_action";
}

function resolveImprovement(category: SustainabilityMetricCategory): number {
  if (category === "carbon") return 20;
  if (category === "energy") return 15;
  if (category === "efficiency") return 25;
  if (category === "waste") return 18;
  return 10;
}

export function createSustainabilityRecommendations(
  metrics: SustainabilityMetric[],
): SustainabilityRecommendation[] {
  return metrics
    .filter((metric) => {
      if (metric.category === "efficiency") return metric.value < 70;
      return metric.value > 0;
    })
    .map((metric) => ({
      id: `${metric.id}:recommendation`,
      organizationId: metric.organizationId,
      scope: metric.scope,
      scopeId: metric.scopeId,
      category: metric.category,
      type: resolveRecommendationType(metric.category),
      title: `Improve sustainability for ${metric.name}`,
      description: `Review ${metric.name} and apply optimization actions to reduce environmental impact.`,
      impactLevel:
        metric.value > 80
          ? "critical"
          : metric.value > 50
            ? "high"
            : metric.value > 20
              ? "medium"
              : "low",
      estimatedImprovementPercentage: resolveImprovement(metric.category),
      createdAt: new Date(),
    }));
}