export interface BenefitGovernance {
  owner: string;
  controls: string[];
  policies: string[];
}

export function isBenefitGovernanceReady(
  governance: BenefitGovernance
): boolean {
  return (
    governance.controls.length > 0 &&
    governance.policies.length > 0
  );
}
