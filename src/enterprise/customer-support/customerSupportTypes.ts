export type SupportPriority = "low" | "medium" | "high" | "critical";

export type SupportStatus =
  | "open"
  | "in_progress"
  | "waiting_customer"
  | "escalated"
  | "resolved"
  | "closed";

export type SupportChannel =
  | "email"
  | "chat"
  | "phone"
  | "portal"
  | "api";

export interface CustomerSupportContext {
  tenantId: string;
  customerId: string;
  workspaceId?: string;
  channel: SupportChannel;
}
