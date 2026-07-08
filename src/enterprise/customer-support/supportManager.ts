import { SupportService } from "./supportService";
import { SupportTicket } from "./supportTicket";

export class SupportManager {
  constructor(private readonly service: SupportService) {}

  create(ticket: SupportTicket): SupportTicket {
    return this.service.create(ticket);
  }

  list(): SupportTicket[] {
    return this.service.list();
  }
}
