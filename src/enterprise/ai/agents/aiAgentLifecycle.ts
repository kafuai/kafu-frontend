import { AIAgentProfile } from "./aiAgentTypes";

export type AIAgentLifecycleStage =
  | "created"
  | "validated"
  | "activated"
  | "suspended"
  | "retired";

export interface AIAgentLifecycleRecord {
  agentId: string;
  organizationId: string;
  stage: AIAgentLifecycleStage;
  reason: string;
  changedAt: Date;
}

export function createAIAgentLifecycleRecord(
  agent: AIAgentProfile,
  stage: AIAgentLifecycleStage,
  reason: string,
): AIAgentLifecycleRecord {
  return {
    agentId: agent.id,
    organizationId: agent.organizationId,
    stage,
    reason,
    changedAt: new Date(),
  };
}

export function createAIAgentLifecycleTimeline(
  agent: AIAgentProfile,
): AIAgentLifecycleRecord[] {
  return [
    createAIAgentLifecycleRecord(
      agent,
      "created",
      `AI agent '${agent.id}' lifecycle initialized.`,
    ),
  ];
}