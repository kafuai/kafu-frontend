export type LaunchHealthLevel =
  | "healthy"
  | "degraded"
  | "critical"
  | "unknown";

export interface LaunchHealthStatus {
  level: LaunchHealthLevel;
  uptimePercentage: number;
  activeIncidents: number;
  unresolvedAlerts: number;
  lastCheckedAt?: string;
}

export function isLaunchHealthStable(
  status: LaunchHealthStatus,
): boolean {
  return (
    status.level === "healthy" &&
    status.activeIncidents === 0 &&
    status.unresolvedAlerts === 0
  );
}
