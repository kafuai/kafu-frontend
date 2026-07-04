import type {
  ActivityPriority,
  EnterpriseExecutionActivity,
} from "./activityTypes";

export interface ActivityPlanningInput {
  taskId: string;
  title: string;
  description: string;
  owner: string;
  priority?: ActivityPriority;
  dependencies?: string[];
  dueAt?: string;
}

export function createPlannedActivity(
  input: ActivityPlanningInput
): EnterpriseExecutionActivity {
  const timestamp = new Date().toISOString();

  return {
    id: `activity-${input.taskId}-${Date.now()}`,
    taskId: input.taskId,
    title: input.title,
    description: input.description,
    owner: input.owner,
    status: "planned",
    priority: input.priority ?? "medium",
    progress: 0,
    riskLevel: "none",
    dependencies: input.dependencies ?? [],
    blockers: [],
    createdAt: timestamp,
    updatedAt: timestamp,
    dueAt: input.dueAt,
  };
}