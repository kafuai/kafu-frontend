import { SupportTicket } from "./supportTicket";

export interface SupportQueue {
  id: string;
  tenantId: string;
  name: string;
  tickets: SupportTicket[];
}

export function enqueueSupportTicket(
  queue: SupportQueue,
  ticket: SupportTicket,
): SupportQueue {
  return {
    ...queue,
    tickets: [...queue.tickets, ticket],
  };
}
