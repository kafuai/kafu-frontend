import {
  AdminAccessLevel,
  AdminConsoleContext,
  AdminConsoleStatus,
} from "./adminConsoleTypes";

export interface AdminConsoleFactoryInput {
  tenantId: string;
  actorId: string;
  workspaceId?: string;
  accessLevel?: AdminAccessLevel;
  status?: AdminConsoleStatus;
}

export function createAdminConsoleContext(
  input: AdminConsoleFactoryInput,
): AdminConsoleContext {
  return {
    tenantId: input.tenantId,
    workspaceId: input.workspaceId,
    actorId: input.actorId,
    accessLevel: input.accessLevel ?? "admin",
    status: input.status ?? "active",
  };
}
