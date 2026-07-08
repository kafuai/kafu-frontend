export type SupportEventType =
  | "ticket_created"
  | "ticket_assigned"
  | "ticket_escalated"
  | "ticket_closed";

export interface SupportEvent {
  id: string;
  ticketId: string;
  type: SupportEventType;
  createdAt: Date;
}
