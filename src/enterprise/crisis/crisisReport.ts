import { Crisis } from "./crisisTypes";
import { CrisisMetrics, calculateCrisisMetrics } from "./crisisMetrics";

export type CrisisReport = {
  organizationId: string;
  generatedAt: string;
  metrics: CrisisMetrics;
  openCrises: Crisis[];
  recommendations: string[];
};

export function generateCrisisReport(
  organizationId: string,
  crises: Crisis[],
): CrisisReport {
  const organizationCrises = crises.filter(
    (crisis) => crisis.organizationId === organizationId,
  );

  const metrics = calculateCrisisMetrics(organizationCrises);

  const recommendations: string[] = [];

  if (metrics.criticalCrises > 0) {
    recommendations.push("Review executive escalation and command protocols.");
  }

  if (metrics.activeCrises > 0) {
    recommendations.push("Maintain frequent situation reports until closure.");
  }

  if (metrics.averageResolutionHours > 24) {
    recommendations.push("Improve response playbooks and decision velocity.");
  }

  return {
    organizationId,
    generatedAt: new Date().toISOString(),
    metrics,
    openCrises: organizationCrises.filter(
      (crisis) => crisis.status !== "resolved" && crisis.status !== "closed",
    ),
    recommendations,
  };
}