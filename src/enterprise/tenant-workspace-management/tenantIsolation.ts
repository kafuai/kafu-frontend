export interface TenantIsolation {
  tenantId: string;
  isolated: boolean;
  isolationStrategy: string;
}

export function isTenantIsolated(
  isolation: TenantIsolation,
): boolean {
  return isolation.isolated;
}