import { AIGovernancePolicy } from "./aiGovernanceTypes";
import { AIGovernedModel } from "./aiModelGovernance";
import { AIGovernanceMetric } from "./aiGovernanceMetrics";
import { AIGovernanceEvent } from "./aiGovernanceEvent";

export interface AIGovernanceReport {
  organizationId: string;
  generatedAt: Date;
  summary: {
    totalPolicies: number;
    activePolicies: number;
    governedModels: number;
    criticalEvents: number;
    averageGovernanceScore: number;
  };
  policies: AIGovernancePolicy[];
  models: AIGovernedModel[];
  metrics: AIGovernanceMetric[];
  events: AIGovernanceEvent[];
  recommendations: string[];
}

export function generateAIGovernanceReport(input: {
  organizationId: string;
  policies: AIGovernancePolicy[];
  models: AIGovernedModel[];
  metrics: AIGovernanceMetric[];
  events: AIGovernanceEvent[];
}): AIGovernanceReport {
  const organizationPolicies = input.policies.filter(
    (policy) => policy.organizationId === input.organizationId,
  );

  const organizationModels = input.models.filter(
    (model) => model.organizationId === input.organizationId,
  );

  const organizationEvents = input.events.filter(
    (event) => event.organizationId === input.organizationId,
  );

  const organizationMetrics = input.metrics.filter(
    (metric) => metric.organizationId === input.organizationId,
  );

  const scoreMetrics = organizationMetrics.filter(
    (metric) => metric.unit === "score",
  );

  const averageGovernanceScore =
    scoreMetrics.length === 0
      ? 0
      : Math.round(
          scoreMetrics.reduce((sum, metric) => sum + metric.value, 0) /
            scoreMetrics.length,
        );

  const recommendations: string[] = [];

  if (organizationPolicies.length === 0) {
    recommendations.push("Create AI governance policies for the organization.");
  }

  if (organizationModels.length === 0) {
    recommendations.push("Register AI models under governance.");
  }

  if (
    organizationEvents.some((event) => event.severity === "critical")
  ) {
    recommendations.push("Review critical AI governance events immediately.");
  }

  return {
    organizationId: input.organizationId,
    generatedAt: new Date(),
    summary: {
      totalPolicies: organizationPolicies.length,
      activePolicies: organizationPolicies.filter(
        (policy) => policy.status === "active",
      ).length,
      governedModels: organizationModels.length,
      criticalEvents: organizationEvents.filter(
        (event) => event.severity === "critical",
      ).length,
      averageGovernanceScore,
    },
    policies: organizationPolicies,
    models: organizationModels,
    metrics: organizationMetrics,
    events: organizationEvents,
    recommendations,
  };
}