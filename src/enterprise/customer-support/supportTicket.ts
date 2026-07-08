import {
  CustomerSupportContext,
  SupportPriority,
  SupportStatus,
} from "./customerSupportTypes";

export interface SupportTicket {
  id: string;
  context: CustomerSupportContext;
  subject: string;
  description: string;
  priority: SupportPriority;
  status: SupportStatus;
  createdAt: Date;
  updatedAt: Date;
}

export function createSupportTicket(ticket: SupportTicket): SupportTicket {
  return ticket;
}
