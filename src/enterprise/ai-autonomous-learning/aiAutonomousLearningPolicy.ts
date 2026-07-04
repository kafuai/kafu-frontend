import {
  AIAutonomousLearningAuditMetadata,
  AIAutonomousLearningObjectiveCategory,
  AIAutonomousLearningPriority,
} from "./aiAutonomousLearningTypes";

export interface AIAutonomousLearningPolicy {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  allowedCategories: AIAutonomousLearningObjectiveCategory[];
  blockedCategories: AIAutonomousLearningObjectiveCategory[];
  minimumConfidenceForAutonomousAction: "medium" | "high";
  requireHumanApprovalForCriticalPriority: boolean;
  allowBehaviorAdaptation: boolean;
  allowKnowledgeBaseUpdate: boolean;
  allowModelFineTuningRecommendation: boolean;
  metadata: AIAutonomousLearningAuditMetadata;
}

export interface CreateAIAutonomousLearningPolicyInput {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  allowedCategories?: AIAutonomousLearningObjectiveCategory[];
  blockedCategories?: AIAutonomousLearningObjectiveCategory[];
  minimumConfidenceForAutonomousAction?: "medium" | "high";
  requireHumanApprovalForCriticalPriority?: boolean;
  allowBehaviorAdaptation?: boolean;
  allowKnowledgeBaseUpdate?: boolean;
  allowModelFineTuningRecommendation?: boolean;
  createdBy: string;
}

export function createAIAutonomousLearningPolicy(
  input: CreateAIAutonomousLearningPolicyInput,
): AIAutonomousLearningPolicy {
  const now = new Date();

  return {
    id: input.id,
    organizationId: input.organizationId,
    name: input.name,
    description: input.description,
    allowedCategories: input.allowedCategories ?? [
      "accuracy",
      "reliability",
      "safety",
      "efficiency",
      "personalization",
      "governance",
      "business_value",
    ],
    blockedCategories: input.blockedCategories ?? [],
    minimumConfidenceForAutonomousAction: input.minimumConfidenceForAutonomousAction ?? "high",
    requireHumanApprovalForCriticalPriority: input.requireHumanApprovalForCriticalPriority ?? true,
    allowBehaviorAdaptation: input.allowBehaviorAdaptation ?? true,
    allowKnowledgeBaseUpdate: input.allowKnowledgeBaseUpdate ?? true,
    allowModelFineTuningRecommendation: input.allowModelFineTuningRecommendation ?? false,
    metadata: {
      createdAt: now,
      updatedAt: now,
      createdBy: input.createdBy,
    },
  };
}

export function canAIAutonomousLearningCategoryProceed(
  policy: AIAutonomousLearningPolicy,
  category: AIAutonomousLearningObjectiveCategory,
): boolean {
  return policy.allowedCategories.includes(category) && !policy.blockedCategories.includes(category);
}

export function requiresAIAutonomousLearningHumanApproval(
  policy: AIAutonomousLearningPolicy,
  priority: AIAutonomousLearningPriority,
): boolean {
  return priority === "critical" && policy.requireHumanApprovalForCriticalPriority;
}