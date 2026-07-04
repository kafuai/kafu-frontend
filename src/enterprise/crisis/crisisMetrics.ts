import { Crisis, CrisisSeverity, CrisisStatus } from "./crisisTypes";

export type CrisisMetrics = {
  totalCrises: number;
  activeCrises: number;
  resolvedCrises: number;
  criticalCrises: number;
  averageResolutionHours: number;
};

export function calculateCrisisMetrics(crises: Crisis[]): CrisisMetrics {
  const resolved = crises.filter(
    (crisis) => crisis.status === "resolved" || crisis.status === "closed",
  );

  const resolutionHours = resolved
    .filter((crisis) => crisis.detectedAt && crisis.resolvedAt)
    .map((crisis) => {
      const start = new Date(crisis.detectedAt).getTime();
      const end = new Date(crisis.resolvedAt as string).getTime();
      return Math.max(0, (end - start) / 36e5);
    });

  return {
    totalCrises: crises.length,
    activeCrises: crises.filter((crisis) =>
      ["identified", "assessing", "active", "contained"].includes(
        crisis.status,
      ),
    ).length,
    resolvedCrises: resolved.length,
    criticalCrises: crises.filter((crisis) => crisis.severity === "critical")
      .length,
    averageResolutionHours:
      resolutionHours.length === 0
        ? 0
        : resolutionHours.reduce((sum, hours) => sum + hours, 0) /
          resolutionHours.length,
  };
}