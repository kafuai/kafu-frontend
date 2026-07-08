import { EntitlementRecord } from "./entitlement";

export function resolveEntitlementByCode(
  entitlements: EntitlementRecord[],
  code: string,
): EntitlementRecord | undefined {
  return entitlements.find((entitlement) => entitlement.code === code);
}

export function resolveTenantEntitlements(
  entitlements: EntitlementRecord[],
  tenantId: string,
): EntitlementRecord[] {
  return entitlements.filter((entitlement) => entitlement.tenantId === tenantId);
}