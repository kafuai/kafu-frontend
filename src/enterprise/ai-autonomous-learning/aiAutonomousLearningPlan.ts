import {
  AIAutonomousLearningAuditMetadata,
  AIAutonomousLearningPriority,
  AIAutonomousLearningStatus,
} from "./aiAutonomousLearningTypes";
import { AIAutonomousLearningInsight } from "./aiAutonomousLearningInsight";
import { AIAutonomousLearningObjective } from "./aiAutonomousLearningObjective";

export type AIAutonomousLearningPlanActionType =
  | "capture_more_feedback"
  | "update_prompt_strategy"
  | "update_knowledge_base"
  | "adjust_routing"
  | "recommend_fine_tuning"
  | "require_human_review";

export interface AIAutonomousLearningPlanAction {
  id: string;
  type: AIAutonomousLearningPlanActionType;
  title: string;
  description: string;
  priority: AIAutonomousLearningPriority;
  requiresApproval: boolean;
  relatedInsightIds: string[];
  relatedObjectiveIds: string[];
}

export interface AIAutonomousLearningPlan {
  id: string;
  organizationId: string;
  status: AIAutonomousLearningStatus;
  title: string;
  description: string;
  actions: AIAutonomousLearningPlanAction[];
  metadata: AIAutonomousLearningAuditMetadata;
}

export interface CreateAIAutonomousLearningPlanInput {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  actions?: AIAutonomousLearningPlanAction[];
  createdBy: string;
}

export function createAIAutonomousLearningPlan(
  input: CreateAIAutonomousLearningPlanInput,
): AIAutonomousLearningPlan {
  const now = new Date();

  return {
    id: input.id,
    organizationId: input.organizationId,
    status: "active",
    title: input.title,
    description: input.description,
    actions: input.actions ?? [],
    metadata: {
      createdAt: now,
      updatedAt: now,
      createdBy: input.createdBy,
    },
  };
}

export function createAIAutonomousLearningPlanAction(
  id: string,
  type: AIAutonomousLearningPlanActionType,
  title: string,
  description: string,
  priority: AIAutonomousLearningPriority,
  requiresApproval: boolean,
  relatedInsightIds: string[] = [],
  relatedObjectiveIds: string[] = [],
): AIAutonomousLearningPlanAction {
  return {
    id,
    type,
    title,
    description,
    priority,
    requiresApproval,
    relatedInsightIds,
    relatedObjectiveIds,
  };
}

export function createAIAutonomousLearningPlanFromInsights(
  id: string,
  organizationId: string,
  insights: AIAutonomousLearningInsight[],
  objectives: AIAutonomousLearningObjective[],
  createdBy: string,
): AIAutonomousLearningPlan {
  const actions = insights.map((insight, index) =>
    createAIAutonomousLearningPlanAction(
      `${id}-action-${index + 1}`,
      insight.impact === "negative" ? "require_human_review" : "update_prompt_strategy",
      insight.title,
      insight.summary,
      insight.priority,
      insight.priority === "critical",
      [insight.id],
      objectives.map((objective) => objective.id),
    ),
  );

  return createAIAutonomousLearningPlan({
    id,
    organizationId,
    title: "Autonomous Learning Improvement Plan",
    description: "Plan generated from autonomous learning insights and objectives.",
    actions,
    createdBy,
  });
}