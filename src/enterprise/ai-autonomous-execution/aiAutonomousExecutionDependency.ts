import { AIAutonomousExecutionTask } from "./aiAutonomousExecutionTask";

export interface AIAutonomousExecutionDependencyCheck {
  taskId: string;
  ready: boolean;
  missingDependencies: string[];
}

export function checkAIAutonomousExecutionDependencies(
  task: AIAutonomousExecutionTask,
  tasks: AIAutonomousExecutionTask[],
): AIAutonomousExecutionDependencyCheck {
  const completedTaskIds = new Set(
    tasks
      .filter((candidate) => candidate.status === "completed")
      .map((candidate) => candidate.id),
  );

  const missingDependencies = task.dependencies.filter(
    (dependencyId) => !completedTaskIds.has(dependencyId),
  );

  return {
    taskId: task.id,
    ready: missingDependencies.length === 0,
    missingDependencies,
  };
}

export function getReadyAIAutonomousExecutionTasks(
  tasks: AIAutonomousExecutionTask[],
): AIAutonomousExecutionTask[] {
  return tasks.filter((task) => {
    if (task.status !== "pending" && task.status !== "ready") {
      return false;
    }

    return checkAIAutonomousExecutionDependencies(task, tasks).ready;
  });
}