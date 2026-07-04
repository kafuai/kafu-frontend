import {
  AIAgentOperationAgent,
  AIAgentOperationAssignment,
  assignAIAgentOperationTask,
} from "./aiAgentOperationAssignment";
import { AIAgentOperationTask } from "./aiAgentOperationTask";

export interface AIAgentOperationRuntimeInput {
  operationId: string;
  tasks: AIAgentOperationTask[];
  agents: AIAgentOperationAgent[];
  startedAt?: Date;
}

export interface AIAgentOperationRuntimeResult {
  operationId: string;
  assignments: AIAgentOperationAssignment[];
  totalTasks: number;
  assignedTasks: number;
  blockedTasks: number;
  startedAt: Date;
  completedAt: Date;
  isOperational: boolean;
}

export function runAIAgentOperationRuntime(
  input: AIAgentOperationRuntimeInput,
): AIAgentOperationRuntimeResult {
  const startedAt = input.startedAt ?? new Date();

  const assignments = input.tasks.map((task) =>
    assignAIAgentOperationTask(task, input.agents),
  );

  const assignedTasks = assignments.filter(
    (assignment) => assignment.status === "assigned",
  ).length;

  const blockedTasks = assignments.filter(
    (assignment) => assignment.status === "blocked",
  ).length;

  return {
    operationId: input.operationId,
    assignments,
    totalTasks: input.tasks.length,
    assignedTasks,
    blockedTasks,
    startedAt,
    completedAt: new Date(),
    isOperational: blockedTasks === 0,
  };
}