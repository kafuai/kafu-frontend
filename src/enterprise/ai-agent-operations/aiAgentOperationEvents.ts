import { AIAgentOperationAssignment } from "./aiAgentOperationAssignment";
import { AIAgentOperationRuntimeResult } from "./aiAgentOperationRuntime";

export type AIAgentOperationEventType =
  | "ai_agent_operation_started"
  | "ai_agent_operation_assignment_created"
  | "ai_agent_operation_completed"
  | "ai_agent_operation_blocked";

export interface AIAgentOperationEvent {
  id: string;
  operationId: string;
  type: AIAgentOperationEventType;
  message: string;
  createdAt: Date;
  metadata: Record<string, string | number | boolean | undefined>;
}

export function createAIAgentOperationStartedEvent(
  operationId: string,
  totalTasks: number,
): AIAgentOperationEvent {
  return {
    id: `${operationId}:started`,
    operationId,
    type: "ai_agent_operation_started",
    message: `AI agent operation started with ${totalTasks} task(s).`,
    createdAt: new Date(),
    metadata: {
      totalTasks,
    },
  };
}

export function createAIAgentOperationAssignmentEvent(
  operationId: string,
  assignment: AIAgentOperationAssignment,
): AIAgentOperationEvent {
  return {
    id: `${operationId}:assignment:${assignment.taskId}`,
    operationId,
    type: "ai_agent_operation_assignment_created",
    message: assignment.reason,
    createdAt: new Date(),
    metadata: {
      taskId: assignment.taskId,
      agentId: assignment.agentId,
      status: assignment.status,
    },
  };
}

export function createAIAgentOperationCompletedEvent(
  result: AIAgentOperationRuntimeResult,
): AIAgentOperationEvent {
  return {
    id: `${result.operationId}:completed`,
    operationId: result.operationId,
    type: result.isOperational
      ? "ai_agent_operation_completed"
      : "ai_agent_operation_blocked",
    message: result.isOperational
      ? "AI agent operation completed successfully."
      : "AI agent operation completed with blocked task(s).",
    createdAt: result.completedAt,
    metadata: {
      totalTasks: result.totalTasks,
      assignedTasks: result.assignedTasks,
      blockedTasks: result.blockedTasks,
      isOperational: result.isOperational,
    },
  };
}

export function createAIAgentOperationEvents(
  result: AIAgentOperationRuntimeResult,
): AIAgentOperationEvent[] {
  return [
    createAIAgentOperationStartedEvent(result.operationId, result.totalTasks),
    ...result.assignments.map((assignment) =>
      createAIAgentOperationAssignmentEvent(result.operationId, assignment),
    ),
    createAIAgentOperationCompletedEvent(result),
  ];
}