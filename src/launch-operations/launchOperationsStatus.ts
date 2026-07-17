import { LaunchOperationsStatus } from "./launchOperationsTypes";

export function isLaunchOperationsActive(
  status: LaunchOperationsStatus,
): boolean {
  return status === "active" || status === "stabilizing";
}

export function isLaunchOperationsComplete(
  status: LaunchOperationsStatus,
): boolean {
  return status === "completed";
}

export function isLaunchOperationsBlocked(
  status: LaunchOperationsStatus,
): boolean {
  return status === "blocked";
}
