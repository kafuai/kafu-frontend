export interface LearningPolicy {
  id: string;
  name: string;
  rules: string[];
  active: boolean;
}

export function activateLearningPolicy(
  policy: LearningPolicy
): LearningPolicy {
  return {
    ...policy,
    active: true,
  };
}

export function validateLearningPolicy(
  policy: LearningPolicy
): boolean {
  return policy.rules.length > 0;
}
