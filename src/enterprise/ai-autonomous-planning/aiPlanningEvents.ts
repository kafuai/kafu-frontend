import { AIPlanningObjective } from "./aiPlanningObjective";
import { AIPlanningOption } from "./aiPlanningOption";
import { AIPlanningRoadmap } from "./aiPlanningRoadmap";

export type AIPlanningEventType =
  | "planning_objective_created"
  | "planning_objective_approved"
  | "planning_option_created"
  | "planning_option_selected"
  | "planning_roadmap_created"
  | "planning_validation_failed";

export interface AIPlanningEvent {
  id: string;
  organizationId: string;
  type: AIPlanningEventType;
  entityId: string;
  entityType: "objective" | "option" | "roadmap" | "validation";
  message: string;
  metadata: Record<string, string | number | boolean>;
  occurredAt: Date;
}

export function createAIPlanningObjectiveCreatedEvent(
  id: string,
  objective: AIPlanningObjective,
  occurredAt: Date = new Date(),
): AIPlanningEvent {
  return {
    id,
    organizationId: objective.organizationId,
    type: "planning_objective_created",
    entityId: objective.id,
    entityType: "objective",
    message: `Planning objective created: ${objective.title}`,
    metadata: {
      strategyId: objective.strategyId,
      priority: objective.priority,
      type: objective.type,
    },
    occurredAt,
  };
}

export function createAIPlanningOptionSelectedEvent(
  id: string,
  objective: AIPlanningObjective,
  option: AIPlanningOption,
  score: number,
  occurredAt: Date = new Date(),
): AIPlanningEvent {
  return {
    id,
    organizationId: objective.organizationId,
    type: "planning_option_selected",
    entityId: option.id,
    entityType: "option",
    message: `Planning option selected: ${option.name}`,
    metadata: {
      objectiveId: objective.id,
      optionType: option.type,
      score,
      confidence: option.confidence,
    },
    occurredAt,
  };
}

export function createAIPlanningRoadmapCreatedEvent(
  id: string,
  organizationId: string,
  roadmap: AIPlanningRoadmap,
  occurredAt: Date = new Date(),
): AIPlanningEvent {
  return {
    id,
    organizationId,
    type: "planning_roadmap_created",
    entityId: roadmap.id,
    entityType: "roadmap",
    message: `Planning roadmap created: ${roadmap.title}`,
    metadata: {
      objectiveId: roadmap.objectiveId,
      optionId: roadmap.optionId,
      phases: roadmap.phases.length,
      totalDurationDays: roadmap.totalDurationDays,
    },
    occurredAt,
  };
}