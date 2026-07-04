import { GovernanceDecision } from "./governanceTypes";

export class GovernanceDecisionHistory {
  private readonly decisions: GovernanceDecision[] = [];

  add(decision: GovernanceDecision): void {
    this.decisions.push(decision);
  }

  list(): GovernanceDecision[] {
    return [...this.decisions];
  }

  clear(): void {
    this.decisions.length = 0;
  }
}