import { SupportTicket } from "./supportTicket";

export class SupportService {
  private readonly tickets = new Map<string, SupportTicket>();

  create(ticket: SupportTicket): SupportTicket {
    this.tickets.set(ticket.id, ticket);
    return ticket;
  }

  get(id: string): SupportTicket | undefined {
    return this.tickets.get(id);
  }

  list(): SupportTicket[] {
    return [...this.tickets.values()];
  }
}
