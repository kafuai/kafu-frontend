import type {
  ExecutiveHealthStatus,
  ExecutiveKpi,
  ExecutiveKpiPriority,
} from "./executiveKpiTypes";

function priorityWeight(
  priority: ExecutiveKpiPriority,
): number {
  switch (priority) {
    case "critical":
      return 100;
    case "high":
      return 75;
    case "medium":
      return 50;
    case "low":
      return 25;
  }
}

function healthWeight(
  status: ExecutiveHealthStatus,
): number {
  switch (status) {
    case "critical":
      return 100;
    case "attention":
      return 60;
    case "healthy":
      return 10;
  }
}

function attainmentPenalty(
  kpi: ExecutiveKpi,
): number {
  if (kpi.attainment === undefined) {
    return 0;
  }

  const attainment = Math.min(
    1,
    Math.max(0, kpi.attainment),
  );

  return Math.round((1 - attainment) * 100);
}

export function calculateExecutiveAlertScore(
  kpi: ExecutiveKpi,
): number {
  const score =
    priorityWeight(kpi.priority) * 0.45 +
    healthWeight(kpi.status) * 0.4 +
    attainmentPenalty(kpi) * 0.15;

  return Math.min(
    100,
    Math.max(0, Math.round(score)),
  );
}