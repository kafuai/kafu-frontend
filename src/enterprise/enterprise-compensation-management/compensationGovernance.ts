export interface CompensationGovernance {
  owner: string;
  controls: string[];
  policies: string[];
}

export function isCompensationGovernanceReady(
  governance: CompensationGovernance
): boolean {
  return (
    governance.controls.length > 0 &&
    governance.policies.length > 0
  );
}
