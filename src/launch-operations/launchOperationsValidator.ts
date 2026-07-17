import { LaunchOperationsContext } from "./launchOperationsContext";

export function validateLaunchOperations(
  context: LaunchOperationsContext,
): string[] {
  const issues: string[] = [];

  if (!context.launch.organizationId.trim()) {
    issues.push("Organization ID is required.");
  }

  if (!context.launch.launchName.trim()) {
    issues.push("Launch name is required.");
  }

  if (!context.launch.launchOwner.trim()) {
    issues.push("Launch owner is required.");
  }

  if (!context.launch.targetLaunchDate.trim()) {
    issues.push("Target launch date is required.");
  }

  if (context.launchObjectives.length === 0) {
    issues.push("At least one launch objective is required.");
  }

  if (context.escalationContacts.length === 0) {
    issues.push("At least one escalation contact is required.");
  }

  return issues;
}
