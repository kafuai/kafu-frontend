export interface TenantRegion {
  tenantId: string;
  region: string;
  dataResidency: string;
}

export function relocateTenantRegion(
  tenant: TenantRegion,
  region: string,
): TenantRegion {
  return {
    ...tenant,
    region,
  };
}