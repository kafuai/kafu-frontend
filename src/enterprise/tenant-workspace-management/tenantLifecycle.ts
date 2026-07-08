import type { TenantStatus } from "./tenantWorkspaceTypes";

export interface TenantLifecycle {
  tenantId: string;
  status: TenantStatus;
  updatedAt: Date;
}

export function updateTenantStatus(
  lifecycle: TenantLifecycle,
  status: TenantStatus,
): TenantLifecycle {
  return {
    ...lifecycle,
    status,
    updatedAt: new Date(),
  };
}
