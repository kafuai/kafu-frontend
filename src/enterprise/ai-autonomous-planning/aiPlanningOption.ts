import { AIPlanningConstraint } from "./aiPlanningConstraint";
import { AIPlanningObjective } from "./aiPlanningObjective";
import {
  AIAutonomousPlanningConfidenceLevel,
  AIAutonomousPlanningOptionType,
} from "./aiAutonomousPlanningTypes";

export interface AIPlanningOption {
  id: string;
  objectiveId: string;
  name: string;
  description: string;
  type: AIAutonomousPlanningOptionType;
  estimatedCost: number;
  estimatedDurationDays: number;
  expectedValue: number;
  confidence: AIAutonomousPlanningConfidenceLevel;
  constraints: AIPlanningConstraint[];
  assumptions: string[];
}

export interface CreateAIPlanningOptionInput {
  id: string;
  objective: AIPlanningObjective;
  name: string;
  description: string;
  type: AIAutonomousPlanningOptionType;
  estimatedCost: number;
  estimatedDurationDays: number;
  expectedValue: number;
  confidence: AIAutonomousPlanningConfidenceLevel;
  constraints?: AIPlanningConstraint[];
  assumptions?: string[];
}

export function createAIPlanningOption(
  input: CreateAIPlanningOptionInput,
): AIPlanningOption {
  return {
    id: input.id,
    objectiveId: input.objective.id,
    name: input.name,
    description: input.description,
    type: input.type,
    estimatedCost: input.estimatedCost,
    estimatedDurationDays: input.estimatedDurationDays,
    expectedValue: input.expectedValue,
    confidence: input.confidence,
    constraints: [...(input.constraints ?? [])],
    assumptions: [...(input.assumptions ?? [])],
  };
}