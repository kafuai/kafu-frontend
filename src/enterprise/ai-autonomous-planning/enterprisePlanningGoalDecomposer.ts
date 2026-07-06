import {
  EnterprisePlanningGoal,
  EnterprisePlanningStep,
} from "./enterpriseAIPlanningEngineTypes";

export function decomposeEnterprisePlanningGoals(
  goals: EnterprisePlanningGoal[]
): EnterprisePlanningStep[] {
  return goals
    .sort((a, b) => priorityWeight(b.priority) - priorityWeight(a.priority))
    .map((goal, index) => ({
      id: `step-${goal.id}`,
      title: `Execute: ${goal.title}`,
      description: goal.description,
      sequence: index + 1,
      dependencies: index === 0 ? [] : [`step-${goals[index - 1].id}`],
      requiredResources: [],
      expectedOutcome: goal.expectedOutcome,
    }));
}

function priorityWeight(priority: EnterprisePlanningGoal["priority"]): number {
  const weights = {
    low: 1,
    medium: 2,
    high: 3,
    critical: 4,
  };

  return weights[priority];
}