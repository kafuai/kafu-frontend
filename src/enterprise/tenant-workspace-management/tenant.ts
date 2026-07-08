import type { TenantStatus } from "./tenantWorkspaceTypes";

export interface Tenant {
  id: string;
  name: string;
  status: TenantStatus;
  primaryRegion: string;
}

export function createTenant(
  tenant: Tenant,
): Tenant {
  return tenant;
}
