export interface SupportEscalation {
  id: string;
  ticketId: string;
  level: number;
  reason: string;
  escalatedAt: Date;
}

export function createSupportEscalation(
  escalation: SupportEscalation,
): SupportEscalation {
  return escalation;
}
