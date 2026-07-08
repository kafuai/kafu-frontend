import type { EnterpriseProcess, ProcessHealthStatus } from "./processExcellenceTypes";

export interface ProcessGovernanceDecision {
  processId: string;
  governanceAction: string;
  escalationRequired: boolean;
}

export function decideProcessGovernanceAction(
  process: EnterpriseProcess
): ProcessGovernanceDecision {
  const actions: Record<ProcessHealthStatus, string> = {
    healthy: "Continue standard monitoring cadence.",
    watch: "Increase review frequency and validate control effectiveness.",
    at_risk: "Launch corrective action plan with named owner.",
    critical: "Escalate to executive governance board immediately.",
  };

  return {
    processId: process.id,
    governanceAction: actions[process.status],
    escalationRequired: process.status === "critical" || process.status === "at_risk",
  };
}

export function getGovernanceDecisions(
  processes: EnterpriseProcess[]
): ProcessGovernanceDecision[] {
  return processes.map(decideProcessGovernanceAction);
}
