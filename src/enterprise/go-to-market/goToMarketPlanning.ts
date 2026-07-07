import {
  GoToMarketObjective,
  GoToMarketPlan,
  GoToMarketPriority,
} from "./goToMarketTypes";

export interface GoToMarketPlanningInput {
  name: string;
  objectives: GoToMarketObjective[];
}

export interface GoToMarketPlanningResult {
  plan: GoToMarketPlan;
  objectiveCount: number;
  criticalObjectiveCount: number;
  highestPriority: GoToMarketPriority;
}

export function createGoToMarketPlan(
  input: GoToMarketPlanningInput,
): GoToMarketPlanningResult {
  const timestamp = new Date().toISOString();

  const criticalObjectiveCount = input.objectives.filter(
    (objective) => objective.priority === "critical",
  ).length;

  return {
    plan: {
      id: `gtm-plan-${Date.now()}`,
      name: input.name,
      stage: "research",
      status: "ready",
      objectives: input.objectives,
      signals: [],
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    objectiveCount: input.objectives.length,
    criticalObjectiveCount,
    highestPriority: resolveHighestPriority(input.objectives),
  };
}

function resolveHighestPriority(
  objectives: GoToMarketObjective[],
): GoToMarketPriority {
  if (objectives.some((objective) => objective.priority === "critical")) {
    return "critical";
  }

  if (objectives.some((objective) => objective.priority === "high")) {
    return "high";
  }

  if (objectives.some((objective) => objective.priority === "medium")) {
    return "medium";
  }

  return "low";
}