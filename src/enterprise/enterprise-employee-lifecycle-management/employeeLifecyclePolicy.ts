export interface EmployeeLifecyclePolicy {
  id: string;
  name: string;
  rules: string[];
  active: boolean;
}

export function activateEmployeePolicy(
  policy: EmployeeLifecyclePolicy
): EmployeeLifecyclePolicy {
  return {
    ...policy,
    active: true,
  };
}

export function validateEmployeePolicy(
  policy: EmployeeLifecyclePolicy
): boolean {
  return policy.rules.length > 0;
}
