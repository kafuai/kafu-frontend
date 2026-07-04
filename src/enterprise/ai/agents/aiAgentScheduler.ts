import { AIAgentTask } from "./aiAgentWorkTypes";

const priorityWeight: Record<AIAgentTask["priority"], number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

export function scheduleAIAgentTasks(
  tasks: readonly AIAgentTask[],
): AIAgentTask[] {
  return [...tasks]
    .filter((task) => task.status === "queued" || task.status === "assigned")
    .sort((first, second) => {
      const priorityDifference =
        priorityWeight[second.priority] - priorityWeight[first.priority];

      if (priorityDifference !== 0) {
        return priorityDifference;
      }

      return first.createdAt.getTime() - second.createdAt.getTime();
    });
}