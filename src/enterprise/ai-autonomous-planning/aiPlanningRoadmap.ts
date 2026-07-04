import { AIPlanningOption } from "./aiPlanningOption";
import { AIAutonomousPlanningRoadmapPhaseStatus } from "./aiAutonomousPlanningTypes";

export interface AIPlanningRoadmapPhase {
  id: string;
  optionId: string;
  title: string;
  description: string;
  sequence: number;
  durationDays: number;
  deliverables: string[];
  dependencies: string[];
  status: AIAutonomousPlanningRoadmapPhaseStatus;
}

export interface AIPlanningRoadmap {
  id: string;
  objectiveId: string;
  optionId: string;
  title: string;
  phases: AIPlanningRoadmapPhase[];
  totalDurationDays: number;
  createdAt: Date;
}

export interface CreateAIPlanningRoadmapInput {
  id: string;
  option: AIPlanningOption;
  title: string;
  phases: Omit<AIPlanningRoadmapPhase, "optionId" | "status">[];
  createdAt?: Date;
}

export function createAIPlanningRoadmap(
  input: CreateAIPlanningRoadmapInput,
): AIPlanningRoadmap {
  const phases = input.phases
    .map((phase) => ({
      ...phase,
      optionId: input.option.id,
      status: "not_started" as const,
    }))
    .sort((a, b) => a.sequence - b.sequence);

  return {
    id: input.id,
    objectiveId: input.option.objectiveId,
    optionId: input.option.id,
    title: input.title,
    phases,
    totalDurationDays: phases.reduce(
      (total, phase) => total + phase.durationDays,
      0,
    ),
    createdAt: input.createdAt ?? new Date(),
  };
}

export function getReadyAIPlanningRoadmapPhases(
  roadmap: AIPlanningRoadmap,
): AIPlanningRoadmapPhase[] {
  const completedPhaseIds = new Set(
    roadmap.phases
      .filter((phase) => phase.status === "completed")
      .map((phase) => phase.id),
  );

  return roadmap.phases.filter((phase) => {
    if (phase.status !== "not_started") {
      return false;
    }

    return phase.dependencies.every((dependencyId) =>
      completedPhaseIds.has(dependencyId),
    );
  });
}