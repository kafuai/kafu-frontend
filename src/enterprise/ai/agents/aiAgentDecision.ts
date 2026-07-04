import { AIAgentTask } from "./aiAgentWorkTypes";

export type AIAgentDecisionOutcome =
  | "proceed"
  | "defer"
  | "escalate"
  | "reject";

export interface AIAgentDecision {
  id: string;
  organizationId: string;
  agentId: string;
  taskId: string;
  outcome: AIAgentDecisionOutcome;
  rationale: string;
  confidence: number;
  risks: string[];
  createdAt: Date;
}

export function createAIAgentDecision(
  id: string,
  task: AIAgentTask,
  outcome: AIAgentDecisionOutcome,
  rationale: string,
  confidence: number,
  risks: string[] = [],
): AIAgentDecision {
  return {
    id,
    organizationId: task.organizationId,
    agentId: task.agentId,
    taskId: task.id,
    outcome,
    rationale,
    confidence,
    risks,
    createdAt: new Date(),
  };
}