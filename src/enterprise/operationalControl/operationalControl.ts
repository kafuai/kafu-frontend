export type OperationalControlStatus =
  | "active"
  | "inactive"
  | "paused"
  | "blocked";

export type OperationalControlSeverity =
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface OperationalControl {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly status: OperationalControlStatus;
  readonly severity: OperationalControlSeverity;
  readonly owner: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export function isOperationalControlActive(
  control: OperationalControl,
): boolean {
  return control.status === "active";
}

export function isOperationalControlBlocking(
  control: OperationalControl,
): boolean {
  return (
    control.status === "blocked" ||
    control.severity === "critical"
  );
}