export type LaunchIncidentSeverity =
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface LaunchIncidentPlan {
  incidentOwner: string;
  responseTeam: string[];
  communicationChannels: string[];
  severity: LaunchIncidentSeverity;
  responseTargetMinutes: number;
  resolutionTargetMinutes: number;
  recoverySteps: string[];
}

export function createLaunchIncidentPlan(
  plan: LaunchIncidentPlan,
): LaunchIncidentPlan {
  return {
    ...plan,
    responseTeam: [...plan.responseTeam],
    communicationChannels: [...plan.communicationChannels],
    recoverySteps: [...plan.recoverySteps],
  };
}
