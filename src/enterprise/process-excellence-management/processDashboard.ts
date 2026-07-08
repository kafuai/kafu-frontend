import type { EnterpriseProcess, ProcessExcellenceSummary } from "./processExcellenceTypes";
import { generateImprovementOpportunities } from "./processImprovement";
import { detectProcessRisks } from "./processRisk";

export function buildProcessExcellenceSummary(
  processes: EnterpriseProcess[]
): ProcessExcellenceSummary {
  if (processes.length === 0) {
    return {
      totalProcesses: 0,
      criticalProcesses: 0,
      averageAutomationCoverage: 0,
      averageCycleTimeHours: 0,
      highPriorityImprovements: 0,
      criticalRisks: 0,
    };
  }

  const improvements = generateImprovementOpportunities(processes);
  const risks = detectProcessRisks(processes);

  return {
    totalProcesses: processes.length,
    criticalProcesses: processes.filter(
      (process) =>
        process.criticality === "high" || process.criticality === "mission_critical"
    ).length,
    averageAutomationCoverage: Math.round(
      processes.reduce((sum, process) => sum + process.automationCoverage, 0) /
        processes.length
    ),
    averageCycleTimeHours: Math.round(
      processes.reduce((sum, process) => sum + process.cycleTimeHours, 0) /
        processes.length
    ),
    highPriorityImprovements: improvements.filter(
      (item) => item.priority === "high" || item.priority === "urgent"
    ).length,
    criticalRisks: risks.filter((risk) => risk.severity === "urgent").length,
  };
}
