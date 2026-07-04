import {
  AIDecisionPriority,
  AIDecisionRiskLevel,
  AIDecisionStatus,
} from "./aiAutonomousDecisionTypes";

export interface AIDecisionOption {
  id: string;
  title: string;
  description: string;
  priority: AIDecisionPriority;
  riskLevel: AIDecisionRiskLevel;
  expectedValue: number;
  estimatedCost: number;
  feasibility: number;
  urgency: number;
  status: AIDecisionStatus;
  createdAt: Date;
  metadata?: Record<string, unknown>;
}

export interface CreateAIDecisionOptionInput {
  id: string;
  title: string;
  description: string;
  priority: AIDecisionPriority;
  riskLevel: AIDecisionRiskLevel;
  expectedValue: number;
  estimatedCost: number;
  feasibility: number;
  urgency: number;
  metadata?: Record<string, unknown>;
}

export function createAIDecisionOption(
  input: CreateAIDecisionOptionInput,
): AIDecisionOption {
  return {
    ...input,
    status: "draft",
    createdAt: new Date(),
  };
}