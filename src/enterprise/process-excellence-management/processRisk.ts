import type { EnterpriseProcess, ProcessRiskSignal } from "./processExcellenceTypes";

export function detectProcessRisks(processes: EnterpriseProcess[]): ProcessRiskSignal[] {
  return processes.flatMap((process) => {
    const risks: ProcessRiskSignal[] = [];

    if (process.status === "critical" || process.status === "at_risk") {
      risks.push({
        id: `${process.id}-health-risk`,
        processId: process.id,
        risk: "Process health requires executive attention.",
        severity: process.status === "critical" ? "urgent" : "high",
        mitigation: "Assign accountable owner and launch immediate stabilization plan.",
      });
    }

    if (process.cycleTimeHours > 40) {
      risks.push({
        id: `${process.id}-cycle-time-risk`,
        processId: process.id,
        risk: "Cycle time exceeds expected operating threshold.",
        severity: "medium",
        mitigation: "Review bottlenecks, approvals, and manual handoffs.",
      });
    }

    return risks;
  });
}
