export interface EmployeeLifecycleGovernance {
  owner: string;
  policies: string[];
  controls: string[];
}

export function isGovernanceReady(
  governance: EmployeeLifecycleGovernance
): boolean {
  return (
    governance.policies.length > 0 &&
    governance.controls.length > 0
  );
}
