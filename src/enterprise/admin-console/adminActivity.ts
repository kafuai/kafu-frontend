export type AdminActivityType =
  | "login"
  | "logout"
  | "viewed_dashboard"
  | "updated_settings"
  | "managed_user";

export interface AdminActivity {
  id: string;
  tenantId: string;
  actorId: string;
  type: AdminActivityType;
  createdAt: Date;
}
