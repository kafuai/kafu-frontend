import { AdminConsole } from "./adminConsole";

export interface AdminSnapshot {
  tenantId: string;
  consoles: AdminConsole[];
  capturedAt: Date;
}

export function createAdminSnapshot(
  tenantId: string,
  consoles: AdminConsole[],
): AdminSnapshot {
  return {
    tenantId,
    consoles,
    capturedAt: new Date(),
  };
}
