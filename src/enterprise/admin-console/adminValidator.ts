import { AdminConsole } from "./adminConsole";

export interface AdminValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateAdminConsole(
  console: AdminConsole,
): AdminValidationResult {
  const errors: string[] = [];

  if (!console.id) errors.push("Admin console id is required");
  if (!console.name) errors.push("Admin console name is required");
  if (!console.context.tenantId) errors.push("Tenant id is required");
  if (!console.context.actorId) errors.push("Actor id is required");

  return {
    valid: errors.length === 0,
    errors,
  };
}
