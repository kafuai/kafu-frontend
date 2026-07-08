export interface PerformancePolicy {
  id: string;
  name: string;
  rules: string[];
  active: boolean;
}

export function activatePerformancePolicy(
  policy: PerformancePolicy
): PerformancePolicy {
  return {
    ...policy,
    active: true,
  };
}

export function validatePerformancePolicy(
  policy: PerformancePolicy
): boolean {
  return policy.rules.length > 0;
}
