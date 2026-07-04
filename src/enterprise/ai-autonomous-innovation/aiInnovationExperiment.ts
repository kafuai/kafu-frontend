import { AIInnovationOpportunity } from "./aiInnovationOpportunity";

export type AIInnovationExperimentStatus =
  | "draft"
  | "ready"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export interface AIInnovationExperimentMetric {
  name: string;
  baseline: number;
  target: number;
  current?: number;
  weight: number;
}

export interface AIInnovationExperiment {
  id: string;
  organizationId: string;
  opportunityId: string;
  title: string;
  hypothesis: string;
  scope: string;
  successCriteria: string[];
  metrics: AIInnovationExperimentMetric[];
  status: AIInnovationExperimentStatus;
  ownerTeam: string;
  startedAt?: Date;
  endedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAIInnovationExperimentInput {
  id: string;
  opportunity: AIInnovationOpportunity;
  title?: string;
  scope: string;
  successCriteria: string[];
  metrics: AIInnovationExperimentMetric[];
  ownerTeam: string;
}

export function createAIInnovationExperiment(
  input: CreateAIInnovationExperimentInput,
): AIInnovationExperiment {
  const now = new Date();

  return {
    id: input.id,
    organizationId: input.opportunity.organizationId,
    opportunityId: input.opportunity.id,
    title: input.title ?? `Experiment: ${input.opportunity.title}`,
    hypothesis: input.opportunity.hypothesis,
    scope: input.scope.trim(),
    successCriteria: input.successCriteria,
    metrics: input.metrics,
    status: "draft",
    ownerTeam: input.ownerTeam.trim(),
    createdAt: now,
    updatedAt: now,
  };
}

export function startAIInnovationExperiment(
  experiment: AIInnovationExperiment,
): AIInnovationExperiment {
  return {
    ...experiment,
    status: "running",
    startedAt: new Date(),
    updatedAt: new Date(),
  };
}

export function completeAIInnovationExperiment(
  experiment: AIInnovationExperiment,
  metrics: AIInnovationExperimentMetric[],
): AIInnovationExperiment {
  return {
    ...experiment,
    status: "completed",
    metrics,
    endedAt: new Date(),
    updatedAt: new Date(),
  };
}

export function calculateAIInnovationExperimentProgress(
  experiment: AIInnovationExperiment,
): number {
  if (experiment.metrics.length === 0) {
    return 0;
  }

  const totalWeight = experiment.metrics.reduce((total, metric) => total + metric.weight, 0);

  if (totalWeight <= 0) {
    return 0;
  }

  const weightedProgress = experiment.metrics.reduce((total, metric) => {
    const current = metric.current ?? metric.baseline;
    const distance = metric.target - metric.baseline;

    if (distance === 0) {
      return total + metric.weight;
    }

    const progress = Math.min(1, Math.max(0, (current - metric.baseline) / distance));

    return total + progress * metric.weight;
  }, 0);

  return weightedProgress / totalWeight;
}