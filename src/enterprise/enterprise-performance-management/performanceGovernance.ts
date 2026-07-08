export interface PerformanceGovernance {
  owner: string;
  controls: string[];
  policies: string[];
}

export function isPerformanceGovernanceReady(
  governance: PerformanceGovernance
): boolean {
  return (
    governance.controls.length > 0 &&
    governance.policies.length > 0
  );
}
