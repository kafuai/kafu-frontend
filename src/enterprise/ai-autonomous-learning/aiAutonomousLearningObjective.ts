import {
  AIAutonomousLearningAuditMetadata,
  AIAutonomousLearningObjectiveCategory,
  AIAutonomousLearningPriority,
  AIAutonomousLearningStatus,
} from "./aiAutonomousLearningTypes";

export interface AIAutonomousLearningObjective {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  category: AIAutonomousLearningObjectiveCategory;
  priority: AIAutonomousLearningPriority;
  status: AIAutonomousLearningStatus;
  targetMetric: string;
  targetValue: number;
  currentValue?: number;
  relatedSignalIds: string[];
  metadata: AIAutonomousLearningAuditMetadata;
}

export interface CreateAIAutonomousLearningObjectiveInput {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  category: AIAutonomousLearningObjectiveCategory;
  priority: AIAutonomousLearningPriority;
  targetMetric: string;
  targetValue: number;
  currentValue?: number;
  relatedSignalIds?: string[];
  createdBy: string;
}

export function createAIAutonomousLearningObjective(
  input: CreateAIAutonomousLearningObjectiveInput,
): AIAutonomousLearningObjective {
  const now = new Date();

  return {
    id: input.id,
    organizationId: input.organizationId,
    title: input.title,
    description: input.description,
    category: input.category,
    priority: input.priority,
    status: "active",
    targetMetric: input.targetMetric,
    targetValue: input.targetValue,
    currentValue: input.currentValue,
    relatedSignalIds: input.relatedSignalIds ?? [],
    metadata: {
      createdAt: now,
      updatedAt: now,
      createdBy: input.createdBy,
    },
  };
}

export function calculateAIAutonomousLearningObjectiveProgress(
  objective: AIAutonomousLearningObjective,
): number {
  if (objective.currentValue === undefined || objective.targetValue === 0) {
    return 0;
  }

  return Math.min(100, Math.max(0, (objective.currentValue / objective.targetValue) * 100));
}

export function isAIAutonomousLearningObjectiveCompleted(
  objective: AIAutonomousLearningObjective,
): boolean {
  return calculateAIAutonomousLearningObjectiveProgress(objective) >= 100;
}