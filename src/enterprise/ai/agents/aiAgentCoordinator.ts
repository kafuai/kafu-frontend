import { AIAgentExecution } from "./aiAgentExecution";

export interface AIAgentCoordinationResult {
  organizationId: string;
  totalExecutions: number;
  readyExecutions: AIAgentExecution[];
  blockedExecutions: AIAgentExecution[];
  coordinatedAt: Date;
}

export function coordinateAIAgentExecutions(
  organizationId: string,
  executions: readonly AIAgentExecution[],
): AIAgentCoordinationResult {
  const organizationExecutions = executions.filter(
    (execution) => execution.organizationId === organizationId,
  );

  return {
    organizationId,
    totalExecutions: organizationExecutions.length,
    readyExecutions: organizationExecutions.filter(
      (execution) => execution.status === "queued",
    ),
    blockedExecutions: organizationExecutions.filter(
      (execution) => execution.status === "failed",
    ),
    coordinatedAt: new Date(),
  };
}