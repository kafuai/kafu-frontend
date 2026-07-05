import type {
  ExecutionCoordinator,
  ExecutionCoordinatorType,
} from "./executionCoordinator";

export interface CreateExecutionCoordinatorOptions {
  id: string;
  name: string;
  type: ExecutionCoordinatorType;
  capability: string;
  available?: boolean;
}

export function createExecutionCoordinator(
  options: CreateExecutionCoordinatorOptions,
): ExecutionCoordinator {
  return {
    id: options.id,
    name: options.name,
    type: options.type,
    capability: options.capability,
    available: options.available ?? true,
  };
}