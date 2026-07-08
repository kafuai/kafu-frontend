export interface WorkforceGovernance {
  owner: string;
  controls: string[];
  policies: string[];
}

export function isWorkforceGovernanceReady(
  governance: WorkforceGovernance
): boolean {
  return (
    governance.controls.length > 0 &&
    governance.policies.length > 0
  );
}
