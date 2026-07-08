export interface HRPolicy {
  id: string;
  name: string;
  rules: string[];
  active: boolean;
}

export function activateHRPolicy(
  policy: HRPolicy
): HRPolicy {
  return {
    ...policy,
    active: true,
  };
}

export function validateHRPolicy(
  policy: HRPolicy
): boolean {
  return policy.rules.length > 0;
}
