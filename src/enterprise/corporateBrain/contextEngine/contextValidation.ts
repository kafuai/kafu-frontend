import { EnterpriseContext } from "./contextTypes";

export interface ContextValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateEnterpriseContext(
  context: EnterpriseContext,
): ContextValidationResult {
  const errors: string[] = [];

  if (!context.id.trim()) errors.push("Context id is required.");
  if (!context.name.trim()) errors.push("Context name is required.");
  if (!context.metadata.tenantId.trim()) errors.push("Tenant id is required.");
  if (!context.metadata.createdAt.trim()) errors.push("Created date is required.");
  if (!context.metadata.updatedAt.trim()) errors.push("Updated date is required.");

  return {
    valid: errors.length === 0,
    errors,
  };
}