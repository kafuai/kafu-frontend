import type { OperationRecord } from "./operation-record";

export interface OperationValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateOperation(
  operation: OperationRecord
): OperationValidationResult {
  const errors: string[] = [];

  if (!operation.id.trim()) errors.push("Operation id is required.");
  if (!operation.tenantId.trim()) errors.push("Tenant id is required.");
  if (!operation.actionId.trim()) errors.push("Action id is required.");
  if (!operation.name.trim()) errors.push("Operation name is required.");

  return {
    valid: errors.length === 0,
    errors,
  };
}