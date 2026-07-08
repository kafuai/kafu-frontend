import { SupportTicket } from "./supportTicket";

export interface SupportValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateSupportTicket(
  ticket: SupportTicket,
): SupportValidationResult {
  const errors: string[] = [];

  if (!ticket.id) errors.push("Ticket id is required");
  if (!ticket.subject) errors.push("Subject is required");
  if (!ticket.context.tenantId) errors.push("Tenant id is required");

  return {
    valid: errors.length === 0,
    errors,
  };
}
