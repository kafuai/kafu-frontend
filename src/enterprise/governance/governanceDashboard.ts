import { GovernanceDecisionHistory } from "./governanceDecisionHistory";
import { createGovernanceDecisionReport } from "./governanceDecisionReporter";

export class GovernanceDashboard {
  constructor(
    private readonly history: GovernanceDecisionHistory,
  ) {}

  summary() {
    return createGovernanceDecisionReport(
      this.history.list(),
    );
  }
}