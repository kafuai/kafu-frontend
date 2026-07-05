import type { OperationalControl } from "./operationalControl";

export interface OperationalControlPolicy {
  readonly requireActiveControls: boolean;
  readonly allowCriticalControls: boolean;
  readonly allowedOwners?: readonly string[];
}

export function satisfiesOperationalControlPolicy(
  control: OperationalControl,
  policy: OperationalControlPolicy,
): boolean {
  if (policy.requireActiveControls && control.status !== "active") {
    return false;
  }

  if (!policy.allowCriticalControls && control.severity === "critical") {
    return false;
  }

  if (
    policy.allowedOwners !== undefined &&
    !policy.allowedOwners.includes(control.owner)
  ) {
    return false;
  }

  return true;
}