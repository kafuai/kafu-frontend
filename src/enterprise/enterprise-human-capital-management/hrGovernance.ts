export interface HRGovernance {
  owner: string;
  controls: string[];
  policies: string[];
}

export function isHRGovernanceReady(
  governance: HRGovernance
): boolean {
  return (
    governance.controls.length > 0 &&
    governance.policies.length > 0
  );
}
