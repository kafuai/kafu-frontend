import { AdminActivity } from "./adminActivity";

export interface AdminAuditEntry extends AdminActivity {
  ipAddress?: string;
  userAgent?: string;
  message: string;
}

export function createAdminAuditEntry(
  entry: AdminAuditEntry,
): AdminAuditEntry {
  return entry;
}
