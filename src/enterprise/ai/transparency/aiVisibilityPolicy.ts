import { AITransparencyAudience } from "./aiTransparencyTypes";

export interface AIVisibilityPolicy {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  allowedAudiences: AITransparencyAudience[];
  allowDataSources: boolean;
  allowLimitations: boolean;
  allowConfidence: boolean;
  allowHumanReviewStatus: boolean;
  allowPolicyConstraints: boolean;
  createdAt: Date;
}

export interface CreateAIVisibilityPolicyInput {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  allowedAudiences: AITransparencyAudience[];
  allowDataSources?: boolean;
  allowLimitations?: boolean;
  allowConfidence?: boolean;
  allowHumanReviewStatus?: boolean;
  allowPolicyConstraints?: boolean;
}

export function createAIVisibilityPolicy(
  input: CreateAIVisibilityPolicyInput,
): AIVisibilityPolicy {
  return {
    id: input.id,
    organizationId: input.organizationId,
    name: input.name,
    description: input.description,
    allowedAudiences: input.allowedAudiences,
    allowDataSources: input.allowDataSources ?? true,
    allowLimitations: input.allowLimitations ?? true,
    allowConfidence: input.allowConfidence ?? false,
    allowHumanReviewStatus: input.allowHumanReviewStatus ?? true,
    allowPolicyConstraints: input.allowPolicyConstraints ?? false,
    createdAt: new Date(),
  };
}