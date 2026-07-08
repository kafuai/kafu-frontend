import { SupportTicket } from "./supportTicket";

export interface SupportCase {
  id: string;
  ticket: SupportTicket;
  ownerId?: string;
  openedAt: Date;
  closedAt?: Date;
}

export function isSupportCaseOpen(supportCase: SupportCase): boolean {
  return !supportCase.closedAt;
}
