export interface LearningGovernance {
  owner: string;
  controls: string[];
  policies: string[];
}

export function isLearningGovernanceReady(
  governance: LearningGovernance
): boolean {
  return (
    governance.controls.length > 0 &&
    governance.policies.length > 0
  );
}
