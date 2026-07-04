import {
  AIAutonomousPlanningConstraintType,
  AIAutonomousPlanningPriority,
  AIAutonomousPlanningRiskLevel,
} from "./aiAutonomousPlanningTypes";

export interface AIPlanningConstraint {
  id: string;
  organizationId: string;
  objectiveId: string;
  type: AIAutonomousPlanningConstraintType;
  title: string;
  description: string;
  priority: AIAutonomousPlanningPriority;
  riskLevel: AIAutonomousPlanningRiskLevel;
  isBlocking: boolean;
  mitigationActions: string[];
  createdAt: Date;
}

export interface CreateAIPlanningConstraintInput {
  id: string;
  organizationId: string;
  objectiveId: string;
  type: AIAutonomousPlanningConstraintType;
  title: string;
  description: string;
  priority: AIAutonomousPlanningPriority;
  riskLevel: AIAutonomousPlanningRiskLevel;
  isBlocking?: boolean;
  mitigationActions?: string[];
  createdAt?: Date;
}

export function createAIPlanningConstraint(
  input: CreateAIPlanningConstraintInput,
): AIPlanningConstraint {
  return {
    id: input.id,
    organizationId: input.organizationId,
    objectiveId: input.objectiveId,
    type: input.type,
    title: input.title,
    description: input.description,
    priority: input.priority,
    riskLevel: input.riskLevel,
    isBlocking: input.isBlocking ?? false,
    mitigationActions: [...(input.mitigationActions ?? [])],
    createdAt: input.createdAt ?? new Date(),
  };
}

export function isAIPlanningConstraintBlocking(
  constraint: AIPlanningConstraint,
): boolean {
  return constraint.isBlocking || constraint.riskLevel === "critical";
}

export function getBlockingAIPlanningConstraints(
  constraints: AIPlanningConstraint[],
): AIPlanningConstraint[] {
  return constraints.filter(isAIPlanningConstraintBlocking);
}