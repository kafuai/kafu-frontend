export interface LaunchMonitoringPlan {
  organizationId: string;
  monitoringOwner: string;
  monitoringWindowStart: string;
  monitoringWindowEnd: string;
  monitoredServices: string[];
  successMetrics: string[];
  alertChannels: string[];
}

export function createLaunchMonitoringPlan(
  plan: LaunchMonitoringPlan,
): LaunchMonitoringPlan {
  return {
    ...plan,
    monitoredServices: [...plan.monitoredServices],
    successMetrics: [...plan.successMetrics],
    alertChannels: [...plan.alertChannels],
  };
}
