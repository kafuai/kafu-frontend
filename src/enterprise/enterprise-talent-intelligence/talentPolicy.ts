export interface TalentPolicy {
  id: string;
  name: string;
  rules: string[];
  active: boolean;
}

export function activateTalentPolicy(
  policy: TalentPolicy
): TalentPolicy {
  return {
    ...policy,
    active: true,
  };
}

export function validateTalentPolicy(
  policy: TalentPolicy
): boolean {
  return policy.rules.length > 0;
}
