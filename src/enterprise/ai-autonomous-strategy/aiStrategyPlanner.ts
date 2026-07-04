import {
  AIAutonomousStrategyPriority,
  AIAutonomousStrategyStatus,
  AIAutonomousStrategyTimeHorizon,
} from "./aiAutonomousStrategyTypes";
import { AIStrategyAssessment } from "./aiStrategyAssessment";

export interface AIStrategyInitiative {
  id: string;
  organizationId: string;

  assessmentId: string;

  title: string;
  description: string;

  priority: AIAutonomousStrategyPriority;
  status: AIAutonomousStrategyStatus;
  horizon: AIAutonomousStrategyTimeHorizon;

  expectedOutcome: string;
  successMetrics: string[];

  owner?: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAIStrategyInitiativeInput {
  id: string;
  assessment: AIStrategyAssessment;

  title: string;
  description: string;

  priority?: AIAutonomousStrategyPriority;
  horizon?: AIAutonomousStrategyTimeHorizon;

  expectedOutcome: string;
  successMetrics?: string[];

  owner?: string;
}

function derivePriority(assessment: AIStrategyAssessment): AIAutonomousStrategyPriority {
  const impactAverage =
    (assessment.impact.revenueGrowth +
      assessment.impact.costReduction +
      assessment.impact.customerValue +
      assessment.impact.operationalEfficiency +
      assessment.impact.strategicAdvantage) /
    5;

  if (impactAverage >= 0.85 && assessment.strategicFit.value >= 0.75) {
    return "critical";
  }

  if (impactAverage >= 0.7) {
    return "high";
  }

  if (impactAverage >= 0.45) {
    return "medium";
  }

  return "low";
}

export function createAIStrategyInitiative(
  input: CreateAIStrategyInitiativeInput,
): AIStrategyInitiative {
  const now = new Date();

  return {
    id: input.id,
    organizationId: input.assessment.organizationId,

    assessmentId: input.assessment.id,

    title: input.title,
    description: input.description,

    priority: input.priority ?? derivePriority(input.assessment),
    status: "planned",
    horizon: input.horizon ?? "short-term",

    expectedOutcome: input.expectedOutcome,
    successMetrics: input.successMetrics ?? [],

    owner: input.owner,

    createdAt: now,
    updatedAt: now,
  };
}