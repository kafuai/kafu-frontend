import { LaunchEscalationLevel } from "./launchEscalationMatrix";
import { LaunchIncidentPlan } from "./launchIncidentPlan";
import { LaunchMonitoringPlan } from "./launchMonitoringPlan";

export interface LaunchMonitoringValidationInput {
  monitoringPlan: LaunchMonitoringPlan;
  incidentPlan: LaunchIncidentPlan;
  escalationMatrix: LaunchEscalationLevel[];
}

export function validateLaunchMonitoring(
  input: LaunchMonitoringValidationInput,
): string[] {
  const issues: string[] = [];

  if (!input.monitoringPlan.organizationId.trim()) {
    issues.push("Organization ID is required.");
  }

  if (!input.monitoringPlan.monitoringOwner.trim()) {
    issues.push("Monitoring owner is required.");
  }

  if (input.monitoringPlan.monitoredServices.length === 0) {
    issues.push("At least one monitored service is required.");
  }

  if (input.monitoringPlan.successMetrics.length === 0) {
    issues.push("At least one launch success metric is required.");
  }

  if (input.monitoringPlan.alertChannels.length === 0) {
    issues.push("At least one alert channel is required.");
  }

  if (!input.incidentPlan.incidentOwner.trim()) {
    issues.push("Incident owner is required.");
  }

  if (input.incidentPlan.responseTeam.length === 0) {
    issues.push("Incident response team is required.");
  }

  if (input.escalationMatrix.length === 0) {
    issues.push("Escalation matrix is required.");
  }

  return issues;
}
