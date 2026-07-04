import { AIAgentExecution } from "./aiAgentExecution";

export type AIAgentLearningOutcome =
  | "improved"
  | "unchanged"
  | "regressed"
  | "needs_review";

export interface AIAgentLearningRecord {
  id: string;
  organizationId: string;
  agentId: string;
  executionId: string;
  outcome: AIAgentLearningOutcome;
  lesson: string;
  recommendedActions: string[];
  createdAt: Date;
}

export function createAIAgentLearningRecord(
  id: string,
  execution: AIAgentExecution,
  outcome: AIAgentLearningOutcome,
  lesson: string,
  recommendedActions: string[] = [],
): AIAgentLearningRecord {
  return {
    id,
    organizationId: execution.organizationId,
    agentId: execution.agentId,
    executionId: execution.id,
    outcome,
    lesson,
    recommendedActions,
    createdAt: new Date(),
  };
}