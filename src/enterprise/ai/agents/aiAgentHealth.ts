import { AIAgentExecution } from "./aiAgentExecution";
import { AIAgentProfile } from "./aiAgentTypes";

export type AIAgentHealthStatus = "healthy" | "degraded" | "unhealthy";

export interface AIAgentHealthCheck {
  agentId: string;
  organizationId: string;
  status: AIAgentHealthStatus;
  recentExecutions: number;
  failedExecutions: number;
  failureRate: number;
  checkedAt: Date;
}

export function checkAIAgentHealth(
  agent: AIAgentProfile,
  executions: readonly AIAgentExecution[],
): AIAgentHealthCheck {
  const agentExecutions = executions.filter(
    (execution) =>
      execution.organizationId === agent.organizationId &&
      execution.agentId === agent.id,
  );

  const failedExecutions = agentExecutions.filter(
    (execution) => execution.status === "failed",
  ).length;

  const failureRate =
    agentExecutions.length === 0 ? 0 : failedExecutions / agentExecutions.length;

  const status: AIAgentHealthStatus =
    failureRate >= 0.5
      ? "unhealthy"
      : failureRate > 0
        ? "degraded"
        : "healthy";

  return {
    agentId: agent.id,
    organizationId: agent.organizationId,
    status,
    recentExecutions: agentExecutions.length,
    failedExecutions,
    failureRate,
    checkedAt: new Date(),
  };
}