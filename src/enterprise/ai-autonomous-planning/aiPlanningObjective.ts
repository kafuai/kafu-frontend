import {
  AIAutonomousPlanningObjectiveType,
  AIAutonomousPlanningPriority,
  AIAutonomousPlanningStatus,
} from "./aiAutonomousPlanningTypes";

export interface AIPlanningObjective {
  id: string;
  organizationId: string;
  strategyId: string;
  title: string;
  description: string;
  type: AIAutonomousPlanningObjectiveType;
  priority: AIAutonomousPlanningPriority;
  status: AIAutonomousPlanningStatus;
  expectedOutcomes: string[];
  successMetrics: string[];
  planningHorizonDays: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAIPlanningObjectiveInput {
  id: string;
  organizationId: string;
  strategyId: string;
  title: string;
  description: string;
  type: AIAutonomousPlanningObjectiveType;
  priority: AIAutonomousPlanningPriority;
  expectedOutcomes: string[];
  successMetrics: string[];
  planningHorizonDays: number;
  createdBy: string;
  createdAt?: Date;
}

export function createAIPlanningObjective(
  input: CreateAIPlanningObjectiveInput,
): AIPlanningObjective {
  const createdAt = input.createdAt ?? new Date();

  return {
    id: input.id,
    organizationId: input.organizationId,
    strategyId: input.strategyId,
    title: input.title,
    description: input.description,
    type: input.type,
    priority: input.priority,
    status: "draft",
    expectedOutcomes: [...input.expectedOutcomes],
    successMetrics: [...input.successMetrics],
    planningHorizonDays: input.planningHorizonDays,
    createdBy: input.createdBy,
    createdAt,
    updatedAt: createdAt,
  };
}

export function approveAIPlanningObjective(
  objective: AIPlanningObjective,
  approvedAt: Date = new Date(),
): AIPlanningObjective {
  return {
    ...objective,
    status: "approved",
    updatedAt: approvedAt,
  };
}

export function blockAIPlanningObjective(
  objective: AIPlanningObjective,
  blockedAt: Date = new Date(),
): AIPlanningObjective {
  return {
    ...objective,
    status: "blocked",
    updatedAt: blockedAt,
  };
}