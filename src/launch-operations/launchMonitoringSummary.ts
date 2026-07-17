import { LaunchHealthStatus } from "./launchHealthStatus";
import { LaunchMonitoringPlan } from "./launchMonitoringPlan";

export interface LaunchMonitoringSummary {
  organizationId: string;
  monitoringOwner: string;
  monitoredServiceCount: number;
  successMetricCount: number;
  healthLevel: string;
  uptimePercentage: number;
  activeIncidents: number;
  unresolvedAlerts: number;
  stable: boolean;
}

export function buildLaunchMonitoringSummary(
  plan: LaunchMonitoringPlan,
  health: LaunchHealthStatus,
): LaunchMonitoringSummary {
  return {
    organizationId: plan.organizationId,
    monitoringOwner: plan.monitoringOwner,
    monitoredServiceCount: plan.monitoredServices.length,
    successMetricCount: plan.successMetrics.length,
    healthLevel: health.level,
    uptimePercentage: health.uptimePercentage,
    activeIncidents: health.activeIncidents,
    unresolvedAlerts: health.unresolvedAlerts,
    stable:
      health.level === "healthy" &&
      health.activeIncidents === 0 &&
      health.unresolvedAlerts === 0,
  };
}
