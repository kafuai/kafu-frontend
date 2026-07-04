import {
  AIAutonomousStrategyPriority,
  AIAutonomousStrategyStatus,
  AIAutonomousStrategyTimeHorizon,
} from "./aiAutonomousStrategyTypes";

export interface AIStrategyObjective {
  id: string;
  organizationId: string;

  title: string;
  description: string;

  owner: string;

  priority: AIAutonomousStrategyPriority;
  status: AIAutonomousStrategyStatus;

  horizon: AIAutonomousStrategyTimeHorizon;

  targetOutcome: string;

  measurableIndicators: string[];

  dependencies: string[];

  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAIStrategyObjectiveInput {
  id: string;
  organizationId: string;

  title: string;
  description: string;

  owner: string;

  priority: AIAutonomousStrategyPriority;
  horizon: AIAutonomousStrategyTimeHorizon;

  targetOutcome: string;

  measurableIndicators?: string[];
  dependencies?: string[];
}

export function createAIStrategyObjective(
  input: CreateAIStrategyObjectiveInput,
): AIStrategyObjective {
  const now = new Date();

  return {
    id: input.id,
    organizationId: input.organizationId,

    title: input.title,
    description: input.description,

    owner: input.owner,

    priority: input.priority,
    status: "draft",

    horizon: input.horizon,

    targetOutcome: input.targetOutcome,

    measurableIndicators: input.measurableIndicators ?? [],
    dependencies: input.dependencies ?? [],

    createdAt: now,
    updatedAt: now,
  };
}