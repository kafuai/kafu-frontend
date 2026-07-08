export interface WorkforcePolicy {
  id: string;
  name: string;
  rules: string[];
  active: boolean;
}

export function activateWorkforcePolicy(
  policy: WorkforcePolicy
): WorkforcePolicy {
  return {
    ...policy,
    active: true,
  };
}

export function validateWorkforcePolicy(
  policy: WorkforcePolicy
): boolean {
  return policy.rules.length > 0;
}
