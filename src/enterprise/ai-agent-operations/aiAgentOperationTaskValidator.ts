import { AIAgentOperationTask } from "./aiAgentOperationTask";

export function assertValidAIAgentOperationTask(
  task: AIAgentOperationTask,
): void {
  if (!task.id.trim()) {
    throw new Error("AI agent operation task id is required.");
  }

  if (!task.organizationId.trim()) {
    throw new Error("AI agent operation task organizationId is required.");
  }

  if (!task.title.trim()) {
    throw new Error("AI agent operation task title is required.");
  }

  if (!task.description.trim()) {
    throw new Error("AI agent operation task description is required.");
  }

  if (!task.capabilityId.trim()) {
    throw new Error("AI agent operation task capabilityId is required.");
  }

  if (task.requiredAgentId !== undefined && !task.requiredAgentId.trim()) {
    throw new Error("AI agent operation task requiredAgentId cannot be empty.");
  }

  const dependencySet = new Set(task.dependencies);

  if (dependencySet.size !== task.dependencies.length) {
    throw new Error("AI agent operation task dependencies must be unique.");
  }

  if (dependencySet.has(task.id)) {
    throw new Error("AI agent operation task cannot depend on itself.");
  }
}