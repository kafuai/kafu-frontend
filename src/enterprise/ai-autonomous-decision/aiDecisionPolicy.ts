import {
  AIDecisionPriority,
  AIDecisionRiskLevel,
} from "./aiAutonomousDecisionTypes";

export interface AIDecisionPolicy {
  id: string;
  name: string;
  description: string;
  minimumScore: number;
  minimumConfidence: number;
  allowedRiskLevels: AIDecisionRiskLevel[];
  autoApprovePriorities: AIDecisionPriority[];
  requiresHumanApproval: boolean;
  createdAt: Date;
}

export interface CreateAIDecisionPolicyInput {
  id: string;
  name: string;
  description: string;
  minimumScore?: number;
  minimumConfidence?: number;
  allowedRiskLevels?: AIDecisionRiskLevel[];
  autoApprovePriorities?: AIDecisionPriority[];
  requiresHumanApproval?: boolean;
}

export function createAIDecisionPolicy(
  input: CreateAIDecisionPolicyInput,
): AIDecisionPolicy {
  return {
    id: input.id,
    name: input.name,
    description: input.description,
    minimumScore: input.minimumScore ?? 0.6,
    minimumConfidence: input.minimumConfidence ?? 0.55,
    allowedRiskLevels: input.allowedRiskLevels ?? ["low", "medium"],
    autoApprovePriorities: input.autoApprovePriorities ?? ["low", "medium"],
    requiresHumanApproval: input.requiresHumanApproval ?? true,
    createdAt: new Date(),
  };
}