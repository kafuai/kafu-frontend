import { LaunchOperationsContext } from "./launchOperationsContext";

export interface LaunchOperationsSummary {
  organizationId: string;
  launchName: string;
  launchOwner: string;
  status: string;
  targetLaunchDate: string;
  objectiveCount: number;
  operationalRiskCount: number;
  escalationContactCount: number;
}

export function buildLaunchOperationsSummary(
  context: LaunchOperationsContext,
): LaunchOperationsSummary {
  return {
    organizationId: context.launch.organizationId,
    launchName: context.launch.launchName,
    launchOwner: context.launch.launchOwner,
    status: context.launch.status,
    targetLaunchDate: context.launch.targetLaunchDate,
    objectiveCount: context.launchObjectives.length,
    operationalRiskCount: context.operationalRisks.length,
    escalationContactCount: context.escalationContacts.length,
  };
}
