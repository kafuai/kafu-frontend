import { PostLaunchContext } from "./postLaunchContext";

export function validatePostLaunchContext(
  context: PostLaunchContext,
): string[] {
  const issues: string[] = [];

  if (!context.postLaunch.organizationId.trim()) {
    issues.push("Organization ID is required.");
  }

  if (!context.postLaunch.customerName.trim()) {
    issues.push("Customer name is required.");
  }

  if (!context.postLaunch.customerSuccessOwner.trim()) {
    issues.push("Customer success owner is required.");
  }

  if (!context.postLaunch.goLiveDate.trim()) {
    issues.push("Go-live date is required.");
  }

  if (context.successObjectives.length === 0) {
    issues.push("At least one customer success objective is required.");
  }

  return issues;
}
