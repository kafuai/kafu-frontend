import type {
  EnterpriseProcess,
  ProcessImprovementOpportunity,
} from "./processExcellenceTypes";

export function generateImprovementOpportunities(
  processes: EnterpriseProcess[]
): ProcessImprovementOpportunity[] {
  return processes.flatMap((process) => {
    const opportunities: ProcessImprovementOpportunity[] = [];

    if (process.automationCoverage < 70) {
      opportunities.push({
        id: `${process.id}-automation-uplift`,
        processId: process.id,
        title: "Increase workflow automation coverage",
        priority: process.criticality === "mission_critical" ? "urgent" : "high",
        expectedImpact: "Reduce manual handoffs and execution latency.",
        estimatedEffort: "Medium",
        targetMetric: "Automation coverage",
      });
    }

    if (process.defectRate > 3) {
      opportunities.push({
        id: `${process.id}-defect-reduction`,
        processId: process.id,
        title: "Reduce process defect rate",
        priority: "high",
        expectedImpact: "Improve quality, compliance, and operational reliability.",
        estimatedEffort: "Medium",
        targetMetric: "Defect rate",
      });
    }

    return opportunities;
  });
}
