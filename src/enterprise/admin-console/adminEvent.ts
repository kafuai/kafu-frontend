export type AdminEventType =
  | "login"
  | "logout"
  | "configuration_changed"
  | "maintenance_started"
  | "maintenance_completed";

export interface AdminEvent {
  id: string;
  tenantId: string;
  type: AdminEventType;
  actorId: string;
  createdAt: Date;
}
