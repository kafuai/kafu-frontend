import { AIDecisionPriority } from "./aiAutonomousDecisionTypes";

export interface AIDecisionContext {
  id: string;
  organizationId: string;
  requestedBy: string;
  objective: string;
  priority: AIDecisionPriority;
  constraints: string[];
  assumptions: string[];
  availableData: string[];
  createdAt: Date;
  sourceMilestone?: string;
  metadata?: Record<string, unknown>;
}

export interface CreateAIDecisionContextInput {
  id: string;
  organizationId: string;
  requestedBy: string;
  objective: string;
  priority: AIDecisionPriority;
  constraints?: string[];
  assumptions?: string[];
  availableData?: string[];
  sourceMilestone?: string;
  metadata?: Record<string, unknown>;
}

export function createAIDecisionContext(
  input: CreateAIDecisionContextInput,
): AIDecisionContext {
  return {
    ...input,
    constraints: input.constraints ?? [],
    assumptions: input.assumptions ?? [],
    availableData: input.availableData ?? [],
    createdAt: new Date(),
  };
}