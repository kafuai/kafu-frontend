import {
  AIAutonomousDecisionPriority,
  AIAutonomousDecisionRiskLevel,
  AIAutonomousDecisionStatus,
} from "./aiAutonomousDecisionTypes";

export interface AIDecisionOption {
  id: string;
  title: string;
  description: string;

  status?: AIAutonomousDecisionStatus;
  priority: AIAutonomousDecisionPriority;
  riskLevel: AIAutonomousDecisionRiskLevel;

  expectedImpact: number;
  expectedValue: number;
  confidence: number;
  feasibility: number;
  urgency: number;

  cost: number;
  estimatedCost: number;

  timeToValueDays: number;
  estimatedDurationDays?: number;

  benefits?: string[];
  risks?: string[];
  dependencies?: string[];
}