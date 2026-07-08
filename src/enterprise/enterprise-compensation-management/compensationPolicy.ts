export interface CompensationPolicy {
  id: string;
  name: string;
  rules: string[];
  active: boolean;
}

export function activateCompensationPolicy(
  policy: CompensationPolicy
): CompensationPolicy {
  return {
    ...policy,
    active: true,
  };
}

export function validateCompensationPolicy(
  policy: CompensationPolicy
): boolean {
  return policy.rules.length > 0;
}
