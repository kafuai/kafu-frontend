import type {
  OperationalControl,
  OperationalControlStatus,
} from "./operationalControl";

export interface OperationalControlChange {
  readonly controlId: string;
  readonly changedAt: string;
  readonly changedBy: string;
  readonly previousStatus: OperationalControlStatus;
  readonly nextStatus: OperationalControlStatus;
  readonly reason: string;
}

export function applyOperationalControlStatusChange(
  control: OperationalControl,
  change: OperationalControlChange,
): OperationalControl {
  if (control.id !== change.controlId) {
    return control;
  }

  return {
    ...control,
    status: change.nextStatus,
    updatedAt: change.changedAt,
  };
}