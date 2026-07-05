import {
  type OperationalControl,
  type OperationalControlSeverity,
} from "./operationalControl";

export interface CreateOperationalControlInput {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly owner: string;
  readonly severity: OperationalControlSeverity;
}

export function createOperationalControl(
  input: CreateOperationalControlInput,
): OperationalControl {
  const timestamp = new Date().toISOString();

  return {
    id: input.id,
    name: input.name,
    description: input.description,
    owner: input.owner,
    severity: input.severity,
    status: "active",
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}