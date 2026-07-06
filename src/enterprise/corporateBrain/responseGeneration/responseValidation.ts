import { EnterpriseResponse } from "./responseTypes";

export interface ResponseValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateEnterpriseResponse(
  response: EnterpriseResponse,
): ResponseValidationResult {
  const errors: string[] = [];

  if (!response.id.trim()) errors.push("Response id is required.");
  if (!response.tenantId.trim()) errors.push("Tenant id is required.");
  if (!response.content.trim()) errors.push("Response content is required.");

  return {
    valid: errors.length === 0,
    errors,
  };
}