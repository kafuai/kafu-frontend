export interface TalentGovernance {
  owner: string;
  controls: string[];
  policies: string[];
}

export function isTalentGovernanceReady(
  governance: TalentGovernance
): boolean {
  return (
    governance.controls.length > 0 &&
    governance.policies.length > 0
  );
}
