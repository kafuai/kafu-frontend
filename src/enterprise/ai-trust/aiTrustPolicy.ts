import { AITrustSignalCategory, AITrustLevel } from "./aiTrustTypes";

export interface AITrustPolicy {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  minimumTrustLevel: AITrustLevel;
  minimumTrustScore: number;
  requiredSignalCategories: AITrustSignalCategory[];
  requiresHumanReview: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export function isAITrustPolicySatisfied(
  score: number,
  presentCategories: AITrustSignalCategory[],
  policy: AITrustPolicy,
): boolean {
  const requiredCategoriesPresent = policy.requiredSignalCategories.every((category) =>
    presentCategories.includes(category),
  );

  return policy.active && score >= policy.minimumTrustScore && requiredCategoriesPresent;
}