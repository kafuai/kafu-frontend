import { SupportEvent } from "./supportEvent";

export interface SupportAuditEntry extends SupportEvent {
  actorId: string;
  message: string;
}
